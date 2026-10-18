#include <iostream>
#include <cstdlib>
#include <string>
#include <thread>
#include <pqxx/pqxx>

#include "crow.h"
#include "MQTTClient.h"


std::string get_db_url(){
    if(getenv("DB_URL")) {
        std::cout << "Using database URL from environment variable: " << getenv("DB_URL") << std::endl;
        return getenv("DB_URL");
    } else {
        std::cout << "Environment variable DB_URL not set. Using default database URL." << std::endl;
        return "postgresql://user:password@localhost:5432/iot_db";
    }
}

std::string get_mqtt_url(){
    if(getenv("MQTT_URL")) {
        std::cout << "Using MQTT URL from environment variable: " << getenv("MQTT_URL") << std::endl;
        return getenv("MQTT_URL");
    } else {
        std::cout << "Environment variable MQTT_URL not set. Using default MQTT URL." << std::endl;
        return "tcp://localhost:1883";
    }
}

void db_worker(TSQueue<MQTTMessage>& messageQueue) {
    try {
        std::string conn_str =  get_db_url();
        pqxx::connection conn(conn_str);
        while (true) {
            std::optional<MQTTMessage> message = messageQueue.pop();
            
            if (!message) {
                std::cout << "Queue is shutting down, exiting db_worker." << std::endl;
                break;
            }

            std::cout << "Processing message from queue: " << message->topic << " - ";
            
            pqxx::work txn(conn);
        
            //TODO: Zmienic dane na dynamiczne wstawianie z sensora / payload'u
            txn.exec("INSERT INTO sensor_data (time, topic, temperature, humidity) VALUES (NOW(), 'test', 21.5, 60)");
            txn.commit(); 
            
            std::cout << "Size after processing: "  << messageQueue.size() << std::endl;
        }
    } catch (const std::exception &e) {
        std::cerr << "[DB THREAD ERROR] " << e.what() << std::endl;
    }
}

int main(int argc, char** argv){
    TSQueue<MQTTMessage> messageQueue;
    std::thread dbThread(db_worker, std::ref(messageQueue));

    //MQTT Client
    std::string mqtt_url = get_mqtt_url();
    MQTTClient mqttClient(mqtt_url, "perun_server", messageQueue);
    mqttClient.connect();
    mqttClient.subscribe("sensor/temperature", 1);

    //HTTP Routes
    {
        crow::SimpleApp app;

        CROW_ROUTE(app, "/")([](){
            crow::json::wvalue data;
            data["temperature"] = "21.5";
            data["humidity"] = "60%";
            data["status"] = "OK";
            data["timestamp"] = "2024-06-01T12:00:00Z";
        
            return data;
        });

        app.port(18080).multithreaded().run();
    }

    std::cout << "Shutting down..." << std::endl;
    messageQueue.shutdown();
    if(dbThread.joinable()) {
        dbThread.join();
    }


    mqttClient.disconnect();

    return 0;
}