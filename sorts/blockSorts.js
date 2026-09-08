import { debugPrint, validate } from "./helper.js";

export function* sqrtSort(array) {
    const length = array.length;
    const blockSize = Math.floor(Math.sqrt(length));

    const buffer = [];
    const movementImitationBuffer = [];
    const blockType = [];
    buffer.length = blockSize;
    movementImitationBuffer.length = Math.floor(Math.floor(length / 2) / blockSize);
    blockType.length = movementImitationBuffer.length * 2;

    const nearest2Power = Math.ceil(Math.log2(length))
    debugPrint(blockSize);

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
        debugPrint(`merge: ${start1} - ${start2} - ${end}`);
        let size1 = start2 - start1;
        let size2 = end - start2;

        if (size1 == 0 || size2 == 0) {
            return;
        }
        if (size1 == 1 && size2 == 1) {
            yield* array.compareAndSwap(start1, start2);
            return;
        }

        let aCount = Math.floor(size1 / blockSize);
        let bCount = Math.floor(size2 / blockSize);
        let aExtra = size1 - aCount * blockSize;
        let bExtra = size2 - bCount * blockSize;

        for (let i = 0; i < aCount; i++) {
            movementImitationBuffer[i] = i;
        }
        for (let i = 0; i < aCount + bCount; i++) {
            blockType[i] = (i < aCount);
        }

        debugPrint(`${aExtra} + ${aCount} <> ${bCount} + ${bExtra}`)

        // drop and roll.
        let insertI = start1 + aExtra;
        let aDropped = 0;

        while (aDropped < aCount) {
            // get lowest aBlock;
            let mibIMin = aDropped;
            for (let i = mibIMin + 1; i < aCount; i++) {
                if (movementImitationBuffer[i] < movementImitationBuffer[mibIMin]) {
                    mibIMin = i;
                }
            }

            let aLowI = insertI + (mibIMin - aDropped) * blockSize;
            let bLowI = insertI + (aCount - aDropped) * blockSize;
            
            debugPrint(`compare ${aLowI} and ${bLowI}`);

            yield array.get(aLowI);
            let aLow = array.getVal;

            let bLow = Infinity;
            if (!(bLowI + blockSize > end)) {
                yield array.get(bLowI + blockSize - 1);
                bLow = array.getVal;
            }

            if (aLow <= bLow) {
                debugPrint("dropA");
                if (aLowI == insertI) {
                    aDropped++;
                    insertI += blockSize;
                    continue;
                }

                let temp = movementImitationBuffer[mibIMin];
                movementImitationBuffer[mibIMin] = movementImitationBuffer[aDropped];
                movementImitationBuffer[aDropped] = temp;

                for (let i = 0; i < blockSize; i++) {
                    yield array.swap(insertI + i, aLowI + i);
                }
                
                aDropped++;
                insertI += blockSize;
                continue;
            }

            debugPrint("dropB");

            let temp = movementImitationBuffer[aDropped];
            for (let i = aDropped; i < aCount - 1; i++) {
                movementImitationBuffer[i] = movementImitationBuffer[i + 1];
            }
            movementImitationBuffer[aCount - 1] = temp;

            let typeI = (insertI - start1 - aExtra) / blockSize;
            debugPrint(typeI);
            blockType[typeI] = false;
            debugPrint("what");
            debugPrint(`${typeI + aCount - aDropped} = ${(bLowI - blockSize + 1 - start1 - aExtra) / blockSize}`);
            blockType[typeI + aCount - aDropped] = true;

            for (let i = 0; i < blockSize; i++) {
                yield array.swap(insertI + i, bLowI + i);
            }

            if (bLowI + blockSize > end) {
                debugPrint(`ah: ${typeI + aCount - aDropped} = ${(bLowI - blockSize + 1 - start1 - aExtra) / blockSize}`);
                asdf;
            }

            insertI += blockSize;
        }

        debugPrint("merging");
        let mergedStart = end - bExtra;

        for (let i = aCount + bCount - 1; i >= -1; i--) {
            let isAExtra = i == -1;
            if (!isAExtra && blockType[i] == false) {
                mergedStart -= blockSize;
                continue;
            }

            
            let insertI = start1 + aExtra + i * blockSize;
            let size = blockSize;
            if (isAExtra) {
                insertI = start1;
                size = aExtra;
            }

            for (let i2 = 0; i2 < size; i2++) {
                yield array.get(insertI + i2);
                buffer[i2] = array.getVal;
            }

            debugPrint("performing buffer merge");
            let bufferI = 0;
            let arrayI = mergedStart;
            while (bufferI < size) {
                if (arrayI >= end || (yield array.get(arrayI)) === undefined && buffer[bufferI] <= array.getVal) {
                    yield array.set(insertI, buffer[bufferI]);
                    bufferI++;
                    insertI++;
                    continue;
                }

                yield array.get(arrayI);
                yield array.set(insertI, array.getVal);
                arrayI++;
                insertI++;
            }

            mergedStart -= blockSize;
        }

        debugPrint("finished Merge");
    }
}

export function* originalBlockSort(array) {
    const length = array.length;

    let initialBuffer = [];
    initialBuffer.length = Math.min(50, length);
    // const blockSize = Math.floor(Math.sqrt(length));

    // const buffer = [];
    // const movementImitationBuffer = [];
    // const blockType = [];
    // buffer.length = blockSize;
    // movementImitationBuffer.length = Math.floor(Math.floor(length / 2) / blockSize);
    // blockType.length = movementImitationBuffer.length * 2;

    const nearest2Power = Math.ceil(Math.log2(length))
    // debugPrint(blockSize);

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
        let size1 = start2 - start1;
        let size2 = end - start2;

        if (size1 == 0 || size2 == 0) {
            return;
        }

        if (size1 == 1 && size2 == 2) {
            yield* array.compareAndSwap(start1, start2);
        }

        if (size1 <= initialBuffer.length) {
            for (let i = 0; i < size1; i++) {
                yield array.get(i + start1);
                initialBuffer[i] = array.getVal;
            }

            let insertI = start1;
            let arrayI = start2;
            let bufferI = 0;
            while (bufferI < size1) {
                if (arrayI >= end || (yield array.get(arrayI)) === undefined && array.getVal > initialBuffer[bufferI]) {
                    yield array.set(insertI, initialBuffer[bufferI]);
                    insertI++;
                    bufferI++;
                    continue;
                }

                yield array.set(insertI, array.getVal);
                arrayI++;
                insertI++;
            }
            return;
        }

        let blockSize = Math.sqrt(size1);

        let aCount = Math.floor(size1 / blockSize);
        let bCount = Math.floor(size2 / blockSize);
        // let aExtra = size1 - aCount * blockSize;
        let gap = 0;

        yield array.get(start1 + aCount - 1);
        let lastAVal = array.getVal;
        while (start1 + aCount + gap + 1 + bCount < start2) {
            yield array.get(start1 + aCount + gap + 1);
            if (array.getVal != lastAVal) {
                break;
            }
            gap++;
        }


    }
}
