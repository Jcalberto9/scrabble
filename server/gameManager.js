const { v4: uuidv4 } = require('uuid');

class GameManager {
  constructor() {
    this.games = new Map();
    this.letterDistribution = {
      'A': { count: 9, points: 1 }, 'B': { count: 2, points: 3 }, 'C': { count: 2, points: 3 },
      'D': { count: 4, points: 2 }, 'E': { count: 12, points: 1 }, 'F': { count: 2, points: 4 },
      'G': { count: 3, points: 2 }, 'H': { count: 2, points: 4 }, 'I': { count: 9, points: 1 },
      'J': { count: 1, points: 8 }, 'K': { count: 1, points: 5 }, 'L': { count: 4, points: 1 },
      'M': { count: 2, points: 3 }, 'N': { count: 6, points: 1 }, 'O': { count: 8, points: 1 },
      'P': { count: 2, points: 3 }, 'Q': { count: 1, points: 10 }, 'R': { count: 6, points: 1 },
      'S': { count: 4, points: 1 }, 'T': { count: 6, points: 1 }, 'U': { count: 4, points: 1 },
      'V': { count: 2, points: 4 }, 'W': { count: 2, points: 4 }, 'X': { count: 1, points: 8 },
      'Y': { count: 2, points: 4 }, 'Z': { count: 1, points: 10 }, '_': { count: 2, points: 0 } // blank tiles
    };
  }

  createGame(roomCode) {
    const game = {
      roomCode,
      status: 'waiting', // waiting, playing, finished
      players: [],
      currentPlayerIndex: 0,
      board: this.createBoard(),
      tileBag: this.createTileBag(),
      turnCount: 0,
      consecutivePasses: 0,
      winner: null
    };

    this.games.set(roomCode, game);
    return game;
  }

