const layers = [52, 26, 13, 2]; // Layers format
var isTraining = false;

// number of blocks
const population = 10;
var objSort = {};
var generationNumber = 0;
var creatures = [];
var nets = [];
const display = document.getElementById("canvas");
const ctx = display.getContext('2d');

const display2 = document.getElementById("canvas2");
const ctx2 = display2.getContext('2d');

const neuralNetDisplay = document.getElementById("canvas3");
const ctxN = neuralNetDisplay.getContext('2d');

var timeCount = 0;
var bestFitness = 0;
var worstFitness = 0;
var medFitness = 0;
var time = 0;
var avgFitness = 0;
var overlapScore = 0;

const pelletSize = 15;
const creatureSize = 30;
const maxPellets = 25;
const pelletValue = 1;
const slowPelletsNum = 50;
const maxScore = 100;

const defw = creatureSize * 2;
const defh = creatureSize * 2;

const offset = 0;

const width = 100;
const height = 100;

var decide = Math.random();
var overlaps = [];
var obl = [];

const mutability = 20;

const genTime = 15;
var bestEver = 0;

const speed = 5;
var speedAmplifier = 1;

var bestHTML = document.getElementById("best");
var avgHTML = document.getElementById("avg");
var worstHTML = document.getElementById("worst");

var bestPoints = [{
    x: 0,
    y: 1080
}];
var avgPoints = [{
    x: 0,
    y: 1080
}];
var worstPoints = [{
    x: 0,
    y: 1080
}];
var bestAveragePoints = [{
    x: 0,
    y: 1080
}, {
    x: 0,
    y: 1080
}];
var speedTimes = 0;

var streamMode = true;

var foods = [{}];

var board = [];
const boards = 5;
const halfPopulation = Math.floor((population * boards) / 2 - 1);
const bestCreature = population * boards - 1;

for (var i = 0; i < boards; i++) {
    board.push(new Board());
}

function Board() {
    this.creatures = [];
    this.foods = [];
    this.time = 0;
    this.isTraining = false;
}

var allCreatures = [];

const topCreatures = population * boards / 2;
const totalProbability = (100 - 98.92);

var rollGen = 6;

var NNxSpacing = 40;
var NNySpacing = 1;
var NNradius = 1;
var NNaxonSize = 1;
var NNxOffset = 25;
var NNyOffset = 10;
