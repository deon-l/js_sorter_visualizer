import { binarySearch, debugPrint, reverse } from "./helper.js";
import { binaryInsertionSort, insertionSort } from "./insertion.js";

export function* mergeSort(array) {

    let stack = [[0, array.length, 0]];
    let buffer = [];
    buffer.length = array.length;

    while (stack.length > 0) {
        let data = stack[stack.length - 1];
        let start = data[0];
        let end = data[1];
        let step = data[2];
        data[2]++;

        if (end - start <= 1) {
            stack.pop();
            continue;
        }

        let half = Math.floor((start + end) / 2);
        if (step == 0) {
            stack.push([start, half, 0]);
            continue;
        }
        if (step == 1) {
            stack.push([half, end, 0]);
            continue;
        }


        // let bufferP = 0;
        let p1 = start;
        let p2 = half;

        yield array.get(p1);
        let p1Val = array.getVal;
        yield array.get(p2);
        let p2Val = array.getVal;

        // let bufferLength = start - end;
        for (let i = 0; i < end - start; i++) {
            let nextVal;

            if (p1 < half && (p2 >= end || p1Val < p2Val)) {
                nextVal = p1Val;
                p1++;
                if (p1 != half) {
                    yield array.get(p1);
                    p1Val = array.getVal;
                }
            }
            else {
                nextVal = p2Val;
                p2++;
                if (p2 != end) {
                    yield array.get(p2);
                    p2Val = array.getVal;
                }
            }

            buffer[i] = nextVal;
        }

        for (let i = 0; i < end - start; i++) {
            yield array.set(i + start, buffer[i]);
        }

        stack.pop();
    }
}

export function* iterativeMergeSort(array) {
    const length = array.length;

    let buffer = [];
    buffer.length = array.length;

    const nearest2Power = Math.floor(Math.log2(length))
    // const scale = length / Math.pow(2, nearest2Power);

    for (let i = 0; i < nearest2Power; i++) {
        let subArrayCount = Math.pow(2, nearest2Power - i);
        // let subArraySize = Math.pow(2, i) * scale;
        let subArraySize = length / subArrayCount;

        for (let i2 = 0; i2 < subArrayCount; i2 += 2) {

            let start1 = Math.floor(subArraySize * i2);
            let start2 = Math.floor(subArraySize * (i2 + 1));
            let end = Math.floor(subArraySize * (i2 + 2));

            if (i == 0) {
                if (start2 - start1 == 2) {
                    yield* array.compareAndSwap(start1, start1 + 1);
                }
                if (end - start2 == 2) {
                    yield* array.compareAndSwap(start2, start2 + 1);
                }
            }

            let p1 = start1;
            let p2 = start2;

            yield array.get(p1);
            let p1Val = array.getVal;
            yield array.get(p2);
            let p2Val = array.getVal;

            // let bufferLength = start - end;
            for (let i = 0; i < end - start1; i++) {
                let nextVal;

                if (p1 < start2 && (p2 >= end || p1Val < p2Val)) {
                    nextVal = p1Val;
                    p1++;
                    if (p1 != start2) {
                        yield array.get(p1);
                        p1Val = array.getVal;
                    }
                }
                else {
                    nextVal = p2Val;
                    p2++;
                    if (p2 != end) {
                        yield array.get(p2);
                        p2Val = array.getVal;
                    }
                }

                buffer[i] = nextVal;
            }

            for (let i = 0; i < end - start1; i++) {
                yield array.set(i + start1, buffer[i]);
            }
        }
    }
}

