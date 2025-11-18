# Online Scrabble Game

A real-time multiplayer Scrabble game built with React and Node.js that supports up to 15 players simultaneously.

## Features

- **Multiplayer Support**: Play with 2-15 players in real-time
- **Room-based Gaming**: Create or join rooms with unique codes
- **Real-time Updates**: Live board updates using WebSocket connections
- **Drag & Drop Interface**: Intuitive tile placement with React DnD
- **Word Validation**: Built-in dictionary for word verification
- **Score Calculation**: Automatic scoring with premium square bonuses
- **Responsive Design**: Works on desktop and tablet devices
- **Game Management**: Host controls, turn management, and game state persistence

## Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **UUID** - Unique ID generation

### Frontend
- **React** - User interface library
- **Styled Components** - CSS-in-JS styling
- **React DnD** - Drag and drop functionality
- **Socket.IO Client** - Real-time communication

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Instructions

1. **Clone or navigate to the project directory**
   ```bash
   cd "Online game"
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Option 1: Start both server and client simultaneously
   npm run dev

   # Option 2: Start them separately
   # Terminal 1 (Server)
   npm run server

   # Terminal 2 (Client)
   npm run client
   ```

4. **Access the game**
   - Open your browser to `http://localhost:3000`
   - The backend server runs on `http://localhost:5000`

## How to Play

### Starting a Game

1. **Create a Room**
   - Enter your name
   - Click "Create New Game"
   - Share the generated room code with friends

2. **Join a Room**
   - Enter your name and the room code
   - Click "Join Existing Game"

3. **Game Setup**
   - Wait for 2-15 players to join
   - The host can start the game when ready

### Gameplay

1. **Your Turn**
   - Drag tiles from your rack to the board
   - Form valid words connecting to existing tiles
   - Enter the word you're spelling
   - Click "Play Word" to submit your move

2. **Scoring**
   - Letter values: A=1, B=3, C=3, D=2, E=1, F=4, G=2, H=4, I=1, J=8, K=5, L=1, M=3, N=1, O=1, P=3, Q=10, R=1, S=1, T=1, U=1, V=4, W=4, X=8, Y=4, Z=10
   - Premium squares multiply letter or word scores
   - Using all 7 tiles in one turn gives a 50-point bonus

3. **Winning**
   - Game ends when a player uses all their tiles
   - Or when all players pass consecutively
   - Highest score wins!

### Game Rules

- **First Move**: Must cover the center star (★)
- **Subsequent Moves**: Must connect to existing tiles
- **Valid Words**: Must be found in the built-in dictionary
- **Tile Placement**: Must be in a straight line (horizontal or vertical)
- **Turn Time**: No time limit, but be considerate of other players

## Game Controls

- **Drag & Drop**: Drag tiles from your rack to the board
- **Click to Remove**: Click placed tiles to return them to your rack
- **Pass Turn**: Skip your turn if you can't make a move
- **Word Input**: Type the word you're spelling for validation

## Premium Squares

- **Triple Word Score (Red)**: Multiplies entire word score by 3
- **Double Word Score (Pink)**: Multiplies entire word score by 2
- **Triple Letter Score (Blue)**: Multiplies letter score by 3
- **Double Letter Score (Light Blue)**: Multiplies letter score by 2
- **Star (Yellow)**: Center square, acts as Double Word Score for first move

## Project Structure

```
Online game/
├── server/
│   ├── index.js           # Main server file
│   ├── gameManager.js     # Game logic and state management
│   └── wordValidator.js   # Word validation system
├── client/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameBoard.js    # Game board component
│   │   │   ├── PlayerRack.js   # Player tile rack
│   │   │   ├── PlayerList.js   # Players list sidebar
│   │   │   ├── GameControls.js # Game control panel
│   │   │   ├── JoinRoom.js     # Room joining interface
│   │   │   └── GameOver.js     # End game screen
│   │   ├── App.js         # Main React component
│   │   └── index.js       # React entry point
│   └── package.json       # Client dependencies
├── package.json           # Server dependencies and scripts
└── README.md              # This file
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development servers (both client and server)
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run build` - Build client for production
- `npm run install-all` - Install all dependencies (server and client)

## Environment Variables

The game uses default ports but you can customize them:

- `PORT` - Server port (default: 5000)
- Client runs on port 3000 by default

## Customization

### Adding Words to Dictionary

Edit [server/wordValidator.js](server/wordValidator.js) to add more words to the dictionary:

```javascript
// Add words to any of the word arrays
const customWords = ['EXAMPLE', 'CUSTOM', 'WORD'];
```

### Modifying Game Rules

Edit [server/gameManager.js](server/gameManager.js) to customize:
- Maximum number of players (currently 15)
- Tile distribution
- Scoring rules
- Board layout

### Styling

The frontend uses Styled Components. Modify component files in `client/src/components/` to change the appearance.

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check that both server (port 5000) and client (port 3000) are running
   - Ensure no firewall is blocking the ports

2. **Word Not Accepted**
   - Check that the word is in the built-in dictionary
   - Ensure tiles are placed in a straight line
   - Verify the word connects to existing tiles (except first move)

3. **Tiles Not Dragging**
   - Ensure it's your turn
   - Try refreshing the page if drag & drop stops working

4. **Players Can't Join**
   - Check the room code is correct (6 characters)
   - Ensure the room isn't full (15 player limit)
   - Verify the game hasn't already started

### Performance

- The game is optimized for 15 players but works best with 2-8 players
- Large numbers of players may experience slower tile updates
- Consider using the game on a local network for best performance

## Contributing

Feel free to fork and improve the game! Some ideas:
- Better word dictionary integration
- Turn timer implementation
- Chat system
- Spectator mode
- Mobile-responsive design improvements
- AI players

## License

MIT License - Feel free to use and modify as needed!