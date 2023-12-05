#include <Arduino.h>
#include <Stepper.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.

const char *ssid = "Barulah Kamar";
const char *password = "gantipassword";
const char *mqtt_server = "192.168.2.100";

WiFiClient espClient;
PubSubClient client(espClient);

const int stepsPerRevolution = 250; // change this to fit the number of steps per revolution
// for your motor

// initialize the stepper library on pins 8 through 11:
Stepper myStepper(stepsPerRevolution, D3, D2, D5, D6);

const int sensorCahaya = A0;
const int SensorHujan = D0;

void setup_wifi()
{

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("deviceapapunitu"))
    {
      Serial.println("connected");
      client.subscribe("Jemuran");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

bool posisi = 1;
const int putaran = 90;

void callback(char *topic, byte *payload, unsigned int length)
{

  // jika payload nya 1 maka jalankan ini
  if (payload[0] == '1')
  {
    if (posisi != 1)
    {
      // int stepsTaken = 0;
      for (int i = 0; i < putaran; i++)
      {
        yield();
        myStepper.step(-stepsPerRevolution);
        // stepsTaken++;
      }
      posisi = 1;
    }
  }
  else
  {
    if (posisi != 0)
    {
      for (int i = 0; i < putaran; i++)
      {
        yield();
        myStepper.step(stepsPerRevolution);
      }
      posisi = 0;
    }
  }
}

void setup()
{
  // set the speed at 60 rpm:
  myStepper.setSpeed(150);
  // initialize the serial port:
  Serial.begin(9600);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode(sensorCahaya, INPUT);
  pinMode(SensorHujan, INPUT);
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  const bool isHujan = digitalRead(SensorHujan);
  const int cahaya = analogRead(sensorCahaya);
  // kirimlah
  client.publish("Jemuran/Cahaya", String(cahaya).c_str());
  client.publish("Jemuran/Hujan", String(isHujan).c_str());
  client.publish("Jemuran/Posisi", String(posisi).c_str());
}