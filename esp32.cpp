// #include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>

// --- Wi-Fi ---
const char *ssid = "SOLOFO";
const char *password = "Sol25Rak";

// --- Moteurs (pins ESP32) ---
const int A1 = 26;
const int A2 = 27;
const int VitesseA = 14;
const int Be1 = 25;
const int B2 = 33;
const int VitesseB = 32;

// --- Canaux PWM ---
const int canalA = 0;
const int canalB = 1;

WebServer server(80);

bool modeAutonome = false;
String etatRobot = "En attente...";
unsigned long dernierScan = 0;
const unsigned long intervalleScan = 50;

// --- Prototypes ---
float lireDistance(int angle);
void balayageEtDecision();

// === Fonctions moteurs ===
void stopMotor() {
  digitalWrite(A1, LOW); digitalWrite(A2, LOW);
  digitalWrite(Be1, LOW); digitalWrite(B2, LOW);
  ledcWrite(canalA, 0); ledcWrite(canalB, 0);
}

void avancer(int vitesse) {
  digitalWrite(A1, HIGH); digitalWrite(A2, LOW);
  digitalWrite(Be1, HIGH); digitalWrite(B2, LOW);
  ledcWrite(canalA, vitesse);
  ledcWrite(canalB, vitesse);
}

void reculer(int vitesse) {
  digitalWrite(A1, LOW); digitalWrite(A2, HIGH);
  digitalWrite(Be1, LOW); digitalWrite(B2, HIGH);
  ledcWrite(canalA, vitesse);
  ledcWrite(canalB, vitesse);
}

void tournerGauche(int vitesse) {
  digitalWrite(A1, HIGH); digitalWrite(A2, LOW);
  digitalWrite(Be1, LOW); digitalWrite(B2, HIGH);
  ledcWrite(canalA, vitesse);
  ledcWrite(canalB, vitesse);
}

void tournerDroite(int vitesse) {
  digitalWrite(A1, LOW); digitalWrite(A2, HIGH);
  digitalWrite(Be1, HIGH); digitalWrite(B2, LOW);
  ledcWrite(canalA, vitesse);
  ledcWrite(canalB, vitesse);
}

// === Gestion HTTP ===
void handleAvance() { avancer(200); server.send(200, "application/json", "{\"direction\":\"haut\"}"); }
void handleRecule() { reculer(200); server.send(200, "application/json", "{\"direction\":\"bas\"}"); }
void handleGauche() { tournerGauche(200); server.send(200, "application/json", "{\"direction\":\"gauche\"}"); }
void handleDroite() { tournerDroite(200); server.send(200, "application/json", "{\"direction\":\"droite\"}"); }
void handleStop() { stopMotor(); server.send(200, "application/json", "{\"direction\":\"stop\"}"); }
void handleAutonome() { modeAutonome = true; server.send(200, "application/json", "{\"mode\":\"autonome\"}"); }
void handleStopAutonome() { modeAutonome = false; stopMotor(); server.send(200, "application/json", "{\"mode\":\"manuel\"}"); }

void setup() {
  Serial.begin(9600);
  Serial2.begin(9600); // Communication avec ESP8266

  pinMode(A1, OUTPUT);
  pinMode(A2, OUTPUT);
  pinMode(Be1, OUTPUT);
  pinMode(B2, OUTPUT);

  // Config PWM
  ledcSetup(canalA, 1000, 8);
  ledcAttachPin(VitesseA, canalA);
  ledcSetup(canalB, 1000, 8);
  ledcAttachPin(VitesseB, canalB);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connecté");
  Serial.println(WiFi.localIP());

  // Endpoints HTTP
  server.on("/", HTTP_GET, []() { server.send(200, "text/plain", "Robot prêt !"); });
  server.on("/favicon.ico", HTTP_GET, []() { server.send(204); }); // pas de contenu

  
server.on("/status", HTTP_GET, []() {
  server.send(200, "application/json", "{\"status\":\"ok\"}");
});
  server.on("/etat", HTTP_GET, []() { server.send(200, "text/plain", etatRobot); });
  server.on("/ping", HTTP_GET, []() { server.send(200, "application/json", "{\"status\":\"pong\"}"); });
  server.on("/avance", HTTP_GET, handleAvance);
  server.on("/recule", HTTP_GET, handleRecule);
  server.on("/gauche", HTTP_GET, handleGauche);
  server.on("/droite", HTTP_GET, handleDroite);
  server.on("/stop", HTTP_GET, handleStop);
  server.on("/autonome", HTTP_GET, handleAutonome);
  server.on("/stopauto", HTTP_GET, handleStopAutonome);

  // Handler pour URL inconnue
  server.onNotFound([]() {
    server.send(404, "text/plain", "URL inconnue");
  });

  server.begin();
  stopMotor();
}

void loop() {
  server.handleClient();

  if (modeAutonome) {
    unsigned long maintenant = millis();
    if (maintenant - dernierScan >= intervalleScan) {
      dernierScan = maintenant;
      float distance = lireDistance(90);
      if (distance > 20) {
        etatRobot = "Le robot avance";
        avancer(200);
      } else {
        etatRobot = "Obstacle détecté";
        stopMotor();
        balayageEtDecision();
      }
    }
  }
}

// === Communication avec l’ESP8266 ===
float lireDistance(int angle) {
  Serial2.println("SCAN " + String(angle));
  unsigned long t0 = millis();
  while (!Serial2.available()) {
    if (millis() - t0 > 500) return 999;
  }
  String val = Serial2.readStringUntil('\n');
  return val.toFloat();
}

void balayageEtDecision() {
  float gauche = lireDistance(180);
  float centre = lireDistance(90);
  float droite = lireDistance(0);

  if ((gauche == 1 && centre == 1 && droite == 1) || droite == gauche) {
    etatRobot = "Aucun passage, recule";
    reculer(200);
    delay(200);
  } else if (gauche > droite && gauche > centre) {
    etatRobot = "Obstacle détecté, tourne à gauche";
    tournerGauche(200);
    delay(300);
  } else if (droite > gauche && droite > centre) {
    etatRobot = "Obstacle détecté, tourne à droite";
    tournerDroite(200);
    delay(300);
  }
  stopMotor();
}