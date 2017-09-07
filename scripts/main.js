function Object(x, y, w, h, c) {
    this.ox = x;
    this.oy = y;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = c;

    //this.type = t;
    this.overlap = function(obj) {
        if (this.x > obj.x + obj.width || this.x + this.width < obj.x || this.y > obj.y + obj.height || this.y + this.height < obj.y) {
            return false;
        } else {
            return true;
        }
    };
}

function wallLock(l) {
    for (let j = 0; j < population; j++) {
        let obj = board[l].creatures[j];

        if (obj.x < 0) {
            obj.x = 0;
        }

        if (obj.x + obj.width > display.width) {
            obj.x = display.width - obj.width;
        }

        if (obj.y < 0) {
            obj.y = 0;
        }

        if (obj.y + obj.height > display.height) {
            obj.y = display.height - obj.height;
        }
    }
}

function makeColor() {
    let pr = Math.floor(Math.random() * 256);
    let pg = Math.floor(Math.random() * 256);
    let pb = Math.floor(Math.random() * 256);
    decide = Math.floor(Math.random() * 3);
    if (decide === 0) {
        pr = 255;
        decide = Math.floor(Math.random() * 2);
        if (decide === 0) pb = 0;
        if (decide === 1) pg = 0;
    } else if (decide === 1) {
        pg = 255;
        decide = Math.floor(Math.random() * 2);
        if (decide === 0) pr = 0;
        if (decide === 1) pb = 0;
    } else if (decide === 2) {
        pb = 255;
        decide = Math.floor(Math.random() * 2);
        if (decide === 0) pr = 0;
        if (decide === 1) pg = 0;
    }

    color = "rgba(" + pr + ", " + pg + ", " + pb + ", 1)";
}

function doUpdate() {
    for (let f = 0; f < speedAmplifier; f++) {
        for (let l = 0; l < boards; l++) {
            Update(l);
            wallLock(l);
        }
    }
}

function fitnessSort(a, b) {
    return a.fitness - b.fitness;
}

function Update(l) {
    speedAmplifier = document.getElementById("speed").value;
    board[l].time++;


    if (board[l].time > genTime * 100) {
        board[l].isTraining = false;
        board[l].time = 0;
    }

    spawnFood(l);

    if (!board[l].isTraining) {
        board[l].isTraining = true;


        generationNumber += 1 / boards;

        if (generationNumber == 1 / boards) {
            createBoxes();
        }

        avgFitness = 0;

        for (let m = 0; m < population; m++) {
            allCreatures.push(board[l].creatures[m]);
        }

        if (allCreatures.length == population * boards) {
            board[l].foods = board[l].foods.slice(0, 1);
            spawnFood(l);

            generationNumber = Math.round(generationNumber);

            allCreatures.sort(fitnessSort);

            bestFitness = allCreatures[bestCreature].fitness;
            medFitness = allCreatures[halfPopulation].fitness;
            worstFitness = allCreatures[0].fitness;

            for (let g = 0, h = allCreatures.length; g < h; g += population) {
                temparray = allCreatures.slice(g, g + population);
                board[g / population].creatures = temparray;
            }

            for (let i = 0; i < allCreatures.length; i++) {
                let obj = allCreatures[i];
                avgFitness += obj.fitness / allCreatures.length;


                if (i < bestCreature - topCreatures) {
                    obj.copyNeuralNetwork(allCreatures[bestCreature - i % topCreatures]);
                    obj.mutate();
                }

                obj.fitness = 0;
            }

            avgFitness = Math.round(avgFitness);
            logFitness();
            allCreatures = [];
            if (streamMode) updateSpeed();
        }
    }


    for (let i = 0; i < board[l].creatures.length; i++) {
        let obj = board[l].creatures[i];
        let nearestFood = getNearestPellets(obj, l)[0];
        let input = [obj.x / 1920, obj.y / 1080, nearestFood.x / 1920, nearestFood.y / 1080]; // input is the x position, the y position, and time

        /*
        for (let mp = 0; mp < board[l].foods.length; mp++) {
            input.push(board[l].foods[mp].x / 1920);
            input.push(board[l].foods[mp].y / 1080);
        }

        for (let ml = 0; ml < board[l].creatures.length; ml++) {
            input.push(board[l].creatures[ml].x / 1920);
            input.push(board[l].creatures[ml].y / 1080);
        }
        */

        obj.lastInput = input;

        let output = obj.feedForward(input); // take input, return output

        obj.lastOutput = output;


        obj.x += output[0] * speed; // move based on output
        obj.y += output[1] * speed; // move based on output

        for (let j = board[l].foods.length - 1; j >= 0; j--) {
            if (obj.overlap(board[l].foods[j])) {
                obj.fitness += pelletValue;

                board[l].foods.splice(j, 1);
            }
        }
    }
}

