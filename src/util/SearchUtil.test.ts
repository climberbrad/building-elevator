import {closestTo, sortListToClosest, sortListToClosestWithTime} from "./SearchUtil.ts";

test('Binary Search find closest', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1, 2, 3, 5, 8, 9, 10, 11, 12, 13, 14]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('Binary Search find closest default higher', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1, 2, 3, 5, 7, 9, 10, 11, 12, 13, 14]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(7)
})

test('Binary Search de-dups', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1, 2, 3, 5, 7, 9, 2, 3, 1, 13, 14]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(5)
})

test('Binary Search single destination', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(1)
})

test('Binary Search two lower destinations', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1,2]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(2)
})

test('Binary Search two higher destinations', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [11,12]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(11)
})

test('Binary Search currentFloor in exact middle of destinations default lower', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [1,2,3,4,8,9,10,11]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(4)
})

test('Binary Search tie goes to higher number', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [5,7]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(7)
})

test('Binary Search tie goes to higher number', () => {
    const currentFloor: number = 6;
    const destinations: number[] = [5,7]
    const closest = closestTo(currentFloor, destinations)
    expect(closest).toEqual(7)
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