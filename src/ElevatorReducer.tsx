import './App.css'
import {Box, Button, Grid, Typography} from "@mui/material";
import {useEffect, useReducer, useRef} from "react";
import {ArrowUpCircleIcon, ArrowDownCircleIcon} from "@heroicons/react/20/solid";
import {Building} from "./building/Building.tsx";
import {closestTo} from "./util/SearchUtil.ts";

const NUM_FLOORS = 12;
const WINDOWS_PER_FLOOR = 7;
const BUTTONS_PER_ROW = 2;

interface ElevatorState {
    type: string;
    currentFloor: number;
    destinations: number[];
    floorRequest: number | undefined;
}

const DEFAULT_STATE: ElevatorState = {
    type: 'IDLE',
    currentFloor: 1,
    destinations: [],
    floorRequest: undefined,
}

const getNextStop = (currentFloor: number, destinations: number[]): number => {
    return closestTo(currentFloor, destinations);
}

const getDirection = (currentFloor: number, destinations: number[]): string | undefined => {
    if (destinations.length === 0) return undefined;

    const nextStop = getNextStop(currentFloor, destinations);
    return currentFloor < nextStop ? 'UP' : 'DOWN'
}

// state machine for elevator events
function reducer(state: ElevatorState, action: ElevatorState): ElevatorState {

    switch (action.type) {
        case 'FLOOR_REQUEST': {
            if (!action.floorRequest) return state;

            const updatedDestinations = [...state.destinations, action.floorRequest];

            const foo = {
                ...state,
                type: 'FLOOR_REQUEST',
                floorRequest: undefined,
                destinations: updatedDestinations,
            };

            console.log('FLOOR_REQUEST', foo)
            return foo
        }

        case 'ARRIVED': {
            if (state.currentFloor !== getNextStop(state.currentFloor, state.destinations)) return {...state}
            if (state.destinations?.length == 0) return {...state};

            const foo = {
                ...state,
                type: 'ARRIVED',
                // nextStop: undefined,
                destinations: state.destinations.filter(floor => floor !== state.currentFloor),
            }

            console.log('ARRIVED', foo)
            return foo;
        }
        case 'MOVE': {
            if (state.destinations.length === 0) return {...state}

            const destinations = state.destinations;
            const nextStop = closestTo(state.currentFloor, destinations)

            console.log('move closest to', nextStop, 'curernt Floor', state.currentFloor, destinations)

            // go into waiting if there are no more stops
            if (state.destinations.length === 0) return {...state};

            const foo = {
                ...state,
                type: 'MOVE',
                // nextStop: nextStop,
                currentFloor: nextStop > state.currentFloor ? state.currentFloor + 1 : state.currentFloor - 1,
            }

            console.log('MOVE', foo)
            return foo

        }
        default: {
            return state;
        }
    }
}

export function ElevatorReducer() {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
    const interval = useRef<NodeJS.Timeout>();

    // when state.destinations change, dispatch move events
    useEffect(() => {

        console.log('useEffect', state)

        if (state.destinations.length > 0) {
            clearTimeout(interval.current)
            interval.current = setInterval(() => {
                dispatch({...state, type: 'MOVE'});
                dispatch({...state, type: 'ARRIVED'});

            }, 1000);
        }

    }, [state.destinations]);


    // Add a new floor request
    const handleClickButton = async (floor: number) => {
        dispatch({...state, type: "FLOOR_REQUEST", floorRequest: floor});
    }

    const ButtonPanel = (): React.ReactElement => {
        return (
            <Box sx={{border: 1, padding: 1}}>
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
                    <Grid item xs={6} key={index}>
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
                size='medium'
                sx={{
                    border: 1,
                    color: 'white',
                    borderRadius: 6,
                    borderColor: 'white',
                    backgroundColor: state.destinations.includes(floor) ? '#d8dce6' : '',
                    marginY: '0.5vw',
                }}>
                <Typography color={state.destinations.includes(floor) ? '#eb4034' : 'white'} fontWeight='bolder'
                            fontSize={16}>{floor}</Typography>
            </Button>
        )
    }

    return (
        <Grid container>
            <Grid item xs={4} md={6}>
                <Building
                    numFloors={NUM_FLOORS}
                    windowsPerFloor={WINDOWS_PER_FLOOR}
                    currentFloor={state.currentFloor}
                    state={state.type}
                />
            </Grid>
            <Grid item xs={8} md={6}>
                <Box sx={{display: 'flex', flexDirection: 'column', width: '12rem'}}>
                    <Box>

                        <Typography marginY={1} fontSize={24}>Press Me</Typography>
                        <ButtonPanel/>
                        <Box sx={{display: 'flex', justifyContent: 'center', marginY: 1, gap: 1}}>
                            <ArrowUpCircleIcon
                                color={getDirection(state.currentFloor, state.destinations) === 'UP' ? 'white' : 'grey'}
                                height={42}/>
                            <ArrowDownCircleIcon
                                color={getDirection(state.currentFloor, state.destinations) === 'DOWN' ? 'white' : 'grey'}
                                height={42}/>
                        </Box>
                    </Box>

                </Box>
            </Grid>
        </Grid>
    )

}