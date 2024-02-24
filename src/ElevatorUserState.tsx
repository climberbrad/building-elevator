import './App.css'
import {Box, Button, Grid, Typography} from "@mui/material";
import {useState} from "react";

function ElevatorUserState() {
    const [elevatorFloor, setElevatorFloor] = useState<number>(1);
    const [floorRequest, setFloorRequest] = useState<number[]>([]);

    console.log('request', floorRequest)

    const numWindowsPerFloor: number = 7;
    const numFloors: number = 12;
    const buttonsPerRow = 4;

    // useEffect(() => {
    //     const delayDebounceFn = setTimeout(() => {
    //         // wait for user to stop clicking
    //     }, 3000)
    //
    //     return () => clearTimeout(delayDebounceFn)
    // }, [floorRequest]);

    const sleep = async (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

    const handleClickElevatorButton = async (floor: number) => {
        if (floor === elevatorFloor) return;

        const floorDelta = Math.abs(floor - (elevatorFloor || 1));
        setFloorRequest(old => [...old, floor]);

        // move the elevator
        await sleep(500 * floorDelta);
        setElevatorFloor(floor);
        await sleep(3000); // let people out

        setFloorRequest(old => [...old].filter(item => item !== floor));
    }

    const Building = (): React.ReactElement => {
        return (<Box sx={{display: 'flex', flexDirection: 'column-reverse'}}>
            {Array(numFloors).fill(null).map((_, index) => <FloorWindows key={index} floor={index + 1}/>)}
        </Box>)
    }

    const FloorWindows = ({floor}: { floor: number }): React.ReactElement => {
        return (<Box sx={{display: 'flex'}}>
            {Array(numWindowsPerFloor).fill(null).map((_, index) =>
                <Box key={index} sx={{margin: 1}}><Box
                    sx={{
                        border: 1,
                        backgroundColor: floor === elevatorFloor && index === 3 ? floorRequest.includes(floor) && floorRequest.length > 0 ? 'green' : 'black' : 'white',
                        height: 24,
                        width: 14
                    }}/></Box>
            )}
        </Box>)
    }

    const ButtonPanel = (): React.ReactElement => {
        return (
            <Box sx={{border: 1, padding: 4}}>
                {Array(numFloors / buttonsPerRow).reverse().fill(null).map((_, index) =>
                    <ButtonRow key={index} floor={index + 1}/>
                )}
            </Box>
        )
    }

    const ButtonRow = ({floor}: { floor: number }): React.ReactElement => {

        const start = numFloors - (floor * buttonsPerRow) + 1
        return (
            <Grid container>
                {
                    Array(buttonsPerRow).fill(null).map((_, index) =>
                        <Grid key={index} xs={3} item><ElevatorButton floor={(start + index)}/></Grid>
                    )
                }
            </Grid>
        )
    }

    const ElevatorButton = ({floor}: { floor: number }): React.ReactElement => {
        return (
            <Button
                onClick={() => handleClickElevatorButton(floor)}
                disabled={floorRequest.includes(floor)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: 1,
                    borderRadius: 6,
                    borderColor: 'white',
                    backgroundColor: floorRequest.includes(floor) ? 'darkgrey' : '',
                    margin: 1,
                }}>
                <Typography fontWeight='bolder' color={floorRequest.includes(floor) ? 'red' : ''}
                            fontSize={16}>{floor}</Typography>
            </Button>
        )
    }


    return (
        <>
            <Box sx={{display: 'flex', gap: 8}}>
                <Box sx={{display: 'flex'}}>
                    <Building/>
                </Box>
                <Box>
                    <Box sx={{marginY: 2}}><Typography fontSize={24}>Press Me!</Typography></Box>
                    <ButtonPanel/>
                </Box>
            </Box>
        </>
    )
}

export default ElevatorUserState
