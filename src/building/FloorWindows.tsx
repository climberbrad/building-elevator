import React from "react";
import {Box, Grid} from "@mui/material";

interface FloorWindowsProps {
    floor: number,
    windowsPerFloor: number,
    currentFloor: number
    state: string,
}

export function FloorWindows({floor, windowsPerFloor, currentFloor, state}: FloorWindowsProps): React.ReactElement {

    const getWindowColor = (floor: number, windowIndex: number): string => {

        // elevator
        if (windowIndex === 3 && currentFloor === floor) {
            if (state === 'IDLE' || state === 'ARRIVED') return 'black';

            return 'grey'
        }

        return 'white';
    }

    const windows: React.ReactElement[] = [];
    for (let i = 0; i < windowsPerFloor; i++) {
        windows.push(
            <Grid item
                  key={i}
                  sx={{
                      margin: '0.5vw',
                      border: 1,
                      backgroundColor: getWindowColor(floor, i),
                      height: 24,
                      width: 14
                  }}/>
        )
    }

    return (<Grid container minWidth='24em'><Box
        sx={{display: 'flex', border: 1, borderColor: '#4e5052'}}>{windows}</Box></Grid>)
}