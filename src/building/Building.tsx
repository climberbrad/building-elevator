import React from "react";
import {Box} from "@mui/material";
import {FloorWindows} from "./FloorWindows.tsx";

interface BuildingProps {
    numFloors: number;
    windowsPerFloor: number;
    currentFloor: number;
    state: string;
}

export function Building({numFloors, windowsPerFloor, currentFloor, state}: BuildingProps): React.ReactElement {

    const floor: React.ReactElement[] = [];
    for (let i = 0; i < numFloors; i++) {
        floor.push(
            <FloorWindows
                key={i}
                floor={i + 1}
                windowsPerFloor={windowsPerFloor}
                currentFloor={currentFloor}
                state={state}
            />
        )
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column-reverse'}}>
            {floor}
        </Box>
    )
}