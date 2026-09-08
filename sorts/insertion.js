
export function* insertionSort(array, gap = 1)
{
    // document.getElementById("output").textContent = "parse";

    const length = array.length;

    for (let i = gap; i < length; i++)
    {
        yield array.get(i);
        let value = array.getVal;
        
        let insertI = i;
        while (insertI >= gap && (yield array.get(insertI - gap)) === undefined && array.getVal > value)
        {
            yield array.set(insertI, array.getVal);
            insertI -= gap;
        }

        if (insertI != i) {
            yield array.set(insertI, value);
        }
    }
}

export function* shellSort(array) {
    const shrinkFactor = 2.3;

    const length = array.length;
    let gap = length;
    do {
        gap /= shrinkFactor;

        yield* insertionSort(array, Math.max(1, Math.floor(gap)));
    } while (gap >= 2)

}

export function* binaryInsertionSort(array) {
    const length = array.length;

    for (let i = 1; i < length; i++) {
        yield array.get(i);
        let value = array.getVal;
        
        let low = 0;
        let high = i;

        while (high - low > 0) {
            let middle = Math.floor((low + high) / 2);

            yield array.get(middle);
            if (array.getVal > value) {
                high = middle;
            }
            else {
                low = middle + 1;
            }
        }
        const insertI = low;

        for (let i2 = i; i2 > insertI; i2--) {
            yield array.get(i2 - 1);
            yield array.set(i2, array.getVal);
        }

        yield array.set(insertI, value);
    }
}
