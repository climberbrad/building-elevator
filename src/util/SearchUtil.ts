// recurse down orderedList until there are two values left, then choose the closer value
import {ElevatorStat} from "./ElevatorUtil.ts";

function binarySearch(current: number, orderedList: number[]): number[] {
    const middleIndex: number = Math.floor(orderedList.length / 2);

    if (orderedList.length === 2) {

        // return the closest number as an array with length 1, tie goes to higher number
        return Math.abs(current - orderedList[0]) < Math.abs(current - orderedList[1])
            ? [orderedList[0]]
            : [orderedList[1]];
    }

    // keep splitting the array until there is only 2 items left
    if (orderedList.length > 2) {
        if(orderedList[middleIndex] > current) {
            return binarySearch(current, orderedList.slice(0, middleIndex))
        } else {
            return binarySearch(current, orderedList.slice(middleIndex, orderedList.length))
        }
    }

    return orderedList;
}

export const closestTo = (current: number, unorderedList: number[]): number => {
    if (unorderedList.length === 0) return current;
    if (unorderedList.length === 1) return unorderedList[0];

    // de-dup and sort destinations
    const deDup = new Set(unorderedList)
    const sortedList = Array.from(deDup).sort((a, b) => a - b);

    // binarySearch will always return single item array
    const result: number[] = binarySearch(current, [...sortedList])

    // return -1 if all goes wrong
    return result.length === 1 ? result[0] : -1;
}

export const sortListToClosest = (current: number, unorderedList: number[]): number[] => {
    const orderedByClosest: number[] = [closestTo(current, unorderedList)]

    for (let i = 0; i < unorderedList.length - 1; i++) {
        const closest = closestTo(
            orderedByClosest[i],
            unorderedList
                .filter(item => !orderedByClosest.includes(item))
        );
        orderedByClosest.push(closest)
    }
    return orderedByClosest;
}

export const sortListToClosestWithTime = (current: number, unorderedList: number[], timePerFloor: number): ElevatorStat => {
    const firstStop = closestTo(current, unorderedList);
    const orderedByClosest: number[] = [firstStop]
    let totalTime = Math.abs(current - firstStop) * timePerFloor;

    for (let i = 0; i < unorderedList.length - 1; i++) {
        const current = orderedByClosest[i];

        const closest = closestTo(
            current,
            unorderedList.filter(item => !orderedByClosest.includes(item))
        );

        totalTime += Math.abs(current - closest) * timePerFloor
        orderedByClosest.push(closest);
    }
    return {currentFloor: current, destinations: orderedByClosest, totalTime: totalTime};
}