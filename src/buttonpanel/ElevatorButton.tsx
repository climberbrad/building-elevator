import React from "react";
import {Button, Typography} from "@mui/material";

interface ElevatorButtonProps {
    floor: number;
    pressButton: (floor: number) => void;
    isDisabled: boolean;
    isPressed: boolean;
}

export function  ElevatorButton({floor, pressButton, isPressed, isDisabled}: ElevatorButtonProps): React.ReactElement {
    return (
        <Button
            onClick={() => pressButton(floor)}
            disabled={isDisabled}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: 1,
                color: 'white',
                borderRadius: 6,
                borderColor: 'white',
                backgroundColor: isPressed ? '#d8dce6' : '',
                margin: 1,
            }}>
            <Typography color={isPressed ? '#eb4034' : 'white'} fontWeight='bolder' fontSize={16}>{floor}</Typography>
        </Button>
    )
}