import './App.css'
import {Box, Button, Grid, Typography} from "@mui/material";
import {useEffect, useReducer, useRef} from "react";
import {ArrowUpCircleIcon, ArrowDownCircleIcon} from "@heroicons/react/20/solid";
import {Building} from "./building/Building.tsx";
import {findClosest} from "./util/ElevatorUtil.ts";

const NUM_FLOORS = 12;
const WINDOWS_PER_FLOOR = 7;
const BUTTONS_PER_ROW = 2;

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


// state machine for elevator events
function reducer(state: ElevatorState, action: ElevatorState): ElevatorState {

    switch (action.type) {
        case 'FLOOR_REQUEST': {
            if (!action.floorRequest) return state;

            const updatedDestinations = [...state.destinations, action.floorRequest];
            const nextStop = findClosest(state.currentFloor, updatedDestinations, state.direction)

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

            // set current floor to next stop  and remove from destination list
            const currentFloor: number = state.nextStop || state.currentFloor; // default back to the floor you are on
            const updatedDestinations = state.destinations.filter(dest => dest !== currentFloor)

            const nextStop = findClosest(currentFloor, updatedDestinations, state.direction)

            return {
                ...state,
                direction: state.currentFloor < nextStop ? 'UP' : 'DOWN',
                currentFloor: currentFloor,
                nextStop: nextStop,
                destinations: updatedDestinations,
            }
        }
        case 'ARRIVED': {

            // go into waiting if there are no more stops
            if (state.destinations.length === 0) {
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
    const interval = useRef<NodeJS.Timeout>();

    // listen for changes to state.destinations, then dispatch move events
    useEffect(() => {
        clearTimeout(interval.current);
        interval.current = setInterval(() => {
            if (state.destinations.length > 0) {
                dispatch({...state, type: 'MOVE'});
                dispatch({...state, type: 'ARRIVED'});
            }
        }, 2000);

    }, [state.destinations]);


    // Add a new floor request
    const handleClickButton = async (floor: number) => {
        dispatch({...state, type: "FLOOR_REQUEST", floorRequest: floor});
    }


    const ButtonPanel = (): React.ReactElement => {
        return (
            <Box sx={{border:1, padding: 1}}>
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
                    <Grid item xs={6}>
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
            <Grid item xs={4}>
                <Building
                    numFloors={NUM_FLOORS}
                    windowsPerFloor={WINDOWS_PER_FLOOR}
                    currentFloor={state.currentFloor}
                />
            </Grid>
            <Grid item xs={8}>
                <Box sx={{display: 'flex', flexDirection: 'column', width: '12rem'}}>
                    <Box>

                        <Typography marginY={1} fontSize={24}>Press Me</Typography>
                        <ButtonPanel/>
                        <Box sx={{display: 'flex', justifyContent: 'center', marginY: 1, gap: 1}}>
                            <ArrowUpCircleIcon color={state.direction === 'UP' ? 'white' : 'grey'} height={42}/>
                            <ArrowDownCircleIcon color={state.direction === 'DOWN' ? 'white' : 'grey'} height={42}/>
                        </Box>
                    </Box>

                </Box>
            </Grid>
        </Grid>
    )

}