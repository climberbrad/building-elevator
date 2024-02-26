import './App.css'
import {Box, Button, Grid, Typography} from "@mui/material";
import {useEffect, useReducer, useRef} from "react";
import {ArrowUpCircleIcon, ArrowDownCircleIcon} from "@heroicons/react/20/solid";
import {Building} from "./building/Building.tsx";
import {findClosest} from "./util/ElevatorUtil.ts";

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