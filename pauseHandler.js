class PauseHandler {
    constructor() {
        this.isPaused = false;
        this.pauseListeners = [];
        
        // Default keyboard handler
        this.setupKeyboardHandler();
    }

    setupKeyboardHandler() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                this.setPaused(true);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift') {
                this.setPaused(false);
            }
        });
    }

    // Method to add pause state change listeners
    addPauseListener(callback) {
        this.pauseListeners.push(callback);
    }

    // Method to set pause state
    setPaused(paused) {
        this.isPaused = paused;
        // Notify all listeners
        this.pauseListeners.forEach(listener => listener(paused));
    }

    // Method to check current pause state
    isPausedState() {
        return this.isPaused;
    }

    // Method to remove keyboard handlers (when switching to bluetooth)
    removeKeyboardHandlers() {
        document.removeEventListener('keydown');
        document.removeEventListener('keyup');
    }
}

// Export a single instance to be used across the application
export const pauseHandler = new PauseHandler(); 