# Walker-Sample

Small node.js library for sampling discrete probability distribution using the [Walker alias method](https://en.wikipedia.org/wiki/Alias_method) in O(1) time.

## Install

```sh
$ npm install walker-sample
```

## Usage
The top level export of `walker-sample` is a function that constructs a table to allow O(1) sampling:

```js
const walker = require('walker-sample');
        
// Create table with weights
const sampler = walker([
    [1, 'a'],   
    [3, 'b'],
    [2, 'c'],
    [4, 'd']]);
```

The function takes a list of weight, value pairs. The weights must be greater than zero and positive, but the weights themselves can be any integer or floating point value. Passing in a weight less than or equal to zero throws an exception.

The table above will produces `'a'` 10% of the time, `'b'` 30%, `'c'` 20%, and `'d'` 40% of the time. Weights are relative, so we get the same behavior with:

```js
const sampler = walker([
    [0.1, 'a'],   
    [0.3, 'b'],
    [0.2, 'c'],
    [0.4, 'd']]);
```

or with:

```js
const sampler = walker([
    [300, 'a'], 
    [900, 'b'],
    [600, 'c'],
    [1200, 'd']]);
```

### Sampling
`sampler` is just a function that can be sampled in O(1) time:

```
sampler() === 'd';
```

The default behavior uses `Math.random` for sampling. The sample function can also take a custom random number generator if predictable samples are needed. This is useful for testing.
    
```js
const r = () => 0.5;
sampler(r) === 'a';
sampler(r) === 'a';
...
// still 'a'
sampler(r) === 'a';
```

If you want to use the same random number generator for all samples, use `.bind`

```js
const biasedSampler = sampler.bind(null, () => 0.5);
biasedSampler() === 'a';
```

The random number generator must be a function that takes no arguments and produces a number between [0, 1]. This random number generator will be invoked twice for each sample.