#include <FastLED.h>

#define PIN_DO_STEROWANIA 16
#define LICZBA_WSZYSTKICH_DIOD 15
#define JASNOSC_TRZYDZIESCI_PROCENT 76 

CRGB tablica_z_diodami[LICZBA_WSZYSTKICH_DIOD];
uint8_t przesuniecie_kolorow_teczy = 0;

void setup() {
  FastLED.addLeds<WS2812B, PIN_DO_STEROWANIA, GRB>(tablica_z_diodami, LICZBA_WSZYSTKICH_DIOD);
  FastLED.setBrightness(JASNOSC_TRZYDZIESCI_PROCENT);
}

void loop() {
  fill_rainbow(tablica_z_diodami, LICZBA_WSZYSTKICH_DIOD, przesuniecie_kolorow_teczy, 255 / LICZBA_WSZYSTKICH_DIOD);
  FastLED.show();
  
  przesuniecie_kolorow_teczy++;
  delay(20);
}
