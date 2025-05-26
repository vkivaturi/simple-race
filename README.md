# Simple Race Game

A simple Electron.js desktop racing game where a car completes laps around a rectangular track. The game features a timer to track completion time and pause functionality.

## Features

- Fullscreen racing game
- Rectangular race track
- Car automatically follows the track
- Lap timer
- Pause functionality (using Shift key)
- Start and Cancel race controls
- Modular pause system ready for bluetooth integration

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd simple-race
```

2. Install dependencies:
```bash
npm install
```

## Running the Game

To start the game:
```bash
npm start
```

## Controls

- **Start Race Button**: Begins the race
- **Cancel Race Button**: Stops the race and resets the car
- **Shift Key**: Pauses/Unpauses the car movement
- **ESC Key**: Exit fullscreen mode

## Game Rules

1. The car starts from the top of the track
2. Timer begins when you click "Start Race"
3. Use Shift key to pause car movement
4. Race completes when the car finishes one full lap
5. Your completion time is displayed on screen

## Project Structure

- `main.js` - Electron main process file
- `game.js` - Game logic and rendering
- `pauseHandler.js` - Modular pause system (ready for bluetooth integration)
- `index.html` - Game UI and canvas

## Future Enhancements

- Bluetooth control integration for pause functionality
- Multiple laps support
- High score system
- Different track layouts
- Multiple car options

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests! 