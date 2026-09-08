
export function* radixSort(array) {
    const baseDigits = 3;
    const base = Math.pow(2, baseDigits);
    const flag = base - 1;
    const buckets = [];
    buckets.length = base;
    for (let i = 0; i < base; i++) {
        buckets[i] = [];
    }
    let max = -1;
    for (let i = 0; i < array.length; i++) {
        yield array.get(i);
        if (array.getVal > max) {
            max = array.getVal;
        }
    }

    const maxIterations = Math.ceil(Math.log2(max) / baseDigits);

    for (let i = 0; i < maxIterations; i++) {

        for (let i2 = 0; i2 < array.length; i2++) {
            yield array.get(i2);
            let index = (array.getVal >> (i * baseDigits)) & flag;
            console.log(`original(${array.getVal}) => key(${index})`);
            if (buckets[index] === undefined) {
                asdf();
            }
            buckets[index].push(array.getVal);
        }

        let count = 0;
        for (let i2 = 0; i2 < buckets.length; i2++) {
            count += buckets[i2].length;
        }

        let bucketI = 0;
        let bucketSubI = 0;
        for (let i2 = 0; i2 < array.length; i2++) {
            
            if (buckets[bucketI][bucketSubI] === undefined) {
                throw new Error(`illegal bucket index values: bucket(${bucketI}) < ${buckets.length} | subbucketI(${bucketSubI}) < ${buckets[bucketI].length}`);
            }
            yield array.set(i2, buckets[bucketI][bucketSubI]);
            bucketSubI++;
            while (bucketI < buckets.length && buckets[bucketI].length <= bucketSubI) {
                bucketI++;
                bucketSubI = 0;
            }
        }

        for (let i2 = 0; i2 < buckets.length; i2++) {
            buckets[i2].length = 0;
        }
    }
}

export function* countingSort(array) {

    yield array.get(0);
    let min = array.getVal;
    let max = min;

    for (let i = 1; i < array.length; i++) {
        yield array.get(i);
        let current = array.getVal;
        if (current < min) {
            min = current;
        }
        if (current > max) {
            max = current;
        }
    }

    let counts = [];
    counts.length = max - min + 1;
    counts.fill(0);

    for (let i = 0; i < array.length; i++) {
        yield array.get(i);
        counts[array.getVal - min]++;
    }

    let pointerI = 0;

    for (let i = 0; i < counts.length; i++) {
        for (let i2 = 0; i2 < counts[i]; i2++) {
            yield array.set(pointerI, i + min);
            pointerI++;
        }
    }
}