const walker = require('../index');
const assert = require('chai').assert

const times = (count, f) => {
    for (var i = 0; i < count; ++i)
        f();
};

describe('Walker', () => {
    it('Single element is selected 100% of the time', () => {
        const table = walker([
            [1, 'a']])
        
        times(100, () => {
            assert.strictEqual('a', table());
        });
    });
    
    it('Invalid weight throws error', () => {
        assert.throws(() => {
            walker([[0, 'a']]);
        });
         assert.throws(() => {
            walker([[-.01, 'a']]);
        });
        assert.throws(() => {
            walker([[-10, 'a']]);
        });
    });

    it('Uniform distribution is predictable', () => {
        const table = walker([
            [1, 'a'],
            [1, 'b'],
            [1, 'c']])
        
        times(10, () => {
            assert.strictEqual('a', table(() => 0));
            assert.strictEqual('b', table(() => 0.4));
            assert.strictEqual('c', table(() => 0.7));
        });
    });
    
    it('custom random', () => {
        const table = walker([
            [1, 'a'],   
            [3, 'b'],
            [2, 'c'],
            [4, 'd']]);
        
        
        const r = () => 0.5;
        const found = table(r);
        times(100, () => {
            assert.strictEqual(found, table(r));
        });
    });


    it('Weighted distribution is sampled equally', () => {
        const table = walker([
            [1, 'a'],   
            [3, 'b'],
            [2, 'c'],
            [4, 'd']]);
        
        const total = 10000;
        const counts = { a: 0, b: 0, c: 0, d: 0 };
        times(total, () => {
            const sample = table();
            counts[sample]++;
        });
        
        const delta = 0.05;
        assert.closeTo(counts.a / total, 0.1, delta);
        assert.closeTo(counts.b / total, 0.3, delta);
        assert.closeTo(counts.c / total, 0.2, delta);
        assert.closeTo(counts.d / total, 0.4, delta);
    });
    
    it('Floating point distribution is sampled equally', () => {
        const table = walker([
            [0.1, 'a'],   
            [0.3, 'b'],
            [0.2, 'c'],
            [0.4, 'd']]);
        
        const total = 10000;
        const counts = { a: 0, b: 0, c: 0, d: 0 };
        times(total, () => {
            const sample = table();
            counts[sample]++;
        });
        
        const delta = 0.05;
        assert.closeTo(counts.a / total, 0.1, delta);
        assert.closeTo(counts.b / total, 0.3, delta);
        assert.closeTo(counts.c / total, 0.2, delta);
        assert.closeTo(counts.d / total, 0.4, delta);
    });

});