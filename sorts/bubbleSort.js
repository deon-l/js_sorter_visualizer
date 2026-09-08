import { debugPrint } from "./helper.js";

export function* bubbleSort(array) {
    let swapsMade;
    let limit = array.length;
    do {
        swapsMade = false;
        for (let i = 1; i < limit; i++) {
            yield* array.compare(i - 1, i)
            if (!array.getVal) {
                swapsMade = true;
                yield array.swap(i - 1, i);
            }
        }
        limit--
    } while (swapsMade);
}

export function* combSort(array) {
    const scaler = 1.5;
    let gap = array.length;
    let swapsMade;
    do {
        gap /= scaler;
        const instanceGap = Math.max(Math.floor(gap), 1);
        swapsMade = false;
        for (let i = instanceGap; i < array.length; i++) {
            yield* array.compare(i - instanceGap, i)
            if (!array.getVal) {
                swapsMade = true;
                yield array.swap(i - instanceGap, i);
            }
        }
    } while (swapsMade || gap >= 2);
}

export function* cocktailSort(array) {
    const length = array.length;
    let direction = 1;
    let swapsMade;
    do {
        swapsMade = false;

        for (let i = (direction == 1 ? 1 : length - 1); i < length && i >= 0; i += direction) {
            yield* array.compare((i - direction), i)
            if (!array.getVal == (direction == 1)) {
                swapsMade = true;
                yield array.swap(i - direction, i);
            }
        }

        direction *= -1;
    } while (swapsMade); 
}
