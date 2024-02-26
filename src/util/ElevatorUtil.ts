// find the closest floor in the array of floors, use current direction if provided, then default to finding the closest without direction
export const findClosest = (currentFloor: number, stopRequests: number[], direction?: string): number => {
    if (stopRequests.length === 0) return currentFloor;
    if (stopRequests.length === 1) return stopRequests[0]

    const closest = stopRequests
        .reduce(function (prev, curr) {
            return (Math.abs(curr - currentFloor) < Math.abs(prev - currentFloor) ? curr : prev);
        });

    if (direction === undefined) return closest

    const directionalDestinations = stopRequests
        .filter(floor => direction === 'UP' ? floor > currentFloor : floor < currentFloor)

    // return the closest stop in the current direction or the closest in either direction
    return directionalDestinations.length > 0 ? directionalDestinations
            .reduce(function (prev, curr) {
                return (Math.abs(curr - currentFloor) < Math.abs(prev - currentFloor) ? curr : prev);
            })
        : closest;
}

export const travelTime = (currentFloor: number, destinations: number[], timePerFloor: number) => {

    let totalTime: number = Math.abs(destinations[0] - currentFloor) * timePerFloor;
    const orderedList = destinations.sort((a, b) => a - b)
    for (let i = 0; i < orderedList.length - 1; i++) {
        totalTime += (Math.abs(orderedList[i + 1]) - Math.abs(orderedList[i])) * timePerFloor;
    }

    return totalTime;
}

export const quickSort = (destinations: number[]): number[]  => {
    if (destinations.length <= 1) return destinations;
    const pivot = destinations[0]

    const left: number[] = destinations.filter(item => item < pivot)
    const right: number[] = destinations.filter(item => item > pivot)

    return [...quickSort(left), pivot, ...quickSort(right)]
}

export const bubbleSort = (destinations: number[]): number[] => {
    for (let i = 0; i < destinations.length; i++) {
        for (let j = 0; j < destinations.length - 1; j++) {
            const curr = destinations[j];
            const next = destinations[j + 1]

            // swap places with item in front of you
            if (curr > next) {
                destinations[j] = next;
                destinations[j + 1] = curr;
            }
        }
    }
    return destinations;
}


export type ElevatorStat = {
    currentFloor: number,
    destinations: number[],
    totalTime: number,
}

export const getElevatorStat = (currentFloor: number, unorderedDestinations: number[], sortList: (unorderedList: number[]) => number[], timePerFloor: number): ElevatorStat => {
    const orderedList = sortList(unorderedDestinations)
    const totalTime = travelTime(currentFloor, orderedList, timePerFloor)

    return {
        currentFloor: currentFloor,
        destinations: orderedList.flat(Infinity),
        totalTime: totalTime,
    }
}