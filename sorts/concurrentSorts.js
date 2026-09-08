import { insertionSort } from "./insertion.js";

const CompareOperation = 0;
const SwapOperation = 1;

let runNetworksConcurrently = false;
export function setRunConcurrent(value) {
    runNetworksConcurrently = value;
}


class sortingNetwork {

    constructor() {
        this.operations = [];
    }

    add(index1, index2, type = CompareOperation) {
        this.operations.push([index1, index2, type]);
    }

    * execute(array) {
        document.getElementById("output").textContent = runNetworksConcurrently;
        // asdf;
        if (runNetworksConcurrently) {
            yield* this.executeConcurrently(array);
        } else {
            yield* this.executeSequentially(array);
        }
        // abss();
    }

    * executeSequentially(array) {
        
        for (let i = 0; i < this.operations.length; i++) {
            const op = this.operations[i];
            const type = op[2];

            // if (op[1] >= array.length) {
            //     continue;
            // }
            // document.getElementById("output").textContent = `${op[0]} - ${op[1]}`;

            switch (type) {
                case CompareOperation:
                    yield* array.compareAndSwap(op[0], op[1]);
                    break;
                case SwapOperation:
                    yield array.swap(op[0], op[1]);
                    break;       
            }

        }
    }

    * executeConcurrently(array) {
        let usedIndices = new Set();
        let operations = [];
        for (let i = 0; i < this.operations.length; i++) {
            const op = this.operations[i];
            const type = op[2];

            if (usedIndices.has(op[0]) || usedIndices.has(op[1])) {
                yield operations;
                operations.length = 0;
                usedIndices.clear();
            }
            
            usedIndices.add(op[0]);
            usedIndices.add(op[1]);

            switch (type) {
                case CompareOperation:
                    runGen(array.compareAndSwap(op[0], op[1]));
                    array.swap(op[0], op[1]);
                    chain(array.swap(op[0], op[1]));
                    break;
                case SwapOperation:
                    chain(array.swap(op[0], op[1]));
                    break;       
            }
        }

        yield operations;

        function runGen(gen) {
            while (!gen.next().done) {};
        } 

        function chain(array) {
            for (let i = 0; i < array.length; i++) {
                operations.push(array[i]);
            }
        }
    }
}

export function* bitonicSort(array) {
    let network = new sortingNetwork()

    const length = array.length;

    const nearest2Power = Math.ceil(Math.log2(length))

    
    for (let i = 0; i < nearest2Power; i++) {
        const subArraySize = Math.pow(2, i);
        const subArrayCount = length / subArraySize;

        for (let subSubSize = subArraySize; subSubSize >= 1; subSubSize /= 2) {
            const subSubCount = length / subSubSize;

            for (let i3 = 0; i3 < subSubCount; i3 += 2) {
                const start1 = i3 * subSubSize;
                const start2 = start1 + subSubSize;
                
                if (subSubSize == subArraySize && subArraySize != 1) {
                    const end = start2 + subSubSize;

                    for (let i4 = 0; i4 < subSubSize; i4++) {
                        if (end - i4 - 1 >= length) {
                            continue;
                        }
        
                        network.add(start1 + i4, end - i4 - 1);
                    }
                    continue;
                }

                for (let i4 = 0; i4 < subSubSize; i4++) {
                    if (start2 + i4 >= length) {
                        break;
                    }

                    network.add(start1 + i4, start2 + i4);
                }
            }
        }
    }

    
    // yield* network.executeSequentially(array);
    yield* network.execute(array);
    // yield* insertionSort(array);
}

export function* BatcherOddEvenMergeSort(array) {
    const network = new sortingNetwork();

    const length = array.length;

    for (let p = 1; p < length; p *= 2) {
        for (let k = p; k >= 1; k /= 2) {
            for (let j = (k % p); j <= length - k - 1; j += 2 * k) {
                const iLimit = Math.min(k - 1, length - j - k - 1);
                for (let i = 0; i <= iLimit; i++) {
                    if (Math.floor((i + j) / (p * 2)) == Math.floor((i + j + k) / (p * 2))) {
                        network.add(i + j, i + j + k);
                    }
                }
            }
        }
    }

    yield* network.execute(array);
}