  createBoard() {
    const board = Array(15).fill().map(() => Array(15).fill(null));

    // Premium squares (simplified layout)
    const premiumSquares = {
      '7,7': 'star', // center star
      '0,0': 'TW', '0,7': 'TW', '0,14': 'TW', '7,0': 'TW', '7,14': 'TW', '14,0': 'TW', '14,7': 'TW', '14,14': 'TW', // Triple Word
      '1,1': 'DW', '2,2': 'DW', '3,3': 'DW', '4,4': 'DW', '7,7': 'DW', '10,10': 'DW', '11,11': 'DW', '12,12': 'DW', '13,13': 'DW', // Double Word
      '1,5': 'TL', '1,9': 'TL', '5,1': 'TL', '5,5': 'TL', '5,9': 'TL', '5,13': 'TL', '9,1': 'TL', '9,5': 'TL', '9,9': 'TL', '9,13': 'TL', '13,5': 'TL', '13,9': 'TL', // Triple Letter
      '0,3': 'DL', '0,11': 'DL', '2,6': 'DL', '2,8': 'DL', '3,0': 'DL', '3,7': 'DL', '3,14': 'DL', '6,2': 'DL', '6,6': 'DL', '6,8': 'DL', '6,12': 'DL', '7,3': 'DL', '7,11': 'DL', '8,2': 'DL', '8,6': 'DL', '8,8': 'DL', '8,12': 'DL', '11,0': 'DL', '11,7': 'DL', '11,14': 'DL', '12,6': 'DL', '12,8': 'DL', '14,3': 'DL', '14,11': 'DL' // Double Letter
    };

    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const key = `${row},${col}`;
        board[row][col] = {
          letter: null,
          premium: premiumSquares[key] || null,
          isNew: false
        };
      }
    }

    return board;
  }

  createTileBag() {
    const tiles = [];
    for (const [letter, data] of Object.entries(this.letterDistribution)) {
      for (let i = 0; i < data.count; i++) {
        tiles.push({
          letter: letter,
          points: data.points
        });
      }
    }

    // Shuffle the tiles
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    return tiles;
  }

  addPlayer(roomCode, playerName, socketId) {
    const game = this.games.get(roomCode);
    if (!game) return null;

    const playerId = uuidv4();
    const player = {
      id: playerId,
      name: playerName,
      socketId,
      score: 0,
      tiles: [],
      isHost: game.players.length === 0
    };

    game.players.push(player);

    // Deal 7 tiles to the new player if game hasn't started
    if (game.status === 'waiting') {
      this.dealTilesToPlayer(game, player, 7);
    }

    return playerId;
  }

  removePlayer(roomCode, socketId) {
    const game = this.games.get(roomCode);
    if (!game) return;

    const playerIndex = game.players.findIndex(p => p.socketId === socketId);
    if (playerIndex === -1) return;

    // Return player's tiles to the bag
    const player = game.players[playerIndex];
    game.tileBag.push(...player.tiles);
    this.shuffleTileBag(game);

    game.players.splice(playerIndex, 1);

    // If current player was removed, advance to next player
    if (playerIndex <= game.currentPlayerIndex && game.players.length > 0) {
      game.currentPlayerIndex = game.currentPlayerIndex % game.players.length;
    }

    // If no players left or only one player, end game
    if (game.players.length <= 1 && game.status === 'playing') {
      game.status = 'finished';
      if (game.players.length === 1) {
        game.winner = game.players[0];
      }
    }
  }

  startGame(roomCode) {
    const game = this.games.get(roomCode);
    if (!game || game.status !== 'waiting') return false;

    game.status = 'playing';

    // Ensure all players have 7 tiles
    game.players.forEach(player => {
      while (player.tiles.length < 7 && game.tileBag.length > 0) {
        player.tiles.push(game.tileBag.pop());
      }
    });

    // Randomly select starting player
    game.currentPlayerIndex = Math.floor(Math.random() * game.players.length);

    return true;
  }

  makeMove(roomCode, move) {
    const game = this.games.get(roomCode);
    if (!game || game.status !== 'playing') {
      return { success: false, error: 'Game not active' };
    }

    const currentPlayer = game.players[game.currentPlayerIndex];

    // Validate move format and tiles
    if (!this.validateMoveFormat(move)) {
      return { success: false, error: 'Invalid move format' };
    }

    // Check if player has the required tiles
    if (!this.playerHasTiles(currentPlayer, move.tiles)) {
      return { success: false, error: 'Player does not have required tiles' };
    }

    // Validate board placement
    const boardValidation = this.validateBoardPlacement(game, move);
    if (!boardValidation.valid) {
      return { success: false, error: boardValidation.error };
    }

    // Calculate score
    const score = this.calculateScore(game, move);

    // Place tiles on board
    this.placeTilesOnBoard(game, move);

    // Remove tiles from player's hand
    this.removeTilesFromPlayer(currentPlayer, move.tiles);

    // Add score to player
    currentPlayer.score += score;

    // Deal new tiles to player
    this.dealTilesToPlayer(game, currentPlayer, move.tiles.length);

    // Reset consecutive passes
    game.consecutivePasses = 0;

    // Check for game end conditions
    if (currentPlayer.tiles.length === 0 || game.tileBag.length === 0) {
      this.endGame(game);
    } else {
      // Move to next player
      this.nextTurn(game);
    }

    return {
      success: true,
      move: {
        player: currentPlayer.name,
        word: move.word,
        score: score,
        tiles: move.tiles
      }
    };
  }

  validateMoveFormat(move) {
    return move &&
           typeof move.word === 'string' &&
           Array.isArray(move.tiles) &&
           move.tiles.length > 0 &&
           move.tiles.every(tile =>
             typeof tile.row === 'number' &&
             typeof tile.col === 'number' &&
             typeof tile.letter === 'string'
           );
  }

  playerHasTiles(player, tiles) {
    const playerTiles = [...player.tiles];

    for (const tile of tiles) {
      const tileIndex = playerTiles.findIndex(pt =>
        pt.letter === tile.letter || pt.letter === '_' // blank tile
      );

      if (tileIndex === -1) {
        return false;
      }

      playerTiles.splice(tileIndex, 1);
    }

    return true;
  }

  validateBoardPlacement(game, move) {
    const { board } = game;
    const { tiles } = move;

    // Check if tiles are within bounds
    for (const tile of tiles) {
      if (tile.row < 0 || tile.row >= 15 || tile.col < 0 || tile.col >= 15) {
        return { valid: false, error: 'Tile placement out of bounds' };
      }

      // Check if square is already occupied
      if (board[tile.row][tile.col].letter !== null) {
        return { valid: false, error: 'Square already occupied' };
      }
    }

    // Check if tiles form a straight line
    if (tiles.length > 1) {
      const isHorizontal = tiles.every(tile => tile.row === tiles[0].row);
      const isVertical = tiles.every(tile => tile.col === tiles[0].col);

      if (!isHorizontal && !isVertical) {
        return { valid: false, error: 'Tiles must be placed in a straight line' };
      }

      // Check for gaps in placement
      if (isHorizontal) {
        const cols = tiles.map(t => t.col).sort((a, b) => a - b);
        for (let i = 1; i < cols.length; i++) {
          if (cols[i] - cols[i-1] > 1) {
            // Check if there are existing tiles filling the gap
            for (let col = cols[i-1] + 1; col < cols[i]; col++) {
              if (board[tiles[0].row][col].letter === null) {
                return { valid: false, error: 'Gap in tile placement' };
              }
            }
          }
        }
      } else {
        const rows = tiles.map(t => t.row).sort((a, b) => a - b);
        for (let i = 1; i < rows.length; i++) {
          if (rows[i] - rows[i-1] > 1) {
            // Check if there are existing tiles filling the gap
            for (let row = rows[i-1] + 1; row < rows[i]; row++) {
              if (board[row][tiles[0].col].letter === null) {
                return { valid: false, error: 'Gap in tile placement' };
              }
            }
          }
        }
      }
    }

    // For first move, check if it covers the center star
    if (game.turnCount === 0) {
      const coversCenter = tiles.some(tile => tile.row === 7 && tile.col === 7);
      if (!coversCenter) {
        return { valid: false, error: 'First move must cover the center star' };
      }
    } else {
      // For subsequent moves, check if tiles connect to existing tiles
      const connectsToExisting = tiles.some(tile => {
        const adjacent = [
          { row: tile.row - 1, col: tile.col },
          { row: tile.row + 1, col: tile.col },
          { row: tile.row, col: tile.col - 1 },
          { row: tile.row, col: tile.col + 1 }
        ];

        return adjacent.some(adj =>
          adj.row >= 0 && adj.row < 15 &&
          adj.col >= 0 && adj.col < 15 &&
          board[adj.row][adj.col].letter !== null
        );
      });

      if (!connectsToExisting) {
        return { valid: false, error: 'Move must connect to existing tiles' };
      }
    }

    return { valid: true };
  }

  calculateScore(game, move) {
    const { board } = game;
    let totalScore = 0;
    let wordMultiplier = 1;

    // Calculate main word score
    for (const tile of move.tiles) {
      let tileScore = this.letterDistribution[tile.letter].points;
      const square = board[tile.row][tile.col];

      // Apply letter multipliers
      if (square.premium === 'DL') tileScore *= 2;
      if (square.premium === 'TL') tileScore *= 3;

      // Apply word multipliers
      if (square.premium === 'DW') wordMultiplier *= 2;
      if (square.premium === 'TW') wordMultiplier *= 3;

      totalScore += tileScore;
    }

    totalScore *= wordMultiplier;

    // Bonus for using all 7 tiles
    if (move.tiles.length === 7) {
      totalScore += 50;
    }

    return totalScore;
  }

  placeTilesOnBoard(game, move) {
    const { board } = game;

    for (const tile of move.tiles) {
      board[tile.row][tile.col].letter = tile.letter;
      board[tile.row][tile.col].isNew = true;
    }

    // Reset isNew flag for all tiles after a turn
    setTimeout(() => {
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          board[row][col].isNew = false;
        }
      }
    }, 5000); // Reset after 5 seconds for visual feedback
  }

  removeTilesFromPlayer(player, tiles) {
    for (const tile of tiles) {
      const tileIndex = player.tiles.findIndex(pt =>
        pt.letter === tile.letter || pt.letter === '_'
      );

      if (tileIndex !== -1) {
        player.tiles.splice(tileIndex, 1);
      }
    }
  }

  dealTilesToPlayer(game, player, count) {
    const tilesToDeal = Math.min(count, game.tileBag.length, 7 - player.tiles.length);

    for (let i = 0; i < tilesToDeal; i++) {
      if (game.tileBag.length > 0) {
        player.tiles.push(game.tileBag.pop());
      }
    }
  }

  passTurn(roomCode) {
    const game = this.games.get(roomCode);
    if (!game || game.status !== 'playing') return;

    game.consecutivePasses++;

    // End game if all players pass consecutively
    if (game.consecutivePasses >= game.players.length * 2) {
      this.endGame(game);
    } else {
      this.nextTurn(game);
    }
  }

  nextTurn(game) {
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.turnCount++;
  }

  endGame(game) {
    game.status = 'finished';

    // Determine winner by highest score
    let winner = game.players[0];
    for (const player of game.players) {
      if (player.score > winner.score) {
        winner = player;
      }
    }

    game.winner = winner;
  }

  shuffleTileBag(game) {
    const { tileBag } = game;
    for (let i = tileBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tileBag[i], tileBag[j]] = [tileBag[j], tileBag[i]];
    }
  }

  getGame(roomCode) {
    return this.games.get(roomCode);
  }

  getGameState(roomCode) {
    const game = this.games.get(roomCode);
    if (!game) return null;

    // Return game state without exposing other players' tiles
    return {
      roomCode: game.roomCode,
      status: game.status,
      players: game.players.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score,
        tileCount: p.tiles.length,
        isHost: p.isHost
      })),
      currentPlayerIndex: game.currentPlayerIndex,
      board: game.board,
      tilesRemaining: game.tileBag.length,
      turnCount: game.turnCount,
      winner: game.winner
    };
  }

  deleteGame(roomCode) {
    this.games.delete(roomCode);
  }
}

module.exports = GameManager;