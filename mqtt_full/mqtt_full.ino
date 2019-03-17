/*********
 Based on Rui Santos work :
 https://randomnerdtutorials.com/esp32-mqtt-publish-subscribe-arduino-ide/
 Modified by GM
*********/
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "OneWire.h"
#include "DallasTemperature.h"

OneWire oneWire(23);
DallasTemperature tempSensor(&oneWire);

WiFiClient espClient;           // Wifi 
PubSubClient client(espClient); // MQTT client

/*===== MQTT broker/server and TOPICS ========*/
const char* mqtt_server = "L'IP_LOCAL_DE_VOTRE_PC_ICI"; /* "broker.shiftr.io"; */

#define TOPIC_TEMP "miage/m1/sensors/temperature"
#define TOPIC_LED  "miage/m1/sensors/led"

/*============= GPIO ======================*/
float temperature = 0;
float light = 0;
const int ledPin = 19; // LED Pin

const char* salle = "C3";
const char* expectedMaxTemp = "24";
const char* expectedMinTemp = "20";


/*============= Sensor & Led Control ======================*/
int sensorValue;
int sensorActivationValue;
String ledStatus;

/*================ WIFI =======================*/
void print_connection_status() {
  Serial.print("WiFi status : \n");
  Serial.print("\tIP address : ");
  Serial.println(WiFi.localIP());
  Serial.print("\tMAC address : ");
  Serial.println(WiFi.macAddress());
}

void connect_wifi() {
  const char* ssid = "VOTRE_SSID_ICI";
  const char *password= "VOTRE_PASSWORD_ICI";

  
  Serial.println("Connecting Wifi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect Wifi ..");
    delay(1000);
  }
  Serial.print("Connected to local Wifi\n");
  print_connection_status();
}

/*=============== SETUP =====================*/
void setup() {  
  pinMode(ledPin, OUTPUT);

  Serial.begin(9600);
  connect_wifi();
  tempSensor.begin();
  
  client.setServer(mqtt_server, 1883);
  // set callback when publishes arrive for the subscribed topic
  client.setCallback(mqtt_pubcallback); 

  sensorValue = analogRead(A0);
  sensorActivationValue = 240;
  ledStatus = "OFF";
}

/*============== CALLBACK ===================*/
void mqtt_pubcallback(char* topic, byte* message, 
                      unsigned int length) {
  // Callback if a message is published on this topic.
  
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");

  // Byte list to String and print to Serial
  String messageTemp;
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic,
  // you check if the message is either "on" or "off".
  // Changes the output state according to the message
  if (String(topic) == TOPIC_LED) {
    sensorActivationValue = messageTemp.toInt();
    Serial.print("Sensor is now triggered at : ");
    Serial.println(sensorActivationValue);
  }
}

void set_LED(int v){
  if (v == HIGH) {
    digitalWrite(ledPin, HIGH);
  } else if (v == LOW) {
    digitalWrite(ledPin, LOW);
  } else {
    digitalWrite(ledPin, LOW);
  }
  
}

/*============= SUBSCRIBE =====================*/
void mqtt_mysubscribe(char *topic) {
  while (!client.connected()) { // Loop until we're reconnected
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("esp32", "try", "try")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe(topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

float get_Temperature(){
  temperature = 0;
  tempSensor.requestTemperaturesByIndex(0);

  temperature = tempSensor.getTempCByIndex(0);

  return temperature;
}

void controlLightWithSensor(){
  sensorValue = analogRead(A0);

  if(sensorValue > sensorActivationValue)
  {
    digitalWrite(19, LOW);
    ledStatus = "OFF";
  }
  if(sensorValue <= sensorActivationValue)
  {
    digitalWrite(19, HIGH);
    ledStatus = "ON";
  }
}

/*================= LOOP ======================*/
void loop() {
  int32_t period = 50000; // 50 sec
  /*--- subscribe to TOPIC_LED if not yet ! */
  if (!client.connected()) { 
    mqtt_mysubscribe((char *)(TOPIC_LED));
  }

  

  /*--- Publish Temperature periodically   */
  delay(period);
  temperature = get_Temperature();
  // Convert the value to a char array
  char tempString[8];
  dtostrf(temperature, 1, 2, tempString);
  // Serial info
  Serial.print("Published Temperature : "); Serial.println(tempString);
  // MQTT Publish 
  String finalString = "{\"mac\": \"" + WiFi.macAddress() +"\"" + ", \"temperature\":" + "\"" + tempString + "\"" + ", \"salle\":" + "\"" + salle + "\"" + ", \"max\":" + "\"" + expectedMaxTemp + "\"" + ", \"min\":" + "\"" + expectedMinTemp + "\"" + "}";
  client.publish(TOPIC_TEMP,  finalString.c_str());

  controlLightWithSensor();
   
  client.loop(); // Process MQTT ... une fois par loop()
}
