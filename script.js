import { binaryInsertionSort, insertionSort, shellSort } from "./sorts/insertion.js";
import { selectionSort, heapSort, weakHeapSort, smoothSort } from "./sorts/selectionSorts.js";
import { pdqSort, introspectiveSort, quickSort } from "./sorts/quickSorts.js";
import { mergeSort, iterativeMergeSort, timSort, rotateMergeSort } from "./sorts/merge.js";
import { countingSort, radixSort } from "./sorts/distributionSorts.js";
import { BatcherOddEvenMergeSort, bitonicSort, setRunConcurrent } from "./sorts/concurrentSorts.js";
import { sqrtSort } from "./sorts/blockSorts.js";
import { bogoSort, slowSort, stoogeSort } from "./sorts/jokeSorts.js";
import { ArrayTracer } from "./arrayTracer.js";
import { almostSorted, pipeOrgan, randomExponential, randomize, randomRuns, randomSquareRoot, reverse, spikes } from "./generators.js";
import { bubbleSort, cocktailSort, combSort } from "./sorts/bubbleSort.js";

// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Drawing_graphics

const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight - canvas.getBoundingClientRect().top - 4);
const maxValue = 1024 * 8;

const ctx = canvas.getContext("2d")

let globalSpeedFactor = 1;
const speedSelector = document.getElementById("speedFactor");
export function setNewSpeed() {
    let newSpeed = Number(speedSelector.value);
    if (newSpeed < 0) {
        speedSelector.value = globalSpeedFactor;
        return;
    }

    globalSpeedFactor = newSpeed;
    // document.getElementById("output").textContent = globalSpeedFactor;
}

export function reset()
{
    document.getElementById("output").textContent = "new";
    barsToReset.clear();
    defaultColorOverride.clear();

    ctx.fillStyle = "rgb(0 0 0)";
    ctx.fillRect(0, 0, width, height);
}

export function onClick()
{
    reset();
    setNewSpeed();
    const elementCount = document.getElementById("elementCount").value;
    const generationMethod = document.getElementById("generationMethod").value;
    const sortingMethod = document.getElementById("sortingMethod").value;

    // runNetworksConcurrently = false;
    // runNetworksConcurrently = document.getElementById("concurrent_check").checked;
    setRunConcurrent(document.getElementById("concurrent_check").checked);
    
    console.log(elementCount)
    console.log(generationMethod)
    console.log(sortingMethod)
    
    const array = new ArrayTracer(elementCount);
    // document.getElementById("output").textContent = sortingMethod;
	barWidth = width / elementCount;
	previousTime = undefined;
	stepTime = 60 / 10 * 128 / elementCount;
    barsToReset.length = 0;
    iterations = 0;

	generator = getGenerators();
	requestAnimationFrame(drawIteration);
	
    function* getGenerators() {
        const gen_iterator = getGenerationMethod(generationMethod)(array, maxValue);
        if (document.getElementById("skip_gen_toggle").checked)
        {
            let changes = [];
            for (const current_changes of gen_iterator) {
                changes = changes.concat(current_changes);
                console.log(changes);
            }
            yield changes;
        }
        else
        {
            yield* gen_iterator;
        }
		yield* getSortingAlgorithm(sortingMethod)(array);
    }
    
}


let barWidth = 0;
let generator = null;
let previousTime = undefined;
let stepTime = 0;
let iterations = 0;
const barsToReset = new Map();
const defaultColorOverride = new Map();
function drawIteration(timestamp) {
    let stepCount = 0;
    setNewSpeed();
    if (globalSpeedFactor == 0) {
        previousTime = undefined;
    } else if (previousTime === undefined) {
        previousTime = timestamp;
        stepCount = 1;
    } else {
        let duration = timestamp - previousTime;
        stepCount = Math.floor(duration * globalSpeedFactor / stepTime);
        previousTime += stepCount / globalSpeedFactor * stepTime;
        // document.getElementById("output").textContent = `${globalSpeedFactor} | ${duration} > ${stepCount}`;
    }    
    
    // document.getElementById("output").textContent = "c"

    iterations++;
    // document.getElementById("output").textContent = "t: " + iterations;
    if (stepCount != 0) {
        clearDiscolored()
    }
	
    // document.getElementById("output").textContent = "butane";
    for (let i = 0; i < stepCount; i++) {
        
        const data = generator.next();
        
        // document.getElementById("output").textContent = iterations + "" + data.done;
        if (data.done) {
            clearDiscolored();
            document.getElementById("output").textContent = "return";
            return;
        } 
		
        const barChanges = data.value;

		for (let i2 = 0; i2 < barChanges.length; i2++) {
            let barChange = barChanges[i2];
			drawBar(barChange.index, maxValue, "rgb(0 0 0)");

            if (barChange.color.length == 0) {
                barChange.color = defaultColor(barChange.value);
                defaultColorOverride.delete(barChange.index);
            }

			drawBar(barChange.index, barChange.value, barChange.color);
            
            if (barChange.persists != -1) {
                barsToReset.set(barChange.index, barChange)
            }
            else {
                barsToReset.delete(barChange.index);
                defaultColorOverride.set(barChange.index, barChange.color);
            }
        }
		
    }
	
    requestAnimationFrame(drawIteration)
}

function clearDiscolored() {
    for (const [key, barChange] of barsToReset.entries()) {
        barChange.persists -= 1;
        if (barChange.persists <= 0) {
            let color = defaultColorOverride.get(barChange.index);
            if (color === undefined) {
                color = defaultColor(barChange.value);
            }

            drawBar(barChange.index, barChange.value, color);
            barsToReset.delete(key);
        }
    }
    
}

function drawBar(index, barHeight, color) {
    ctx.fillStyle = color;
    let actualHeight = barHeight / maxValue * height;
    let startX = Math.round(index * barWidth);
    let endX = Math.round((index + 1) * barWidth);
    // let endX = startX + barWidth;
    ctx.fillRect(startX, height - actualHeight, endX - startX, height);
}

function defaultColor(value) {
	return `hsl(${value / maxValue * 360} 100% 50%)`
}

function getGenerationMethod(key) {
    switch (key) {
        case "random":
            return randomize;
        case "exponential":
            return randomExponential;
        case "sqrt":
            return randomSquareRoot;
        case "almost":
            return almostSorted;
        case "reverse":
            return reverse;
        case "spikes":
            return spikes;
        case "pipeOrgan":
            return pipeOrgan;
        case "runs":
            return randomRuns;
    }
}

function getSortingAlgorithm(key) {
    switch (key) {
        case "bubble":
            return bubbleSort;
        case "insertion": 
            return insertionSort;
        case "shell":
            return shellSort;
        case "selection": 
            return selectionSort;
        case "cocktail":
            return cocktailSort;
        case "comb":
            return combSort;
        case "heap":
            return heapSort;
        case "binary_insertion":
            return binaryInsertionSort;
        case "weak_heap":
            return weakHeapSort;
        case "smooth":
            return smoothSort;
        case "quick":
            return quickSort;
        case "introspective":
            return introspectiveSort;
        case "pdq":
            return pdqSort;
        case "merge":
            return mergeSort;
        case "iterative_merge":
            return iterativeMergeSort;
        case "tim":
            return timSort;
        case "rotate":
            return rotateMergeSort;
        case "radix":
            return radixSort;
        case "counting":
            return countingSort;
        case "bitonic":
            return bitonicSort;
        case "boem":
            return BatcherOddEvenMergeSort
        case "sqrt":
            return sqrtSort;
        case "stooge":
            return stoogeSort;
        case "slow":
            return slowSort;
        case "bogo":
            return bogoSort;
    }
}

