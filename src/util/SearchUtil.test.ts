import {
    closestTo,
    sortListToClosest,
    sortListToClosestWithTime
} from "./SearchUtil.ts";

test('find closest', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1, 2, 3, 5, 8, 9, 10, 11, 12, 13, 14]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('find closest default lower', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1, 2, 3, 5, 7, 9, 10, 11, 12, 13, 14]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('de-dup', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1, 2, 3, 5, 7, 9, 2, 3, 1, 13, 14]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('single destination', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(1)
})

test('two lower destinations', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1,2]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(2)
})

test('two higher destinations', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [11,12]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(11)
})

test('current in exact middle of destinations default lower', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1,2,3,4,8,9,10,11]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(4)
})

test('current between single item on either side', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [5,7]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('closer is higher but binary split leaves one item on left', () => {
    const currentFloor: number = 5;
    const destinations: number[] = [6,8,1]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(6)
})

test('tie goes to lower number', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [5,7]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('Sort entire list by closest starting with current', () => {
    const currentFloor: number = 12;
    const destinations: number[] = [2,9,1,32]

    const result = sortListToClosest(currentFloor, destinations)
    expect(result).toEqual([9,2,1,32])
})

test('Return Stat for trip', () => {
    const currentFloor: number = 12;
    const destinations: number[] = [2,9,1,32]

    const result = sortListToClosestWithTime(currentFloor, destinations, 10)
    expect(result).toEqual(
        {
            currentFloor: 12,
            destinations: [9,2,1,32],
            totalTime: 420,
        })
})

// const findIt = (a: number, b: number[], search: (current: number, list: number[]) => number[]) => closestTo(a, b, search);
//
// const cases = [
//     [6, [1, 2], constantTimeSearch, 2],
//     [6, [1, 2], binarySearch, 2],
// ];
// test.each(cases)(
//     "Search closest",
//     (current, destinations, search, expected) => {
//         const result = findIt(
//             current as number,
//             destinations as number[],
//             search as (current: number, list: number[]) => number[])
//         expect(result).toEqual(expected)
//     }
// )