export function* timSort(array) {
    const length = array.length;
    if (length < 64) {
        yield* binaryInsertionSort(array);
        return;
    }

    let runStack = [];
    function getRunStart(i) {
        i += runStack.length - 1;
        document.getElementById("output").textContent = `${runStack.length}, ${i}`;

        if (i < 0) {
            return 0;
        }
        return runStack[i];
    }
    function getRunSize(i) {
        i += runStack.length;

        if (i < 0) {
            return Infinity;
        }
        if (runStack.length < 1) {
            return 0;
        }
        if (runStack.length == 1 || i == 0) {
            return runStack[0];
        }
        return runStack[i] - runStack[i - 1];
    }

    let buffer = [];
    buffer.length = Math.floor(array.length / 2);

    const power = Math.floor(Math.log2(length));
    const flag = 63;
    const powerChange = Math.max(0, power - 5);
    const minRunSize = (length ^ (flag << powerChange)) >> powerChange;

    // get Run;
    let processI = 0;
    while (processI < length) {
        if (processI + 1 == length) {
            runStack.push(length);
            break;
        }
        
        const start = processI;
        yield* array.compare(processI, processI + 1);
        document.getElementById("output").textContent = `${processI} = ${start}`;
        const sortAscending = array.getVal;

        yield array.get(start);
        for (processI += 1; processI < length; processI++) {
            yield array.get(processI);
            let current = array.getVal;

            yield array.get(processI - 1);
            let previous = array.getVal;


            if ((previous <= current) == sortAscending) {
                continue;
            }

            if (processI - start >= minRunSize) {
                break;
            }

            let insertI = processI;
            while (insertI > start && (yield array.get(insertI - 1)) === undefined && (array.getVal > current) == sortAscending) {
                yield array.set(insertI, array.getVal);
                insertI--;
            }

            yield array.set(insertI, current);
        }

        if (!sortAscending) {
            yield* reverse(array.slice(start, processI));
        }

        runStack.push(processI);

        while (true) {
            if (runStack.length == 1) {
                break;
            }

            const run1 = getRunSize(-1);
            const run2 = getRunSize(-2);
            const run3 = getRunSize(-3);

            // document.getElementById("output").textContent = `${run1}, ${run2}, ${run3}`;
            debugPrint(runStack);

            if (run2 > run1 && (run3 > run2 + run1 || run3 == Infinity)) {
                break;
            }

            if (run1 < run3) {
                document.getElementById("output").textContent = `${run1}, ${run2}, ${run3}`;
                yield* merge(getRunStart(-2), getRunStart(-1), processI);
                runStack.splice(-2, 1);
            } else {
                yield* merge(getRunStart(-3), getRunStart(-2), getRunStart(-1));
                runStack.splice(-3, 1);
            }
        }
    }

    while (runStack.length >= 3) {
        const run1 = getRunSize(-1);
        const run2 = getRunSize(-2);
        const run3 = getRunSize(-3);

        
        if (run1 < run3) {
            yield* merge(getRunStart(-2), getRunStart(-1), length);
            // debugPrint("hi");
            runStack.splice(-2, 1);
        } else {
            yield* merge(getRunStart(-3), getRunStart(-2), getRunStart(-1));
            runStack.splice(-3, 1);
        }
    }

    if (runStack.length == 2) {
        yield* merge(getRunStart(-2), getRunStart(-1), length);
    }

    
    function* merge(start1, start2, end) {
        yield array.get(start2);
        yield* binarySearch(array.slice(start1, start2), array.getVal, function(v) { start1 = v + start1; });
        // document.getElementById("output").textContent = `a ${start1}, ${start2}, ${end}`;
        yield array.get(start2 - 1);
        yield* binarySearch(array.slice(start2, end), array.getVal, function(v) { end = v + start2; },
            function(n1, n2) { return n1 < n2; } );
        
        // debugPrint(`${start1}, ${start2}, ${end}`)

        const size1 = start2 - start1;
        const size2 = end - start2;

        if (size1 == 0 || size2 == 0) {
            return;
        }

        const mergeRight = size1 <= size2;
        const bufferSize = mergeRight ? size1 : size2;
        let bufferInsertStart = mergeRight ? start1 : start2;
        for (let i = 0; i < bufferSize; i++) {
            yield array.get(i + bufferInsertStart);
            buffer[i] = array.getVal;
        }

        const direction = mergeRight ? 1 : -1;
        let arrayI = mergeRight ? start2 : start2 - 1;
        const arrayILow = mergeRight ? start2 : start1; 
        const arrayIHigh = mergeRight ? end : start2;
        let bufferI = mergeRight ? 0 : bufferSize - 1;
        let insertI = mergeRight ? start1 : end - 1;

        while (insertI < end && insertI >= start1) {
            // debugPrint(`${insertI} < ${arrayI} ? ${bufferI} | ${arrayILow} - ${arrayIHigh} : ${bufferSize} | ${start1}, ${start2}, ${end}`);
            yield array.get(arrayI);
            if ((arrayILow <= arrayI && arrayI < arrayIHigh) && 
                ((bufferI < 0 || bufferI >= bufferSize) || array.getVal * direction < buffer[bufferI] * direction)) {
                
                yield array.set(insertI, array.getVal);
                insertI += direction;
                arrayI += direction;
                continue;
            }
            yield array.set(insertI, buffer[bufferI]);
            insertI += direction;
            bufferI += direction;
        }

        // debugPrint("hi");
    }
}

export function* rotateMergeSort(array) {
    const length = array.length;
    const nearest2Power = Math.ceil(Math.log2(length))

    for (let i = 0; i < nearest2Power; i++) {
        let subArrayCount = Math.pow(2, nearest2Power - i);
        let subArraySize = length / subArrayCount;

        for (let i2 = 0; i2 < subArrayCount; i2 += 2) {

            let start1 = Math.floor(subArraySize * i2);
            let start2 = Math.floor(subArraySize * (i2 + 1));
            let end = Math.floor(subArraySize * (i2 + 2));

            yield* localMerge(start1, start2, end);
        }
    }

    function* localMerge(start1, start2, end) {
        debugPrint(`Merging: ${start1} - ${start2} - ${end}`);
        const length1 = start2 - start1;
        const length2 = end - start2;
        // if (length1 + length2 <= 16) {
        //     yield* insertionSort(array.slice(start1, end));
        //     return;
        // }
        if (length1 == 0 || length2 == 0) {
            return;
        }
        
        if (length1 == 1 && length2 == 1) {
            yield* array.compareAndSwap(start1, start2);
            return;
        }


        let middle1 = Math.floor((start1 + start2) / 2);
        yield array.get(middle1);
        let middle2;
        yield* binarySearch(array.slice(start2, end), array.getVal, (n) => middle2 = n + start2);
        debugPrint(middle2);

        if (middle2 != start2) {
            yield* rotation(array.slice(middle1, middle2), start2 - middle1);
            // yield* rotate(middle1, start2, middle2);
        }
        start2 = middle1 + (middle2 - start2);

        if (length1 == 1) {
            return;
        }

        if (start2 != middle1) {
            yield* localMerge(start1, middle1, start2);
        }
        if (middle2 != end) {
            yield* localMerge(start2, middle2, end);
        }
    }

}

function* rotation(array, mid) {
    // uses trinity rotation, without the use of auxiliary arrays.
    let start1 = 0;
    let start2 = mid;
    let last1 = mid - 1;
    let last2 = array.length - 1;

    while (start1 < last2) {
        if (start1 < last1) {
            yield array.swap(start1, last1);
        }
        if (start2 < last2) {
            yield array.swap(start2, last2);
        }
        yield array.swap(start1, last2);

        start1++;
        start2++;
        last1--;
        last2--;
    }
}
