import { insertionSort } from "./insertion.js";
import { heapSort } from "./selectionSorts.js";
import { BarChange } from "../arrayTracer.js";

export function* quickSort(array) {

    let stack = [[0, array.length]];

    let data;
    while ((data = stack.pop()) !== undefined) {
        let start = data[0];
        let end = data[1];

        if (start >= end) {
            continue;
        }

        yield array.get(start);
        let pivit = array.getVal;

        let startP = start;
        let endP = end;
        let startPVal = Number.NEGATIVE_INFINITY;
        let endPVal = Number.POSITIVE_INFINITY;

        
        while (startP <= endP) {
            if (startPVal < pivit) {
                startP++;
                yield array.get(startP);
                startPVal = array.getVal;
                continue;
            }

            if (endPVal >= pivit) {
                endP--;
                yield array.get(endP);
                endPVal = array.getVal;
                continue;
            }

            yield array.swap(startP, endP);
            startPVal = Number.NEGATIVE_INFINITY;
            endPVal = Number.POSITIVE_INFINITY;
        }

        yield array.swap(start, startP - 1);

        stack.push([startP, end]);
        stack.push([start, startP - 1]);
    }
}

export function* introspectiveSort(array) {
    const maxDepth = 2 * Math.log2(array.length);
    let stack = [[0, array.length, 0]];

    let data;
    while ((data = stack.pop()) !== undefined) {
        let start = data[0];
        let end = data[1];
        let depth = data[2];
        let half = Math.floor((start + end) / 2);

        // document.getElementById("output").textContent = "parse"

        if (start >= end) {
            continue;
        }
        if (end - start <= 16) {
            // insertion sort
            // let subArray = array.slice(start, end);
            // document.getElementById("output").textContent = subArray.length;
            yield* insertionSort(array.slice(start, end), 1);
            continue;
        }
        if (depth == maxDepth) {
            // heap sort
            yield* heapSort(array.slice(start, end));
            continue;
        }

        yield array.swap(start, half);
        yield array.get(start);
        let pivit = array.getVal;

        let startP = start;
        let endP = end;
        let startPVal = Number.NEGATIVE_INFINITY;
        let endPVal = Number.POSITIVE_INFINITY;

        
        while (startP <= endP) {
            if (startPVal < pivit) {
                startP++;
                yield array.get(startP);
                startPVal = array.getVal;
                continue;
            }

            if (endPVal >= pivit) {
                endP--;
                yield array.get(endP);
                endPVal = array.getVal;
                continue;
            }

            yield array.swap(startP, endP);
            startPVal = Number.NEGATIVE_INFINITY;
            endPVal = Number.POSITIVE_INFINITY;
        }

        yield array.swap(start, startP - 1);

        stack.push([startP, end, depth + 1]);
        stack.push([start, startP - 1, depth + 1]);
    }
}

export function* pdqSort(array) {
    const BadPartitionMax = Math.log(array.length);
    let stack = [[0, array.length, 0]];
    let medianResult = -1;

    while (stack.length > 0)
    {
        let stackData = stack.pop();
        let start = stackData[0];
        let end = stackData[1];
        let badPartitionCount = stackData[2];

        document.getElementById("output").textContent = stackData;

        let length = end - start;
        if (length <= 16) {
            if (length <= 0) {
                continue;
            }
            yield* insertionSort(array.slice(start, end));
            continue;
        }

        let middle = Math.floor((start + end) / 2);
        let i1 = start;
        let i2 = middle;
        let i3 = end - 1;

        
        if (length > 128) {
            yield* findMedian(i1, i1 + 1, i1 + 2);
            i1 = medianResult;
            yield* findMedian(i2 - 1, i2, i2 + 1);
            i2 = medianResult;
            yield* findMedian(i3 - 2, i3 - 1, i3);
            i3 = medianResult;
        }
        yield* findMedian(i1, i2, i3);
        let pivitI = medianResult;
        yield array.get(pivitI);
        let pivit = array.getVal;
        yield array.swap(pivitI, start);
        pivitI = start;
        
        let partitionLeft = false;
        if (start != 0) {
            yield array.get(start - 1);
            partitionLeft = array.getVal == pivit;
        }

        let startP = start + 1;
        let endP = end - 1;
        
        let swapCount = 0;

        while (true) {
            // document.getElementById("output").textContent = "parse";
            while (startP < endP) {
                yield array.get(startP);
                if (array.getVal > pivit || (!partitionLeft && array.getVal == pivit)) {
                    break;
                }
                startP++;
                
            }

            while (startP <= endP) {
                yield array.get(endP);
                if (array.getVal < pivit || (partitionLeft && array.getVal == pivit)) {
                    break;
                }
                endP--;
            }

            if (startP > endP) {
                break;
            }
            
            yield array.swap(startP, endP);
            swapCount++;
            startP++;
            endP--;
        }

        pivitI = startP - 1;

        if (pivitI == end) {
            document.getElementById("output").textContent = "errors be here";
            asdf();
        }

        yield array.swap(start, pivitI);
        yield [new BarChange("rgb(256 256 256)", pivitI, pivit, -1)]

        if (swapCount == 0) {
            // optimistic insertion sort
            const MaxSwaps = 8;
            let swaps = 0;
            for (let i = start + 1; i < end; i++) {

                yield array.get(i);
                let item = array.getVal;

                let insertI = i;
                while (insertI > start && (yield array.get(insertI - 1)) === undefined && item < array.getVal) {
                    yield array.swap(insertI, insertI - 1);
                    insertI--;
                    swaps++;
                    if (swaps > MaxSwaps) {
                        break;
                    }
                }

                if (swaps > MaxSwaps) {
                    break;
                }
            }
        }

        // bad partition is when it is divided unevenly
        if (pivitI - start < length * 0.125 || pivitI - start > length * 0.875) {
            badPartitionCount++;
            if (badPartitionCount > BadPartitionMax) {
                yield* heapSort(array.slice(start, end));
                continue;
            }

            yield* deterministicShuffle(start, pivitI);
            yield* deterministicShuffle(pivitI + 1, end);
        }

        stack.push([pivitI + 1, end, badPartitionCount]);
        if (!partitionLeft) {
            stack.push([start, pivitI, badPartitionCount]);
        }
    }

    function* findMedian(i1, i2, i3) {
        yield array.get(i1);
        let a = array.getVal;
        yield array.get(i2);
        let b = array.getVal;
        yield array.get(i3);
        let c = array.getVal;

        if (a <= b && b <= c)
        {
            medianResult = i2;
            return;
        }
        if (b <= a && a <= c)
        {
            medianResult = i1;
            return;
        }
        medianResult = i3;
    }

    function* deterministicShuffle(start, end)
    {
        const NINTHER_THRESHOLD = 128;
        let length = end - start;
        if (length < 16)
        {
            return;
        }
        
        document.getElementById("output").textContent = `${start} ${end}`;

        let quaterLength = Math.floor(length / 4);
        yield array.swap(start, start + quaterLength);
        yield array.swap(end - 1, end - quaterLength);
        if (length > NINTHER_THRESHOLD)
        {
            yield array.swap(start + 1, start + quaterLength + 1);
            yield array.swap(start + 2, start + quaterLength + 2);
            yield array.swap(end - 2, end - quaterLength - 1);
            yield array.swap(end - 3, end - quaterLength - 2);
            
        }

        document.getElementById("output").textContent = "finish shuffle";
    }
}
