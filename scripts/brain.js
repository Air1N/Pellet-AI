function Creature(c) {
    this.fitness = 0;
    this.network = {};
    this.overlapping = 0;
    this.x = 1920 / 2;
    this.y = 1080 / 2;
    this.ox = this.x;
    this.oy = this.y;
    this.width = defw;
    this.height = defh;
    this.pr = Math.floor(Math.random() * 256);
    this.pg = Math.floor(Math.random() * 256);
    this.pb = Math.floor(Math.random() * 256);
    
    this.rotation = 0;
    this.velocity = 0;
    
    this.lastDistanceToNearest = 0;
    this.network.mutability = [];
    this.color = c;

    // This creates a neural network composed of layers and axons
    this.createNeuralNetwork = function() {
        this.network.layers = layers; // This creates layers based on the parameters I provide in the layers variable
        this.initNeurons(); // This initializes the neurons, creating them, Neurons contain a value and are the connection point for axons
        this.initAxons(); // Axons are basically lines that connect Neurons, each one has a weight, and each neuron has a value, the axon takes the value and multiplies it by the weight
    };

    this.initNeurons = function() {
        this.network.neurons = [];
        for (var i = 0; i < layers.length; i++) {
            this.network.neurons.push(new Array(layers[i]));
        }
    };

    this.initAxons = function() {
        this.network.axons = [];
        for (var i = 1; i < this.network.layers.length; i++) {
            var layerWeights = [];
            var neuronsInPreviousLayer = this.network.layers[i - 1];
            for (var j = 0; j < this.network.neurons[i].length; j++) {
                var neuronWeights = [];
                for (var k = 0; k < neuronsInPreviousLayer; k++) {
                    neuronWeights.push(Math.random() * 2 - 1);
                }
                layerWeights.push(neuronWeights);
            }
            this.network.axons.push(layerWeights);
        }
    };
    

    // This feeds the neuron values through the axons, and all the way to the end of the network.
    this.feedForward = function(inputs) {
        for (var i = 0; i < inputs.length; i++) {
            this.network.neurons[0][i] = inputs[i]; // Takes the inputs and applies them
        }

        for (var i = 1; i < this.network.layers.length; i++) {
            for (j = 0; j < this.network.layers[i]; j++) {
                var value = offset;
                for (k = 0; k < this.network.neurons[i - 1].length; k++) {
                    value += this.network.axons[i - 1][j][k] * this.network.neurons[i - 1][k]; // Adds the neurons value * the weight
                }
                
                value = Math.clamp(value, -1, 1);
                this.network.neurons[i][j] = 1.7159 * Math.tanh(2/3 * value); // Sets the neuron across from the axon to the new value (1 - -1)
            }
        }
        return this.network.neurons[this.network.neurons.length - 1]; // returns the output, or the last line
    };


    // Modifies weights of the axons
    this.mutate = function() {
        for (var i = 0; i < this.network.axons.length; i++) {
            for (var j = 0; j < this.network.axons[i].length; j++) {
                for (var k = 0; k < this.network.axons[i][j].length; k++) {
                    for (var l = 0; l < mutability; l++) {
                        var weight = this.network.axons[i][j][k];
                        var randomNumber = Math.random() * 100;
                        const numMutations = 5;

                        if (randomNumber < totalProbability * 1 / numMutations) {
                            weight *= Math.random();
                        } else if (randomNumber < totalProbability * 2 / numMutations) {
                            weight /= Math.random();
                        } else if (randomNumber < totalProbability * 3 / numMutations) {
                            weight *= -1;
                        } else if (randomNumber < totalProbability * 4 / numMutations) {
                            weight -= Math.random() * 0.25;
                        } else if (randomNumber < totalProbability * 5 / numMutations) {
                            weight += Math.random() * 0.25;
                        }

                        this.network.axons[i][j][k] = weight;
                    }
                }
            }
        }
    };

    this.copyNeuralNetwork = function(copyNetwork) {
        this.copyAxons(copyNetwork.network.axons);
    };

    this.copyAxons = function(copyAxon) {
        for (var i = 0, l = this.network.axons.length; i < l; i++) {
            for (var j = 0, m = this.network.axons[i].length; j < m; j++) {
                for (var k = 0, n = this.network.axons[i][j].length; k < n; k++) {
                    this.network.axons[i][j][k] = copyAxon[i][j][k];
                }
            }
        }
    };

    this.overlap = function(b) {
        return (ue.abs(Math.round(this.x - b.x)) << 1 < (this.width + b.width)) &&
            (ue.abs(Math.round(this.y - b.y)) << 1 < (this.height + b.height));
    };

    this.createNeuralNetwork();
}

createBoxes();