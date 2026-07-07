const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readJsonFile(name, defaultValue = []) {
  try {
    const filePath = getFilePath(name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Erreur lecture ${name}:`, err.message);
    return defaultValue;
  }
}

function writeJsonFile(name, data) {
  try {
    fs.writeFileSync(getFilePath(name), JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Erreur écriture ${name}:`, err.message);
  }
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Generate ID for file-based storage
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

module.exports = {
  isMongoConnected,
  readJsonFile,
  writeJsonFile,
  generateId
};
