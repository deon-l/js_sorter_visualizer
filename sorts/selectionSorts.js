import { debugPrint } from "./helper.js";

export function* selectionSort(array) {
    const length = array.length;

    for (let i = 0; i < length - 1; i++)
    {
        yield array.get(i);
        let min = array.getVal;
        let minI = i;

        for (let i2 = i + 1; i2 < length; i2++) {
            yield array.get(i2);
            let value = array.getVal;

            if (value >= min) {
                continue;
            }

            min = value;
            minI = i2;
        }

        yield array.swap(i, minI);
    }
}

export function* heapSort(array) {
    const length = array.length;
    let heapSize = length;

    function* siftDown(index) {
        yield array.get(index);
        let current = array.getVal;

        while (true) {
            let child1I = index * 2 + 1;
            let child2I = index * 2 + 2;
            
            if (child1I >= heapSize) {
                return;
            } 

            let swapI = child1I;
            yield array.get(child1I);
            let swap = array.getVal;
            
            if (child2I < heapSize) {
                yield array.get(child2I);
                let child2 = array.getVal;
                
                if (swap < child2) {
                    swapI = child2I;
                    swap = child2;
                }
            }

            

            if (current >= swap) {
                return;
            }
            
            yield array.swap(index, swapI);
            index = swapI;
        }
    }

    for (let i = Math.floor(length / 2); i >= 0; i--) {
        yield* siftDown(i);
    }

    while (heapSize > 0) {
        heapSize--;
        yield array.swap(0, heapSize)
        yield* siftDown(0);
    }
}

export function* weakHeapSort(array) {
    let length = array.length;
    const nodeFlipped = [];
    nodeFlipped.length = array.length;

    for (let i = length - 1; i > 0; i--) {
        yield* join(i);
    }

    while (length > 1) {
        yield array.swap(0, length - 1);
        length--;
        yield* siftDown();
    }

    function* join(index) {
        let distinguishedAncestor = index;

        while (true) {
            const isOdd = distinguishedAncestor % 2 == 1
            distinguishedAncestor = Math.floor(distinguishedAncestor / 2);

            if (isOdd == !nodeFlipped[distinguishedAncestor]) {
                break;
            }
        }

        yield* array.compare(index, distinguishedAncestor);
        if (!array.getVal) {
            yield array.swap(index, distinguishedAncestor);
            nodeFlipped[index] = !nodeFlipped[index];
        }
    }

    function* siftDown() {
        if (length <= 1) {
            return;
        }
        let lowestLeftDescendant = 1;

        while (true) {
            let leftI = lowestLeftDescendant * 2;
            if (nodeFlipped[lowestLeftDescendant]) {
                leftI += 1;
            }
            if (leftI >= length) {
                break;
            }
            lowestLeftDescendant = leftI;
        }

        while (lowestLeftDescendant > 0) {
            yield* join(lowestLeftDescendant);
            lowestLeftDescendant = Math.floor(lowestLeftDescendant / 2);
        }
    }
}

const leonardoTreeSizes = [1, 1];
const presentTrees = [false, false];
export function* smoothSort(array) {
    let maxTreeLevel = 1;
    presentTrees.fill(false);

    const length = array.length;
    for (let i = 0; i < length; i++) {
        let treeLevel = -1;
        
        for (let i2 = maxTreeLevel; i2 > 0; i2--) {
            if (presentTrees[i2] && presentTrees[i2 - 1]) {
                treeLevel = i2 + 1;
                presentTrees[i2] = false;
                presentTrees[i2 - 1] = false;
                if (i2 == maxTreeLevel) {
                    maxTreeLevel++;
                }

                if (presentTrees.length > treeLevel) {
                    presentTrees[i2 + 1] = true;
                    break;
                } 
                presentTrees.push(true);
                leonardoTreeSizes.push(1 + leonardoTreeSizes[i2] + leonardoTreeSizes[i2 - 1]);
                break;
            }
        }
        if (treeLevel == -1) {
            if (presentTrees[1]) {
                presentTrees[0] = true;
                treeLevel = 0;
            } else {
                presentTrees[1] = true;
                treeLevel = 1;
            }
        }

        yield* fixTree(i, treeLevel);
    }

    debugPrint("hello");
    for (let i = length - 1; i >= 0; i--) {
        let lastTreeLevel = 0;
        while (!presentTrees[lastTreeLevel]) {
            lastTreeLevel++;
        }
        presentTrees[lastTreeLevel] = false;
        if (lastTreeLevel <= 1) {
            continue;
        }

        presentTrees[lastTreeLevel - 1] = true;
        presentTrees[lastTreeLevel - 2] = true;
        yield* fixTree(i - 1 - leonardoTreeSizes[lastTreeLevel - 2], lastTreeLevel - 1);
        yield* fixTree(i - 1, lastTreeLevel - 2);
    }

    function* fixTree(rootI, level) {
        while (true) {
            let previousI = rootI - leonardoTreeSizes[level];
            debugPrint(`${rootI} - ${previousI}`);
            if (previousI < 0) {
                break;
            }

            yield array.get(previousI);
            let previousValue = array.getVal;
            
            yield array.get(rootI);
            if (previousValue <= array.getVal) {
                break;
            }
            if (level > 1) {
                yield array.get(rootI - 1);
                if (previousValue <= array.getVal) {
                    break;
                }

                yield array.get(rootI - 1 - leonardoTreeSizes[level - 2]);
                if (previousValue <= array.getVal) {
                    break;
                }
            }

            yield array.swap(previousI, rootI);
            rootI = previousI;

            do {
                level++;
                if (level > maxTreeLevel) {
                    break;
                }
            } while (!presentTrees[level]);
            if (level > maxTreeLevel) {
                break;
            }
        }

        yield* siftDown(rootI, level);
    }

    function* siftDown(rootI, treeLevel) {
        while (treeLevel > 1) {
            let child1I = rootI - 1;
            let child2I = child1I - leonardoTreeSizes[treeLevel - 2];

            yield array.get(child1I);
            let child1 = array.getVal;
            yield array.get(child2I);
            let child2 = array.getVal;

            let targetI = child1I;
            let target = child1;
            let targetTreeLevel = treeLevel - 2;
            if (child1 < child2) {
                targetI = child2I;
                target = child2;
                targetTreeLevel = treeLevel - 1;
            }

            yield array.get(rootI);
            if (array.getVal >= target) {
                return;
            }

            yield array.swap(rootI, targetI);
            rootI = targetI;
            treeLevel = targetTreeLevel;
        }
    }
}
