// CONFIG //
const layers = [4, 2];
const mutability = 15;
const offset = 0;

const boards = 5;
const population = 10;
const maxPellets = 25;

const pelletValue = 1;
const maxScore = 100;

const speed = 5;
const topCreatures = 10;


const pelletSize = 15;
const creatureSize = 30;

const genTime = 15 * 100;
const rollGen = 6;

var streamMode = true;


// INITIAL VALUES //
var isTraining = false;
var objSort = {};
var generationNumber = 0;
var creatures = [];
var nets = [];

var timeCount = 0;
var bestFitness = 0;
var bestEver = 0;
var worstFitness = 0;
var medFitness = 0;
var time = 0;
var avgFitness = 0;
var overlapScore = 0;
var allCreatures = [];

var decide = Math.random();
var overlaps = [];
var obl = [];

var foods = [{}];

const totalProbability = (Math.log(1 - mutability / 100) / Math.log(0.99)) / mutability;

var board = [];

const halfPopulation = Math.floor((population * boards) / 2 - 1);
const bestCreature = population * boards - 1;

const defw = creatureSize * 2;
const defh = creatureSize * 2;

const width = 100;
const height = 100;

var speedAmplifier = 1;

const bestHTML = document.getElementById("best");
const avgHTML = document.getElementById("avg");

var speedTimes = 0;


var bestPoints = [{
    x: 0,
    y: 1080
}];

var avgPoints = [{
    x: 0,
    y: 1080
}];

var bestAveragePoints = [{
    x: 0,
    y: 1080
}];

// DISPLAYS //
const display = document.getElementById("canvas");
const ctx = display.getContext('2d');

const display2 = document.getElementById("canvas2");
const ctx2 = display2.getContext('2d');

const neuralNetDisplay = document.getElementById("canvas3");
const ctxN = neuralNetDisplay.getContext('2d');

// INITIATE BOARDS //
for (var i = 0; i < boards; i++) {
    board.push(new Board());
}

function Board() {
    this.creatures = [];
    this.foods = [];
    this.time = 0;
    this.isTraining = false;
}