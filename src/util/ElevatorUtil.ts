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

export const findClosestBinarySearch = (currentFloor: number, destinations: number[]) => {
    if(destinations.length === 1) return destinations[0];

    destinations.sort((a, b) => a - b);
    const middleIndex = Math.floor(destinations.length / 2);
    const left: number[] = destinations.slice(0, middleIndex);
    const right: number[] = destinations.slice(middleIndex, destinations.length)

    // less than or greater than anything in the destination list
    if(currentFloor > right[right.length-1]) return right[right.length-1]
    if(currentFloor < left[0]) return left[0];

    // between left and right so check both
    if(currentFloor > left[left.length] && currentFloor < right[0]) {
        return findClosest(currentFloor, destinations)
    }

    // larger than anything on the left so check right
    if(currentFloor > right[0]) {
        return findClosest(currentFloor, right)
    }

    if(currentFloor < left[left.length]) {
        return findClosest(currentFloor, left)
    }

    return findClosest(currentFloor, destinations)
}


export const travelTimeAnyDirection = (currentFloor: number, destinations: number[], timePerFloor: number): number => {
    let sum: number = Math.abs(Math.abs(currentFloor) - Math.abs(destinations[0])) * timePerFloor;

    for (let i = 0; i < destinations.length - 1; i++) {
        const delta: number = Math.abs(Math.abs(destinations[i]) - Math.abs(destinations[i + 1])) * timePerFloor
        sum += delta;
    }

    return sum;
}

export const findClosestForEachStop = (currentFloor: number, destinations: number[], timePerFloor: number): ElevatorStat => {
    const orderedDestinations: number[] = [currentFloor]; // seed with starting floor

    while (orderedDestinations.length < destinations.length + 1) {
        const availableStops = destinations.filter(x => !orderedDestinations.includes(x))
        const nextDest: number = findClosestBinarySearch(orderedDestinations[orderedDestinations.length - 1], availableStops)
        orderedDestinations.push(nextDest)
    }

    // remove starting floor
    const finalList = orderedDestinations.filter(x => x !== currentFloor)

    return {
        currentFloor: currentFloor,
        destinations: finalList,
        totalTime: travelTimeAnyDirection(currentFloor, finalList, timePerFloor),
    }
}

export const quickSort = (destinations: number[]): number[] => {
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

export const getElevatorStatForSort = (currentFloor: number, unorderedDestinations: number[], sortList: (unorderedList: number[]) => number[], timePerFloor: number): ElevatorStat => {
    const orderedList = sortList(unorderedDestinations)
    const totalTime = travelTimeAnyDirection(currentFloor, orderedList, timePerFloor)

    return {
        currentFloor: currentFloor,
        destinations: orderedList.flat(Infinity),
        totalTime: totalTime,
    }
}