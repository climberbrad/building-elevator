import './App.css'
import {Box, Button, Grid, Typography} from "@mui/material";
import {useEffect, useReducer, useRef} from "react";
import {ArrowUpCircleIcon, ArrowDownCircleIcon} from "@heroicons/react/20/solid";
import {Building} from "./building/Building.tsx";

const NUM_FLOORS = 12;
const WINDOWS_PER_FLOOR = 7;
const BUTTONS_PER_ROW = 4;

interface ElevatorState {
    type: string;
    direction: string | undefined;
    currentFloor: number;
    destinations: number[];
    nextStop: number | undefined;
    floorRequest: number | undefined;
}

const DEFAULT_STATE: ElevatorState = {
    type: 'IDLE',
    direction: undefined,
    currentFloor: 1,
    destinations: [],
    nextStop: undefined,
    floorRequest: undefined,
}

// find the findClosest floor to the current floor without sort
const findClosest = (currentFloor: number, stopRequests: number[]): number => {
    return stopRequests.reduce(function (prev, curr) {
        return (Math.abs(curr - currentFloor) < Math.abs(prev - currentFloor) ? curr : prev);
    });
}

// move 'findClosest' to the first item in the array
// const closestIndex = updatedDestinations.indexOf(findClosest);
// const moveItem = updatedDestinations.splice(closestIndex, 1)
// updatedDestinations.splice(0, 0, moveItem[0])


const compareNumbers = (a: number, b: number): number => {
    return a - b;
}

// add a new stop to the destinations then make the findClosest floor the next stop
// const optimizeStops = (state: ElevatorState, newStop: number): number[] => {
//
//     // add new request to the destination list
//     const updatedDestinations = [...state.destinations, newStop];
//     if (updatedDestinations.length === 1) return updatedDestinations;
//
//     // default to going up since we start in idle state on 1st floor
//     if (state.direction === 'DOWN') {
//         console.log('findClosest down', findClosest(state.currentFloor, updatedDestinations.filter(dest => dest < state.currentFloor)))
//     } else {
//         console.log('closets up', findClosest(state.currentFloor, updatedDestinations.filter(dest => dest > state.currentFloor)))
//     }
//
//     return updatedDestinations.sort(compareNumbers)
// }

const getNextStop = (direction: string | undefined, currentFloor: number, destinations: number[]): number => {

    if (destinations.length === 1) return destinations[0];

    if (direction === undefined) return findClosest(currentFloor, destinations);

    return direction === 'DOWN' ?
        findClosest(currentFloor, destinations.filter(dest => dest < currentFloor))
        :
        findClosest(currentFloor, destinations.filter(dest => dest > currentFloor))
}

// state machine for elevator events
function reducer(state: ElevatorState, action: ElevatorState): ElevatorState {

    switch (action.type) {
        case 'FLOOR_REQUEST': {
            if (!action.floorRequest) return state;

            const updatedDestinations = [...state.destinations, action.floorRequest];

            // find the next closest stop -> use current direction if possible
            const nextStop = getNextStop(state.direction, state.currentFloor, updatedDestinations)

            setTimeout(() => console.log('request waiting...'), 2000); // todo: remove
            return {
                ...state,
                floorRequest: 0,
                direction: state.currentFloor < nextStop ? 'UP' : 'DOWN',
                nextStop: nextStop,
                destinations: updatedDestinations
            };
        }
        case 'MOVE': {
            if (state.destinations?.length == 0) return state;

            console.log('MOVE', state)

            const currentFloor: number = state.nextStop || state.currentFloor; // default back to the floor you are on
            const updatedDestinations = state.destinations.filter(dest => dest !== currentFloor)

            let direction = state.direction;
            if (state.destinations.length > 0
                && state.direction == 'UP'
                && state.destinations.filter(dest => dest > currentFloor).length === 0) {
                direction = 'DOWN'
            }

            if (state.destinations.length > 0
                && state.direction == 'DOWN'
                && state.destinations.filter(dest => dest < currentFloor).length === 0) {
                direction = 'UP'
            }

            console.log('next stop direction', direction)
            const nextStop = updatedDestinations.length === 0 ? undefined : getNextStop(direction, currentFloor, updatedDestinations)
            console.log('next stop', nextStop)

            const foo = {
                ...state,
                direction: state.currentFloor === currentFloor ? 'IDLE' : direction,
                currentFloor: currentFloor,
                nextStop: nextStop,
                destinations: updatedDestinations,
            }

            console.log('END MOVE', foo)
            return foo;
        }

        case 'ARRIVED': {

            if (state.destinations.length === 0) {
                console.log('no destinations waiting for here...')
                return {...state, nextStop: undefined, direction: undefined};
            }

            return state
        }

        default: {
            return state;
        }
    }
}

