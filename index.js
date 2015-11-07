"use strict";

const randomInt = (min, max, r) =>
    Math.floor(r() * (max - min)) + min;

const sumWeights = (() => {
    const reducer = (p, c, i) => {
        if (c[0] <= 0)
            throw {
                name: 'WeightError',
                message: `Invalid weight ${c[0]} at index ${i}. Weight cannot be negative or zero.`
            };
        return p + c[0];
    };
    return (a) => Array.prototype.reduce.call(a, reducer, 0);
}());

/**
    Walker's alias method for random objects with different probabilities.
    
    Takes an array of weight value pairs and returns a sample function:
    
        const walker = require('walker-sample');
        
        // Create table with weights
        const table = walker([
            [1, 'a'],   
            [3, 'b'],
            [2, 'c'],
            [4, 'd']]);
        
        // Table produces a 10% of the time, b 30%, c 20%, and d 40%.
        // Take sample
        table();
        
    You can also feed in a custom random number generator to the sample.
    method. This is useful for testing:
    
        table(() => 0.5);
        
    Based on: http://code.activestate.com/recipes/576564-walkers-alias-method-for-random-objects-with-diffe/
*/
const walker = (weightMap) => {
    const n = weightMap.length;
    const sum = sumWeights(weightMap);    
    const weights = weightMap.map((x) => (x[0] * n) / sum);
    
    const shorts = [];
    const longs = [];
    for (var i = 0, len = weights.length; i < len; ++i) {
        let p = weights[i];
        if (p < 1) {
            shorts.push(i);
        } else if (p > 1) {
            longs.push(i);
        }
    }
    
    const inx = (Array.from(Array(n))).map(_ => -1);
    while (shorts.length && longs.length) {
        const j = shorts.pop();
        const k = longs[longs.length - 1];
        inx[j] = k;
        weights[k] -= (1 - weights[j]);
        if (weights[k] < 1) {
            shorts.push(k);
            longs.pop();
        }
    }

    return (r) => {
        r = r || Math.random;
        const u = r();
        const j = randomInt(0, n, r);
        const k = (u <= weights[j] ? j : inx[j]);
        return weightMap[k][1];
    };
};

module.exports = walker;
