const layers = [5, 5, 2]; // Layers format
var isTraining = false;

// number of blocks
const population = 10;
var objSort = {};
var generationNumber = 0;
var creatures = [];
var nets = [];
const display = document.getElementById("canvas");
const ctx = display.getContext('2d');
var num = 0;
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

const moveSpeed = 5;
const rotationSpeed = 0.1;

var speedAmplifier = 1;

var bestHTML = document.getElementById("best");
var avgHTML = document.getElementById("avg");

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
    
    spawnFood(i);
}

function Board() {
    this.creatures = [];
    this.foods = [];
    this.time = 0;
    this.isTraining = false;
}

var crea;
var allCreatures = [];

const topCreatures = population * boards / 2;
const totalProbability = (100 - 98.92);

var rollGen = 6;

var NNxSpacing = 40;
var NNySpacing = 5;
var NNradius = 13;
var NNaxonSize = 3;
var NNxOffset = 25;
var NNyOffset = 25;

function spawnFood(l) {
    for (let mx = 0; mx < maxPellets; mx++) {
        if (board[l].foods.length >= maxPellets) break;
        let x = Math.random() * (display.width - 200) + 100 - 10;
        let y = Math.random() * (display.height - 200) + 100 - 10;


        board[l].foods.push(new Object(x, y, pelletSize << 1, pelletSize << 1, "gold"));
    }
}

function createBoxes() {
    creatures = [];
    for (let i = 0; i < boards; i++) {
        for (let j = 0; j < population; j++) {
            makeColor();
            board[i].creatures.push(new Creature(color));
        }
    }
}

function Object(x, y, w, h, c) {
    this.ox = x;
    this.oy = y;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = c;

    //this.type = t;
    this.overlap = function(b) {
        return (ue.abs(Math.round(this.x - b.x)) << 1 < (this.width + b.width)) &&
            (ue.abs(Math.round(this.y - b.y)) << 1 < (this.height + b.height));
    };

    this.check = false;
}

function makeColor() {
    let pr = Math.floor(Math.random() << 8);
    let pg = Math.floor(Math.random() << 8);
    let pb = Math.floor(Math.random() << 8);
    decide = Math.floor(Math.random() * 3);
    if (decide === 0) {
        pr = 255;
        decide = Math.floor(Math.random() << 1);
        if (decide === 0) pb = 0;
        if (decide === 1) pg = 0;
    } else if (decide === 1) {
        pg = 255;
        decide = Math.floor(Math.random() << 1);
        if (decide === 0) pr = 0;
        if (decide === 1) pb = 0;
    } else if (decide === 2) {
        pb = 255;
        decide = Math.floor(Math.random() << 1);
        if (decide === 0) pr = 0;
        if (decide === 1) pg = 0;
    }

    color = "rgba(" + pr + ", " + pg + ", " + pb + ", 1)";
}

(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();