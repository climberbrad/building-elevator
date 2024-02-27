import {
    findClosest,
    quickSort,
    bubbleSort,
    getElevatorStatForSort,
    ElevatorStat,
    findClosestForEachStop, travelTimeAnyDirection
} from "./util/ElevatorUtil.ts";

const DESTINATIONS_UNSORTED: number[] = [6, 7, 15, 12, 4, 8, 24, 2, 19, 20];
const DESTINATIONS_SORTED: number[] = [2, 4, 6, 7, 8, 12, 15, 19, 20, 24];
const TRAVEL_TIME_PER_FLOOR: number = 10;

test('findClosest single floor request', () => {
    const currentFloor = 1;
    const floorRequest = [6]
    const direction = undefined; // sitting idle
    const nextFloor = findClosest(currentFloor, floorRequest, direction)
    expect(nextFloor).toBe(6);
});

test('findClosest with array moves to closest first', () => {
    const currentFloor = 1;
    const direction = undefined; // sitting idle

    const nextFloor = findClosest(currentFloor, DESTINATIONS_UNSORTED, direction)
    expect(nextFloor).toBe(2);
});

test('findClosest moves to closest in current direction', () => {
    const currentFloor = 6;
    const floorRequest = [5, 10, 11, 12]
    const direction = 'UP'; // moving up

    const nextFloor = findClosest(currentFloor, floorRequest, direction)
    expect(nextFloor).toBe(10);
});

test ('findClosest any direction for all floors with time', () =>  {
    const currentFloor = 12;
    const destinations = [2,9,1,32];
    const stat = findClosestForEachStop(currentFloor, destinations, TRAVEL_TIME_PER_FLOOR)
    console.log(stat)
})

test('travel time', () => {
    const timePerFloor = 10;
    const currentFloor = 6;
    const destinations = [12, 15]

    // (12 - 6) * 10)) + (12 - 15) * 10)) = 90
    const expected = 90;
    expect(travelTimeAnyDirection(currentFloor, destinations, timePerFloor)).toEqual(expected)
})

test('quick sort', () => {
    const result = quickSort(DESTINATIONS_UNSORTED);
    expect(result.flat(Infinity)).toEqual(DESTINATIONS_SORTED)
})

test('bubble sort', () => {
    const result = bubbleSort(DESTINATIONS_UNSORTED);
    expect(result).toEqual(DESTINATIONS_SORTED)
})

test('total time bubble sort', () => {
    const stat: ElevatorStat = getElevatorStatForSort(1, [9, 6, 4, 2], bubbleSort, TRAVEL_TIME_PER_FLOOR)
    expect(stat).toEqual({currentFloor: 1, destinations: [2, 4, 6, 9], totalTime: 80})
    console.log(stat)
})

test('total time quick sort', () => {
    const stat: ElevatorStat = getElevatorStatForSort(1, [9, 6, 4, 2], quickSort, TRAVEL_TIME_PER_FLOOR)
    expect(stat).toEqual({currentFloor: 1, destinations: [2, 4, 6, 9], totalTime: 80})
    console.log(stat)
})

test('total time quick sort full list', () => {
    const stat: ElevatorStat = getElevatorStatForSort(1, DESTINATIONS_UNSORTED, quickSort, TRAVEL_TIME_PER_FLOOR)
    expect(stat).toEqual({currentFloor: 1, destinations: DESTINATIONS_SORTED, totalTime: 230})
    console.log(stat)
})

test('total time bubble sort full list', () => {
    const stat: ElevatorStat = getElevatorStatForSort(1, DESTINATIONS_UNSORTED, bubbleSort, TRAVEL_TIME_PER_FLOOR)
    expect(stat).toEqual({currentFloor: 1, destinations: DESTINATIONS_SORTED, totalTime: 230})
    console.log(stat)
})
