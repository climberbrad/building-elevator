import {findClosestForEachStop} from "./util/ElevatorUtil.ts";

const TRAVEL_TIME_PER_FLOOR: number = 10;

test ('findClosest in any direction with stat', () =>  {
    const currentFloor = 12;
    const destinations = [2,9,1,32];
    const stat = findClosestForEachStop(currentFloor, destinations, TRAVEL_TIME_PER_FLOOR)
    expect(stat).toEqual({ currentFloor: 12, destinations: [ 9, 2, 1, 32 ], totalTime: 420 })
    console.log(stat)
})