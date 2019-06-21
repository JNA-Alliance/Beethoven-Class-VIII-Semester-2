const int doorID = 1; // Current door ID
const int sensorPinClosed = 2; // HIGH when door is properly closed
const int sensorPinOpened = 3; // HIGH when door is properly opened
const int guardsLedPin = 13; // This should be hooked to the Guard's panel
const int ledPin = 12; // On board LED pin
const unsigned long cooldown = 30000; // Cooldown in ms

bool requiresReset = false; // 0 = false, 1 = true. Requires the reset button to be pushed
int lastDoorState = 0; // 0 = Closed, 1 = Opened, 2 = Neither
unsigned long lastInteraction = 0; // Last player interaction with the door

void setup() {
	pinMode(sensorPinClosed, INPUT);
	pinMode(sensorPinOpened, INPUT);
	pinMode(guardsLedPin, OUTPUT);
	pinMode(ledPin, OUTPUT);
}

void loop() {

	if(requiresReset == true){
		// Board required a reset
		return;
	}

	if (currentDoorState() == lastDoorState) {
		// No interactions has happened
		return;
	}

	if (milis() < lastInteraction + cooldown) {
		// Player interacted with the door before cooldown ends
		alertGuards();
		return;
	}

	if(currentDoorState() == 2){
		// Door is not fully opened or properly closed
		// Wait 2 seconds and check if it is
		delay(2000); 
		if(currentDoorState() == 2){
			// Door is still not fully opened or properly closed
			alertGuards();
			return;
		}
	}

	lastInteraction = milis(); // Update last interaction
	updateDoorState();
}

int currentDoorState() {
	if (digitalRead(sensorPinClosed) == HIGH) {
		return = 0; // Door is properly closed
	} else if (digitalRead(sensorPinOpened) == HIGH) {
		return = 1; // Door is fully opened
	} else {
		return = 2; // Door is not properly opened or closed
	}
}

void updateDoorState() {
	lastDoorState = getCurrentDoorState();
}

void alertGuards(){
	digitalWrite(ledPin, HIGH);
	digitalWrite(guardsLedPin, HIGH);
	requiresReset = 1;
}