export function ElevatorReducer() {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
    const interval = useRef<number>();

    // listen for destination changes and dispatch move events
    useEffect(() => {
        clearTimeout(interval.current);
        interval.current = setInterval(() => {
            if (state.destinations.length > 0) {
                dispatch({...state, type: 'MOVE'});
                dispatch({...state, type: 'ARRIVED'});
            }
        }, 2000);

        // setTimeout(() => dispatch({...state, type: 'MOVE'}), 2000);
        // setTimeout(() => dispatch({...state, type: 'ARRIVED'}), 2000);

    }, [state.destinations]);


    // Add the request to the list of destination
    const handleClickButton = async (floor: number) => {
        dispatch({...state, type: "FLOOR_REQUEST", floorRequest: floor});
    }


    const ButtonPanel = (): React.ReactElement => {
        return (
            <Box sx={{border: 1, padding: 4}}>
                {Array(NUM_FLOORS / BUTTONS_PER_ROW).reverse().fill(null).map((_, index) =>
                    <ButtonRow key={index} floor={index + 1}/>
                )}
            </Box>
        )
    }

    const ButtonRow = ({floor}: { floor: number }): React.ReactElement => {

        const start = NUM_FLOORS - (floor * BUTTONS_PER_ROW) + 1
        return (
            <Grid container>
                {Array(BUTTONS_PER_ROW).fill(null).map((_, index) =>
                    <Grid key={index} xs={3} item>
                        <ElevatorButton floor={(start + index)}/>
                    </Grid>
                )}
            </Grid>
        )
    }

    const ElevatorButton = ({floor}: { floor: number }): React.ReactElement => {
        return (
            <Button
                onClick={() => handleClickButton(floor)}
                disabled={state.destinations.includes(floor) || state.currentFloor === floor}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: 1,
                    color: 'white',
                    borderRadius: 6,
                    borderColor: 'white',
                    backgroundColor: state.destinations.includes(floor) ? '#d8dce6' : '',
                    margin: 1,
                }}>
                <Typography color={state.destinations.includes(floor) ? '#eb4034' : 'white'} fontWeight='bolder'
                            fontSize={16}>{floor}</Typography>
            </Button>
        )
    }

    return (
        <>
            <Box sx={{display: 'flex', gap: 8}}>
                <Box sx={{display: 'flex', border: 0.5, borderColor: '#C0C0C0'}}>
                    <Building numFloors={NUM_FLOORS} windowsPerFloor={WINDOWS_PER_FLOOR}
                              currentFloor={state.currentFloor}/>
                </Box>
                <Box>
                    <Typography marginY={2} fontSize={24}>Push my buttons!</Typography>
                    <ButtonPanel/>
                    <Box sx={{display: 'flex', justifyContent: 'center', marginY: 2, gap: 1}}>
                        <ArrowUpCircleIcon color={state.direction === 'UP' ? 'white' : 'grey'} height={42}/>
                        <ArrowDownCircleIcon color={state.direction === 'DOWN' ? 'white' : 'grey'} height={42}/>
                    </Box>
                </Box>
            </Box>
        </>
    )

}