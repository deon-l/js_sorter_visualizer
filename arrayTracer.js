export class ArrayTracer {

    // items;
    // start;
    // end;
    // skip;
    // getVal;

    constructor(count)
    {
        this.items = [];
        this.items.length = count;
        this.start = 0;
        this.end = count;
        this.skip = 1;

        this.getVal = -1;
    }

    slice(start, end, skip = 1) {
        let span = new ArrayTracer(0);
        span.items = this.items;
        span.start = this.trueIndex(start);
        span.end = this.trueIndex(end);
        span.skip = this.skip * skip;

        return span;
    }

    trueIndex(index) {
        return this.start + index * this.skip;
    }

    get length()
    {
        return Math.floor((this.end - this.start) / this.skip);
    }

    set(index, value)
    {
        if (value === undefined) {
            return [{}];
        }
        index = this.trueIndex(index);
        this.items[index] = value;
        return [new BarChange("rgb(256 256 0)", index, value)];
    }

    get(index)
    {
        index = this.trueIndex(index);
        this.getVal = this.items[index];
        return [new BarChange("rgb(256 0 0)", index, this.items[index])];
    }

    swap(index1, index2)
    {
        index1 = this.trueIndex(index1);
        index2 = this.trueIndex(index2);
        if (index1 < 0 || index2 < 0 || index1 >= this.items.length || index2 >= this.items.length) {
            return [{}];
        }
        
        let temp = this.items[index1];
        this.items[index1] = this.items[index2];
        this.items[index2] = temp;
        return [
            new BarChange("rgb(256 0 0)", index1, this.items[index1]),
            new BarChange("rgb(256 0 0)", index2, this.items[index2])
        ];
    }

    * compareAndSwap(index1, index2) {
        yield this.get(index1);
        yield this.get(index2);
        
        if (this.items[index1] > this.items[index2]) {
            yield this.swap(index1, index2);
        }
    }

    * compare(index1, index2, comparer = function (n1, n2) { return n1 <= n2 } ) {
        yield this.get(index1);
        yield this.get(index2);

        this.getVal =  comparer(this.items[this.trueIndex(index1)], this.items[this.trueIndex(index2)]);
    }
}

export class BarChange {
    color
    index
    value
    persists

    constructor (color, index, value, persists = 1)
    {
        this.color = color;
        this.index = index;
        this.value = value;
        this.persists = persists;
    }
}

