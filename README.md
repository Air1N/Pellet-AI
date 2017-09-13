# Pellet-AI

## How to use
Open the index.html in a browser.

## Configuration
In variables.js file.

Neural Network layout, the number is the layer height, adding another value to the array adds a new layer
```javascript
const layers = [4, 2];
```

% chance to mutate an axon in one way
```javascript
const mutability = 15;
```

Value for every neuron
```javascript
const offset = 0;
```

Number of boards
```javascript
const boards = 5;
```

Number of creatures per board
```javascript
const population = 10;
```


Number of pellets per board (at all times)
```javascript
const maxPellets = 25;
```

Fitness gained per pellet eaten (doesn't matter too much)
```javascript
const pelletValue = 1;
```

Maximum score the graph can display
```javascript
const maxScore = 100;
```

Speed the creatures can move at
```javascript
const speed = 5;
```

Number of creatures to keep and clone to the others
```javascript
const topCreatures = 10;
```

Size of the pellets (radius)
```javascript
const pelletSize = 15;
```

Size of the creatures (radius)
```javascript
const creatureSize = 30;
```

Time to collect pellets before mutation (in 1/100th seconds)
```javascript
const genTime = 15 * 100;
```

Generations to average for the rolling average
```javascript
const rollGen = 6;
```

Whether to change the value of the speed in intervals (useful for streaming)
```javascript
var streamMode = true;
```


## Notes
View my stream on [Twitch.tv](https://twitch.tv/unknownevii/)
If you do decide to stream this, don't use this exact version.
Please?
