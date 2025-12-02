#!/usr/bin/env node

// Production startup script for Scrabble game
// This ensures proper environment setup before starting the server

const path = require('path');
const fs = require('fs');

// Set production environment
process.env.NODE_ENV = 'production';

// Check if client build exists
const buildPath = path.join(__dirname, 'client', 'build');
if (!fs.existsSync(buildPath)) {
  console.log('Client build not found. This is normal for development.');
  console.log('In production, ensure the client is built before starting.');
}

// Start the main server
console.log('Starting Scrabble game server...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT || 5000}`);

require('./server/index.js');