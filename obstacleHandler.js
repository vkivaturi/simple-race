class ObstacleHandler {
    constructor() {
        this.obstacle = null;
        this.nextObstacleTimeout = null;
        this.removeObstacleTimeout = null;
    }

    // Initialize obstacle system
    start() {
        this.scheduleNextObstacle();
    }

    // Stop obstacle system
    stop() {
        if (this.nextObstacleTimeout) {
            clearTimeout(this.nextObstacleTimeout);
        }
        if (this.removeObstacleTimeout) {
            clearTimeout(this.removeObstacleTimeout);
        }
        this.obstacle = null;
    }

    // Schedule next obstacle appearance
    scheduleNextObstacle() {
        const delay = Math.random() * (10000 - 5000) + 1000; // Random delay between 5-15 seconds
        this.nextObstacleTimeout = setTimeout(() => {
            // Get current car position from game state
            const event = new CustomEvent('requestCarPosition');
            document.dispatchEvent(event);
        }, delay);
    }

    // Create an obstacle on the track
    createObstacle(carPosition) {
        // Position obstacle 20% of track length ahead of car
        let obstaclePosition = carPosition + 0.05;
        if (obstaclePosition >= 1) {
            obstaclePosition -= 1; // Wrap around track
        }

        this.obstacle = {
            position: obstaclePosition,
            size: 40, // Size in pixels
            active: true
        };

        // Remove obstacle after 5 seconds
        this.removeObstacleTimeout = setTimeout(() => {
            this.obstacle = null;
            this.scheduleNextObstacle();
        }, 3000);
    }

    // Check for collision with car
    checkCollision(carPosition) {
        if (!this.obstacle || !this.obstacle.active) return false;

        // Calculate distance between car and obstacle (accounting for track wrap-around)
        let distance = Math.abs(carPosition - this.obstacle.position);
        if (distance > 0.5) {
            distance = 1 - distance; // Check shorter distance around track
        }

        // Convert distance to track percentage (approximately)
        const collisionThreshold = 0.02; // Adjust based on car and obstacle size
        return distance < collisionThreshold;
    }

    // Get current obstacle for rendering
    getObstacle() {
        return this.obstacle;
    }
}

export const obstacleHandler = new ObstacleHandler(); 