/**
 * Door sensor Concept.
 * written in JavaScript
 * by PlanetCloud
 * ---
 * Some optimizations are discarded to better understand the code.
 * The "Guard" object refers to the referee.
 */

// Return a Unix timestamp
function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Door object
 */
var Door = {
    id: theDoorID,
    isFullyOpened() {
        return doorIsFullyOpened; // boolean, true when the door is opened.
    },
    isProperlyOpened() {
        return doorIsProperlyOpened; // boolean, true when the door is closed.
    },
    nextProperState(doorState) {
        if (doorState === "open") {
            return this.isProperlyOpened();
        } else if (doorState === "closed") {
            return this.isFullyOpened();
        } else {
            throw "Error, the door is neither opened or closed.";
        }
    }
};

/**
 * This event should be dispatched when player interacted with the door.
 * > Attempt to open
 * > Open
 * > Close
 */
var event = new CustomEvent("playerInteraction", {
    doorState: Door.currentState() // (string) Current door state when/(seconds before) the event is triggered. Expected value: opened/closed/neither.
});

var lastInteraction = 0; // (Unix timestamp/Intiger) Timestamp of the last interaction with the door.
var cooldown = 30; // 30 seconds cooldown

Door.addEventListener("playerInteraction", event => {
    /**
     * This function only executes when the player interacted with the door.
     */

    // Ensure cooldown is finished
    if (getTimestamp() < lastInteraction + cooldown) {
        // Player interacted with the door before the cooldown ends.
        Guards.notifyCheatingActivity(
            `Player interacted with door ${Door.id} before cooldown ends.`
        );
        return;
    }

    // Ensure the door is properly opened/closed properly in 2 seconds
    setTimeout(() => {
        if (!Door.nextProperState(event.doorState())) {
            // Door is not properly opened/closed.
            Guards.notifyCheatingActivity(
                `Door ${Door.id} is not properly opened/closed in 2 seconds.`
            );
            return;
        }
    }, 2000);
});