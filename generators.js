import { debugPrint } from "./sorts/helper.js";

export function* randomize(array, maxValue) {
    for (let i = 0; i < array.length; i++) {
        yield array.set(i, Math.floor((i + 1) / array.length * maxValue));
    }
        
    for (let i = 0; i < array.length - 1; i++) {
        let swapI = i + Math.floor(Math.random() * (array.length - i));
        yield array.swap(i, swapI);
    }
}

export function* almostSorted(array, maxValue) {
    for (let i = 0; i < array.length; i++) {
        yield array.set(i, Math.floor((i + 1) / array.length * maxValue));
    }

    const swapCount = Math.floor(array.length / 20) + 1;
    for (let i = 0; i < swapCount; i++) {
        let i1 = Math.floor(Math.random() * (array.length));
        let i2 = Math.floor(Math.random() * (array.length));
        yield array.swap(i1, i2);
    }
}

export function* randomExponential(array, maxValue) {
    for (let i = 0; i < array.length; i++) {
        yield array.set(i, Math.floor(Math.pow(maxValue, (i + 1) / array.length)));
    }
        
    for (let i = 0; i < array.length - 1; i++) {
        let swapI = i + Math.floor(Math.random() * (array.length - i));
        yield array.swap(i, swapI);
    } 
}
export function* randomSquareRoot(array, maxValue) {
    for (let i = 0; i < array.length; i++) {
        yield array.set(i, Math.floor(Math.sqrt((i + 1) / array.length) * (maxValue - 1) + 1));
    }
        
    for (let i = 0; i < array.length - 1; i++) {
        let swapI = i + Math.floor(Math.random() * (array.length - i));
        yield array.swap(i, swapI);
    } 
}

export function* reverse(array, maxValue) {
    const length = array.length;
    for (let i = 0; i < length; i++) {
        yield array.set(i, Math.floor((length - i) / array.length * maxValue));
    }
}

export function* spikes(array, maxValue, spikeCount = 4) {
    // const spikeCount = 4;
    const spikeWidth = array.length / spikeCount / 2;

    for (let i = 0; i < array.length; i++) {

        let spikeT = (i % spikeWidth) / spikeWidth;
        if (Math.floor(i / spikeWidth) % 2 == 1) {
            spikeT = 1 - spikeT;
        }
        yield array.set(i, Math.floor(spikeT * maxValue));
    }
}

export function* pipeOrgan(array, maxValue) {
    yield* spikes(array, maxValue, 1);
}

export function* randomRuns(array, maxValue) {
    const minSpacing = 5;
    const length = array.length;
    const runCount = Math.max(Math.pow(length, 0.3), 2);

    let runs = [];
    runs.length = Math.floor(runCount) + 1;
    for (let i = 0; i < runs.length - 1; i++) {
        runs[i] = Math.floor(length / runCount * i);
        yield array.set(runs[i], maxValue);
    }
    // runs.at(-1) = length;
    runs.splice(-1, 1, length);

    debugPrint("s");
    for (let i = 1; i < runs.length - 1; i++) {
        let current = runs[i];
        let previous = i == 0 ? 0 : runs[i - 1];
        let next = runs[i + 1];

        let range = Math.max(Math.min(current - previous, next - current) - minSpacing, 1) / 3;
        let newVal = Math.floor(gaussianRandom(current, range));
        runs[i] = Math.max(Math.min(newVal, next - minSpacing), previous + minSpacing);
    }

    for (let i = 1; i < runs.length; i++) {
        const start = runs[i - 1];
        const end = runs[i];
        const startVal = Math.random() * (maxValue - 1) + 1;
        const endVal = Math.random() * (maxValue - 1) + 1;

        const runSize = end - start;
        const slope = (endVal - startVal) / runSize;
        for (let i2 = 0; i2 < runSize; i2++) {
            yield array.set(start + i2, Math.floor(startVal + i2 * slope));
        }
    }

    // taken from Maxwell Collard from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    function gaussianRandom(mean=0, stddev=1) {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        // Transform to the desired mean and standard deviation:
        return z * stddev + mean;
    }
}
