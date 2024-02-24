import './App.css'
import {Box, Button, Grid, Typography} from "@mui/material";
import {useEffect, useReducer} from "react";

const NUM_FLOORS = 12;
const WINDOWS_PER_FLOOR = 7;

const BUTTONS_PER_ROW = 4;

interface ElevatorState {
    type: string;
    status: string;
    currentFloor: number;
    destinations: number[];
    request: number | undefined;
}

const DEFAULT_STATE: ElevatorState = {
    type: 'IDLE',
    status: 'IDLE',
    currentFloor: 1,
    destinations: [],
    request: undefined,
}

// add a new stop to the destinations then make the closest floor the next stop
const optimizeStops = (state: ElevatorState, newStop: number): number[] => {

    // add new request to the destination list
    const updatedDestinations = [...state.destinations, newStop];

    // find the closest floor to the current floor
    if (updatedDestinations.length > 1) {
        const closest = updatedDestinations.reduce(function (prev, curr) {
            return (Math.abs(curr - state.currentFloor) < Math.abs(prev - state.currentFloor) ? curr : prev);
        });

        // move 'closest' to the first item in the array
        const closestIndex = updatedDestinations.indexOf(closest);
        const moveItem = updatedDestinations.splice(closestIndex, 1)
        updatedDestinations.splice(0, 0, moveItem[0])
    }

    return updatedDestinations;
}

function reducer(state: ElevatorState, action: ElevatorState): ElevatorState {

    switch (action.type) {
        case 'FLOOR_REQUEST': {
            if (!action.request) return state;

            // reshuffle the destination array so the closest stop is the first item
            const updatedDestinations: number[] = optimizeStops(state, action.request)

            return {...state, status: 'MOVING', request: 0, destinations: updatedDestinations};
        }
        case 'MOVE': {
            const updatedDestinations: number[] = [...state.destinations]
            const currentFloor = updatedDestinations.splice(0, 1)

            if (currentFloor.length === 0) return state;

            return {...state, status: updatedDestinations.length === 0 ? 'IDLE': 'MOVING', currentFloor: currentFloor[0], destinations: [...updatedDestinations]}
        }
        default: {
            return state;
        }
    }
}

export function ElevatorReducer() {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

    // listen for destination changes and dispatch move events
    useEffect(() => {
        if (state.destinations.length === 0) return

        const moveFloors = setTimeout(() => {
            console.log('MOVING...', state.destinations)
            dispatch({...state, type: 'MOVE'})
        }, 1000)
        return () => clearTimeout(moveFloors)

    }, [state.destinations]);


    // Add the request to the list of destination
    const handleClickButton = async (floor: number) => {
        dispatch({...state, type: "FLOOR_REQUEST", request: floor});
    }

    const Building = ({numFloors}: { numFloors: number }): React.ReactElement => {
        return (<Box sx={{display: 'flex', flexDirection: 'column-reverse'}}>
            {Array(numFloors).fill(null).map((_, index) =>
                <FloorWindows key={index} floor={index + 1}/>
            )}
        </Box>)
    }

    const getWindowColor = (floor: number, windowIndex: number): string => {
        if (state.type === 'ARRIVED'
            && state.currentFloor === floor
            && windowIndex === 3) return 'green';

        return state.currentFloor === floor && windowIndex === 3 ? 'black' : 'white';
    }

    const FloorWindows = ({floor}: { floor: number }): React.ReactElement => {
        return (<Box sx={{display: 'flex'}}>
            {Array(WINDOWS_PER_FLOOR).fill(null).map((_, index) =>
                <Box key={index} sx={{margin: 1}}>
                    <Box sx={{
                        border: 1,
                        backgroundColor: getWindowColor(floor, index),
                        height: 24,
                        width: 14
                    }}/>
                </Box>
            )}
        </Box>)
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
                <Box sx={{display: 'flex'}}>
                    <Building numFloors={NUM_FLOORS}/>
                </Box>
                <Box>
                    <Box sx={{marginY: 2}}><Typography fontSize={24}>Press Me!</Typography></Box>
                    <ButtonPanel/>

                    <Typography sx={{marginY: 2}}>
                        Elevator status:
                        <Typography component='span' sx={{
                            color: 'black',
                            backgroundColor: '#d8dce6',
                            fontSize: 12,
                            fontWeight: 'bold',
                            paddingY: 1,
                            paddingX: 2,
                            marginX: 1,
                            borderRadius: 3
                        }}>
                            {state.status}
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </>
    )

}