export function* stoogeSort(array){
    let stack = [[0, array.length]];

    let data;
    while ((data = stack.pop()) !== undefined) {
        const start = data[0];
        const end = data[1];
        const length = end - start;

        if (length <= 1) {
            continue;
        }

        yield* array.compareAndSwap(start, end - 1);

        if (length == 2) {
            continue;
        }

        const third = Math.floor(length / 3);

        stack.push([start, end - third]);
        stack.push([start + third, end]);
        stack.push([start, end - third]);
    }
}

export function* slowSort(array) {

    yield* subSort(0, array.length - 1);
    function* subSort(start, last) {
        const length = last - start + 1;
        if (length <= 1) {
            return;
        }

        const half = Math.floor((last + start) / 2);

        yield* subSort(start, half);
        yield* subSort(half + 1, last);
        yield* array.compareAndSwap(half, last);
        yield* subSort(start, last - 1);
    }
}

export function* bogoSort(array) {
    let success = false;
    do {
        for (let i = 0; i < array.length - 1; i++) {
            let swapI = i + Math.floor(Math.random() * (array.length - i));
            yield array.swap(i, swapI);
        }

        yield array.get(0);
        let previous = array.getVal;
        success = true;
        for (let i = 1; i < array.length; i++) {
            yield array.get(i);
            if (previous > array.getVal) {
                success = false;
                break;
            }

            previous = array.getVal;
        }
    } while (!success);
}
