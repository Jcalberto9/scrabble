const fs = require('fs');
const path = require('path');

class WordValidator {
  constructor() {
    this.validWords = new Set();
    this.loadWordList();
  }

  loadWordList() {
    try {
      // For this demo, we'll use a basic word list
      // In production, you'd load a comprehensive dictionary
      const basicWords = [
        'CAT', 'DOG', 'HOUSE', 'TREE', 'WATER', 'FIRE', 'EARTH', 'WIND',
        'HELLO', 'WORLD', 'GAME', 'PLAY', 'WORD', 'TILE', 'BOARD', 'SCORE',
        'QUICK', 'BROWN', 'FOX', 'JUMPS', 'OVER', 'LAZY', 'NEAR', 'FAR',
        'BIG', 'SMALL', 'FAST', 'SLOW', 'HOT', 'COLD', 'NEW', 'OLD',
        'GOOD', 'BAD', 'YES', 'NO', 'UP', 'DOWN', 'LEFT', 'RIGHT',
        'RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 'PURPLE',
        'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT',
        'NINE', 'TEN', 'FIRST', 'LAST', 'NEXT', 'BACK', 'FRONT',
        'TIME', 'DAY', 'NIGHT', 'YEAR', 'WEEK', 'MONTH', 'HOUR',
        'BOOK', 'PEN', 'PAPER', 'DESK', 'CHAIR', 'ROOM', 'DOOR',
        'HAPPY', 'SAD', 'ANGRY', 'CALM', 'LOVE', 'HATE', 'LIKE',
        'MAKE', 'TAKE', 'GIVE', 'GET', 'PUT', 'SET', 'RUN', 'WALK',
        'JUMP', 'SIT', 'STAND', 'LOOK', 'SEE', 'HEAR', 'FEEL',
        'THINK', 'KNOW', 'LEARN', 'TEACH', 'WORK', 'REST', 'SLEEP',
        'EAT', 'DRINK', 'FOOD', 'MEAT', 'FISH', 'BREAD', 'MILK',
        'APPLE', 'ORANGE', 'BANANA', 'GRAPE', 'LEMON', 'BERRY',
        'HAND', 'FOOT', 'HEAD', 'FACE', 'EYE', 'EAR', 'NOSE',
        'MOUTH', 'HAIR', 'NECK', 'ARM', 'LEG', 'BODY', 'HEART',
        'MAN', 'WOMAN', 'CHILD', 'BOY', 'GIRL', 'BABY', 'PERSON',
        'FRIEND', 'FAMILY', 'MOTHER', 'FATHER', 'SISTER', 'BROTHER',
        'CITY', 'TOWN', 'STREET', 'ROAD', 'CAR', 'BUS', 'TRAIN',
        'PLANE', 'BOAT', 'SHIP', 'BIKE', 'WALK', 'DRIVE', 'FLY',
        'MONEY', 'WORK', 'JOB', 'STORE', 'BUY', 'SELL', 'PAY',
        'SCHOOL', 'CLASS', 'STUDENT', 'TEACHER', 'LEARN', 'STUDY',
        'COMPUTER', 'PHONE', 'INTERNET', 'EMAIL', 'WEBSITE', 'ONLINE',
        'MUSIC', 'SONG', 'DANCE', 'SING', 'PLAY', 'LISTEN', 'WATCH',
        'MOVIE', 'SHOW', 'TV', 'RADIO', 'NEWS', 'STORY', 'TELL',
        'WEATHER', 'SUN', 'MOON', 'STAR', 'CLOUD', 'RAIN', 'SNOW',
        'ANIMAL', 'BIRD', 'HORSE', 'COW', 'PIG', 'SHEEP', 'CHICKEN',
        'PLANT', 'FLOWER', 'GRASS', 'LEAF', 'FRUIT', 'VEGETABLE',
        'SCRABBLE', 'LETTER', 'ALPHABET', 'SPELL', 'DICTIONARY'
      ];

      // Add common 2-letter words
      const twoLetterWords = [
        'AA', 'AB', 'AD', 'AE', 'AG', 'AH', 'AI', 'AL', 'AM', 'AN',
        'AR', 'AS', 'AT', 'AW', 'AX', 'AY', 'BA', 'BE', 'BI', 'BO',
        'BY', 'DA', 'DE', 'DO', 'ED', 'EF', 'EH', 'EL', 'EM', 'EN',
        'ER', 'ES', 'ET', 'EX', 'FA', 'FE', 'GO', 'HA', 'HE', 'HI',
        'HM', 'HO', 'ID', 'IF', 'IN', 'IS', 'IT', 'JO', 'KA', 'KI',
        'LA', 'LI', 'LO', 'MA', 'ME', 'MI', 'MM', 'MO', 'MU', 'MY',
        'NA', 'NE', 'NO', 'NU', 'OD', 'OE', 'OF', 'OH', 'OI', 'OK',
        'OM', 'ON', 'OP', 'OR', 'OS', 'OW', 'OX', 'OY', 'PA', 'PE',
        'PI', 'QI', 'RE', 'SH', 'SI', 'SO', 'TA', 'TI', 'TO', 'UH',
        'UM', 'UN', 'UP', 'US', 'UT', 'WE', 'WO', 'XI', 'XU', 'YA',
        'YE', 'YO', 'ZA'
      ];

      // Add common 3-letter words
      const threeLetterWords = [
        'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN',
        'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM',
        'HIS', 'HOW', 'ITS', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO',
        'WAY', 'WHO', 'BOY', 'DID', 'END', 'FEW', 'GOT', 'LET', 'MAN',
        'OWN', 'SAY', 'SHE', 'TOO', 'USE', 'ACT', 'AGE', 'AGO', 'AID',
        'AIM', 'AIR', 'ART', 'ASK', 'BAD', 'BAG', 'BAR', 'BED', 'BET',
        'BIT', 'BOX', 'BUS', 'BUY', 'CRY', 'CUP', 'CUT', 'EAR', 'EAT',
        'EGG', 'EYE', 'FAR', 'FIT', 'FLY', 'GUN', 'HIT', 'HOT', 'JOB',
        'LAY', 'LEG', 'LIE', 'LOT', 'LOW', 'MAP', 'MIX', 'NET', 'OIL',
        'PAY', 'PET', 'POT', 'PUT', 'RAN', 'RED', 'RUN', 'SAD', 'SAT',
        'SET', 'SIT', 'SIX', 'SUN', 'TEN', 'TOP', 'TRY', 'WIN', 'YET'
      ];

      // Combine all word lists
      const allWords = [...basicWords, ...twoLetterWords, ...threeLetterWords];

      // Add words to the set (case insensitive)
      allWords.forEach(word => {
        this.validWords.add(word.toUpperCase());
      });

      console.log(`Loaded ${this.validWords.size} words into dictionary`);

    } catch (error) {
      console.error('Error loading word list:', error);
      // Fallback to basic words if file loading fails
      this.validWords.add('HELLO');
      this.validWords.add('WORLD');
      this.validWords.add('GAME');
    }
  }

  validateWord(word) {
    if (!word || typeof word !== 'string') {
      return false;
    }

    const upperWord = word.toUpperCase().trim();

    // Check minimum length
    if (upperWord.length < 2) {
      return false;
    }

    // Check if word contains only letters
    if (!/^[A-Z]+$/.test(upperWord)) {
      return false;
    }

    // Check if word is in dictionary
    return this.validWords.has(upperWord);
  }

  // Method to add custom words (useful for testing or expansion)
  addWord(word) {
    if (word && typeof word === 'string') {
      this.validWords.add(word.toUpperCase().trim());
      return true;
    }
    return false;
  }

  // Method to check if a word exists without validation
  hasWord(word) {
    return this.validWords.has(word.toUpperCase().trim());
  }

  // Get word count for statistics
  getWordCount() {
    return this.validWords.size;
  }

  // Method to get random valid words (useful for hints or suggestions)
  getRandomWords(count = 5) {
    const wordsArray = Array.from(this.validWords);
    const randomWords = [];

    for (let i = 0; i < Math.min(count, wordsArray.length); i++) {
      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      randomWords.push(wordsArray[randomIndex]);
    }

    return randomWords;
  }
}

module.exports = WordValidator;