
export function debugPrint(what) {
    console.log(what);
}

export function* reverse(array) {
    const limit = Math.floor(array.length / 2);

    for (let i = 0; i < limit; i++) {
        yield array.swap(i, array.length - i - 1);
    }
}

export function* binarySearch(array, value, setter, comparer = function (n1, n2) { return n1 <= n2 }) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        let middle = Math.floor((low + high) / 2);
        yield array.get(middle);
        let current = array.getVal;

        if (current <= value) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }

    setter(low);
}

export function* validate(array, comparer = function (n1, n2) { return n1 <= n2; }) {
    const length = array.length;
    if (length <= 0) {
        return;
    }

    yield array.get(0);
    let previous = array.getVal;
    for (let i = 1; i < length; i++)  {
        yield array.get(i);
        let current = array.getVal;
        if (!comparer(previous, current)) {
            debugPrint(`error validating array from ${array.trueIndex(0)} to ${array.trueIndex(length)}`);
            asdf;
        }

        previous = current;
    }
}

export function assert(condition, message = "error somewhere") {
    if (condition) {
        return;
    }

    debugPrint(message);
    asdf;
}
