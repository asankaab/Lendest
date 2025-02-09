import { Check } from "@mui/icons-material";
import { Alert, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AddUser() {
    
    const navigation = useNavigation();

    const actiondata = useActionData();

    const [alert, setAlert] = useState(false);

    useEffect(()=> {
        if(actiondata)  {
            setAlert(true)
        }

        setTimeout(() => {
            setAlert(null)
        }, 3000)

    }, [actiondata])

    // ****** Time ***********

    const [timeNow, setTimeNow] = useState(dayjs());

    setInterval(() => {
            setTimeNow(dayjs())
        }, 60000);

    // ***** 

    return (
        <div className="addUser">
            <Grid container direction='column' spacing={2} maxWidth={400} component={Form} method="post" >
                <Grid item>
                    <TextField label='Name' name="name" required fullWidth autoComplete="off" autoCapitalize="on"/>
                </Grid>
                <Grid item>
                    <Stack direction='row' spacing={2}>
                        <TextField label='Amount' type="tel" name="amount" autoComplete="off" required/>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker label="Date" name="date" value={timeNow}/>
                        </LocalizationProvider>
                        </Stack>            
                </Grid>
                <Grid item>
                    <Button variant="outlined" type="submit" disabled={navigation.state === 'submitting' ? true : false}>Add User</Button>
                    <Typography variant="caption">{navigation.state === 'submitting' ? ' Submitting...' : null}</Typography>
                </Grid>
                <Grid item>
                {actiondata? 
                <Alert icon={<Check fontSize="inherit" />} severity="success">User Added with ID: <Link to={'/' + actiondata}>{actiondata}</Link></Alert> : null }
                </Grid>
            </Grid>
        </div>
    )
}