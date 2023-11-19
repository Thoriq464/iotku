#include <Arduino.h>
#include <AccelStepper.h>

const int ldrPin = A0;
const int rainPin = D1;
const int steps_per_rev = 10000000;
AccelStepper motor(AccelStepper::FULL4WIRE, D3, D4, D5, D6);

void setup() {
  Serial.begin(9600);
  motor.setMaxSpeed(10000);
  motor.setAcceleration(9000);
}

void loop() {
  int ldrValue = analogRead(ldrPin);
  Serial.print("LDR Value: ");
  Serial.println(ldrValue);

  int rainValue = digitalRead(rainPin);
  Serial.print("Rain Value: ");
  Serial.println(rainValue);

  // Control the motor based on light and rain conditions
  if (ldrValue >= 700) {
    // It's dark
    if (rainValue == HIGH) {
      // It's raining and dark, rotate motor clockwise
      Serial.println("Dark and Raining, Rotating Motor Clockwise");
      motor.setSpeed(700);
      motor.runSpeed();
    } else {
      // It's dark, but not raining, rotate motor counter-clockwise
      Serial.println("Dark and Not Raining, Rotating Motor Counter-Clockwise");
      motor.setSpeed(-700);
      motor.runSpeed();
    }
  } else {
    // It's light
    Serial.println("Light, Stopping Motor");
    motor.stop();
  }

  delay(500);
}