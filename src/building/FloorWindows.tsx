import React from "react";
import {Box} from "@mui/material";

interface FloorWindowsProps {
    floor: number,
    windowsPerFloor: number,
    currentFloor: number
}

export function FloorWindows({floor, windowsPerFloor, currentFloor}: FloorWindowsProps): React.ReactElement {

    const getWindowColor = (floor: number, windowIndex: number): string => {
        return currentFloor === floor && windowIndex === 3 ? 'black' : 'white';
    }

    const windows: React.ReactElement[] = [];
    for (let i = 0; i < windowsPerFloor; i++) {
        windows.push(
            <Box key={i} sx={{margin: 1}}>
                <Box sx={{
                    border: 1,
                    backgroundColor: getWindowColor(floor, i),
                    height: 24,
                    width: 14
                }}/>
            </Box>
        )
    }

    return (<Box sx={{display: 'flex'}}>{windows}</Box>)
}