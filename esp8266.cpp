#include <Arduino.h>
#include <Servo.h>

// --- Définition des pins ---
const int trigPin = 5;   // D1
const int echoPin = 4;   // D2
const int servoPin = 2;  // D4

Servo myServo;

// --- Setup ---
void setup() {
  Serial.begin(9600);  // communication avec l’ESP32 via TX/RX

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  myServo.attach(servoPin);

  myServo.write(90);  // servo centré
  delay(500);
  Serial.println("ESP8266 prêt");
}

// --- Fonction mesure ultrason ---
float mesureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duree = pulseIn(echoPin, HIGH, 30000); // timeout 30ms
  float distance = duree * 0.034 / 2.0; // en cm
  if (distance <= 0 || distance > 400) return 400; // hors plage
  return distance;
}

// --- Boucle principale ---
void loop() {
  if (Serial.available()) {
    String commande = Serial.readStringUntil('\n');
    commande.trim();

    if (commande.startsWith("SCAN")) {
      int angle = commande.substring(5).toInt();  // ex: "SCAN 90"
      if (angle < 0) angle = 0;
      if (angle > 180) angle = 180;

      myServo.write(angle);
      delay(500);  // temps pour stabiliser

      float dist = mesureDistance();
      Serial.println(dist); // on renvoie la distance à l’ESP32
    }
  }
}