#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <PubSubClient.h>

// --- KONFIGURACJA WI-FI ---
const char* ssid        = "";
const char* password    = "";

// --- KONFIGURACJA MQTT ---
// Podaj adres IP komputera, na którym działa docker z Mosquitto
const char* mqtt_server = "192.168.1.13"; 
const int   mqtt_port   = 1883;
const char* mqtt_topic  = "sensor/temperature";

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_AHTX0 aht;

unsigned long lastMsg = 0;
const long interval = 10000; // Wysyłaj co 10 sekund

void setup_wifi() {
  delay(10);
  Serial.print("Łączenie z siecią ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi połączone. IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Próba połączenia z MQTT...");
    // Unikalny ID klienta
    String clientId = "ESP32_AHT20_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println(" połączono!");
    } else {
      Serial.print(" błąd, rc=");
      Serial.print(client.state());
      Serial.println(" ponowna próba za 5 sekund");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  // Inicjalizacja AHT20 na pinach SDA=21, SCL=22
  Wire.begin(21, 22);
  if (!aht.begin()) {
    Serial.println("Błąd: Nie znaleziono czujnika AHT20!");
    while (1) delay(10);
  }
  Serial.println("AHT20 wykryty!");

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;

    sensors_event_t humidity, temp;
    aht.getEvent(&humidity, &temp);

    // Przygotowanie JSON zgodnego z main.cpp
    char payload[100];
    snprintf(payload, sizeof(payload), "{\"temperature\": %.2f, \"humidity\": %.2f}", 
             temp.temperature, 
             humidity.relative_humidity);

    Serial.print("Wysyłanie do MQTT: ");
    Serial.println(payload);

    client.publish(mqtt_topic, payload);
  }
}
