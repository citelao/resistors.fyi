export function from<T>(from: number, to: number, fn: (index: number) => T): T[] {
    const arr = [];
    for (let index = from; index <= to; index++) {
        arr.push(fn(index));
    }

    return arr;
}

export function repeat<T>(n: number, fn: (index: number) => T): T[] {
    const arr = [];
    for (let index = 0; index < n; index++) {
        arr.push(fn(index));
    }

    return arr;
}