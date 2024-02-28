import {findClosestBinarySearch, findClosestForEachStop} from "./util/ElevatorUtil.ts";

const TRAVEL_TIME_PER_FLOOR: number = 10;

test('findClosest in any direction with stat', () => {
    const currentFloor = 12;
    const destinations = [2, 9, 1, 32];
    const stat = findClosestForEachStop(currentFloor, destinations, TRAVEL_TIME_PER_FLOOR)
    expect(stat).toEqual({currentFloor: 12, destinations: [9, 2, 1, 32], totalTime: 420})
    console.log(stat)
})

test('binary search currentFloor greater than all destinations', () => {
    const currentFloor: number = 16;
    const destinations: number[] = [3, 6, 14, 7, 11, 9, 10]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(14)
})

test('binary search currentFloor less than all destinations', () => {
    const currentFloor: number = 1;
    const destinations: number[] = [3, 6, 14, 7, 11, 9, 10]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(3)
})

test('binary search currentFloor within right', () => {
    const currentFloor: number = 12;
    const destinations: number[] = [3, 6, 14, 7, 11, 9, 10]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(11)
})

test('binary search currentFloor within left', () => {
    const currentFloor: number = 4;
    const destinations: number[] = [3, 6, 14, 7, 11, 9, 10]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(3)
})

test('binary search currentFloor between left and right', () => {
    const currentFloor: number = 8;
    const destinations: number[] = [4, 10, 12, 11, 2, 6]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(6)
})

test('binary search destination list single item', () => {
    const currentFloor: number = 8;
    const destinations: number[] = [6]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(6)
})

test('binary search destination de-duped', () => {
    const currentFloor: number = 8;
    const destinations: number[] = [6, 1, 9, 12, 16, 1, 9, 3]
    const closest = findClosestBinarySearch(currentFloor, destinations)
    expect(closest).toEqual(9)
})