function spawnFood(l) {
    for (let mx = 0; mx < maxPellets; mx++) {
        if (board[l].foods.length == maxPellets) break;
        let x = Math.random() * (display.width - 200) + 100 - 10;
        let y = Math.random() * (display.height - 200) + 100 - 10;


        board[l].foods.push(new Object(x, y, pelletSize * 2, pelletSize * 2, "gold"));
    }
}

function Render() {
    ctx.clearRect(0, 0, display.width, display.height);
    ctx2.clearRect(0, 0, display2.width, display2.height);
    ctx2.lineCap = "round";
    ctx2.lineJoin = "round";
    ctxN.clearRect(0, 0, neuralNetDisplay.width, neuralNetDisplay.height);

    for (let i = 0; i < board[boards - 1].creatures.length; i++) {
        let obj = board[boards - 1].creatures[i];

        ctx.fillStyle = obj.color;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(obj.x + creatureSize, obj.y + creatureSize, creatureSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    for (let i = 0; i < board[boards - 1].foods.length; i++) {
        let obj = board[boards - 1].foods[i];

        ctx.fillStyle = obj.color;
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(obj.x + pelletSize, obj.y + pelletSize, pelletSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    ctx2.lineWidth = 3;
    ctx2.strokeStyle = "#93f";
    ctx2.beginPath();
    ctx2.moveTo(bestAveragePoints[0].x, bestAveragePoints[0].y);
    for (let i = 1; i < bestAveragePoints.length; i++) {
        ctx2.lineTo(bestAveragePoints[i].x, bestAveragePoints[i].y);
    }
    ctx2.stroke();

    ctx2.lineWidth = 3;
    ctx2.strokeStyle = "#0f5";
    ctx2.beginPath();
    ctx2.moveTo(bestPoints[0].x, bestPoints[0].y);
    for (let i = 1; i < bestPoints.length; i++) {
        ctx2.lineTo(bestPoints[i].x, bestPoints[i].y);
    }
    ctx2.stroke();

    ctx2.lineWidth = 5;
    ctx2.strokeStyle = "#f00";
    ctx2.beginPath();
    ctx2.moveTo(avgPoints[0].x, avgPoints[0].y);
    for (let i = 1; i < avgPoints.length; i++) {
        ctx2.lineTo(avgPoints[i].x, avgPoints[i].y);
    }
    ctx2.stroke();

    ctx2.lineWidth = 2;
    ctx2.strokeStyle = "#555";
    ctx2.beginPath();
    ctx2.moveTo(worstPoints[0].x, worstPoints[0].y);
    for (let i = 1; i < worstPoints.length; i++) {
        ctx2.lineTo(worstPoints[i].x, worstPoints[i].y);
    }
    ctx2.stroke();

    ctxN.strokeStyle = "#222";
    ctxN.lineWidth = 3;
    ctxN.font = "15px Georgia";
    let crea = board[boards - 1].creatures[population - 1];
    for (let i = 0; i < layers.length; i++) {
        for (let j = 0; j < layers[i]; j++) {
            ctxN.fillStyle = "#333";
            ctxN.beginPath();
            ctxN.arc(i * 115 + 30, j * 40 + 25, 15, 0, Math.PI * 2);
            ctxN.stroke();
            ctxN.fill();

            ctxN.fillStyle = "#fff";
            ctxN.fillText(crea.network.neurons[i][j].toFixed(1), i * 115 + 18, j * 40 + 30);
        }
    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.fillStyle = "#fff";
    ctx.font = "48px Calibri";
    ctx.strokeText("B", crea.x + creatureSize / 2 + 3, crea.y + creatureSize + 14);
    ctx.fillText("B", crea.x + creatureSize / 2 + 3, crea.y + creatureSize + 14);

    for (let i = 0; i < crea.network.neurons.length - 1; i++) {
        for (let j = 0; j < crea.network.neurons[i].length; j++) {
            for (let k = 0; k < crea.network.neurons[i + 1].length; k++) {
                ctxN.strokeStyle = getAxonColor(i, j, k, crea);
                ctxN.beginPath();
                ctxN.moveTo(i * 115 + 45, j * 40 + 25);
                ctxN.lineTo((i + 1) * 115 + 15, k * 40 + 25);
                ctxN.stroke();
            }
        }
    }

    ctxN.fillStyle = crea.color;
    ctxN.strokeStyle = "#eee";
    ctxN.beginPath();
    ctxN.arc(260, 145, 15, 0, Math.PI * 2);
    ctxN.fill();
    ctxN.stroke();

    ctxN.lineWidth = 4;
    ctxN.strokeStyle = "#000";
    ctxN.fillStyle = "#fff";
    ctxN.font = "24px Calibri";
    ctxN.strokeText("B", 254, 152);
    ctxN.fillText("B", 254, 152);
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

let rollingCount = 0;
let bestFitCache = 0;

function logFitness() {
    bestFitnessAverage += bestFitness;
    rollingCount++;

    bestFitnessAverageD = bestFitnessAverage / rollingCount;

    if (rollingCount == rollGen) {
        bestFitnessAverage /= rollGen;
        bestFitCache = bestFitnessAverage;
    }

    bestHTML.innerHTML = bestFitness;
    document.getElementById("rbest").innerHTML = Math.round(bestFitCache);
    avgHTML.innerHTML = avgFitness;
    worstHTML.innerHTML = worstFitness;

    if (bestFitness > bestEver) {
        bestEver = bestFitness;
    }


    document.getElementById("record").innerHTML = bestEver;

    document.getElementById("generation").innerHTML = Math.round(generationNumber);

    graph();
}

let graphSegmentLength = 10;
let bestFitnessAverage = 0;

function graph() {
    bestPoints.push({
        y: display2.height - (display2.height / (maxScore / bestFitness)),
        x: bestPoints.length * graphSegmentLength
    });


    if (rollingCount == rollGen) {
        bestAveragePoints.push({
            y: display2.height - (display2.height / (maxScore / bestFitnessAverage)),
            x: bestPoints.length * graphSegmentLength
        });

        rollingCount = 0;
        bestFitnessAverage = 0;
    } else {
        bestAveragePoints[bestAveragePoints.length - 1].x = bestPoints[bestPoints.length - 1].x;
        bestAveragePoints[bestAveragePoints.length - 1].y = display2.height - (display2.height / (maxScore / bestFitnessAverageD));
    }

    avgPoints.push({
        y: display2.height - (display2.height / (maxScore / avgFitness)),
        x: avgPoints.length * graphSegmentLength
    });

    worstPoints.push({
        y: display2.height - (display2.height / (maxScore / worstFitness)),
        x: worstPoints.length * graphSegmentLength
    });

    if (bestPoints[bestPoints.length - 1].x > display2.width) {
        for (let i = 0; i < bestPoints.length; i++) {
            bestPoints[i].x -= graphSegmentLength;
            avgPoints[i].x -= graphSegmentLength;
            worstPoints[i].x -= graphSegmentLength;
        }

        for (let i = 0; i < bestAveragePoints.length; i++) {
            bestAveragePoints[i].x -= graphSegmentLength;
        }

        bestPoints.splice(0, 1);
        avgPoints.splice(0, 1);
        worstPoints.splice(0, 1);
        if (rollingCount == 0) {
            bestAveragePoints.splice(0, 1);
        }
    }
}

function getAxonColor(i, j, k, obj) {
    let axValue = Math.round(obj.network.axons[i][k][j] * 126 + 126);

    return "rgb(" + axValue + "," + axValue + "," + axValue + ")";
}

function distanceSort(a, b) {
    return Math.sqrt(Math.pow(a.x - objSort.x, 2) + Math.pow(a.y - objSort.y, 2)) - Math.sqrt(Math.pow(b.x - objSort.x, 2) + Math.pow(b.y - objSort.y, 2));
}

function getNearestPellets(obj, l) {
    objSort = obj;
    let nearestPellets = board[l].foods.sort(distanceSort);

    return nearestPellets;
}

function updateSpeed(slow) {
    speedTimes++;
    if (speedTimes == 500) {
        document.getElementById("speed").value = 1;
        speedTimes = 0;
    }

    if (speedTimes % 50 == 5 && speedTimes !== 5) {
        document.getElementById("speed").value = 150;
    }

    if (speedTimes == 10) {
        document.getElementById("speed").value = 150;
    }

    if (speedTimes % 50 == 0 && speedTimes !== 0) {
        document.getElementById("speed").value = 1;
    }

    if (slow) {
        document.getElementById("speed").value = 1;
    }

    if (generationNumber >= 250000) {
        location.reload();
    }
}

setInterval(doUpdate, 1000 / 100);
setInterval(Render, 1000 / 60);