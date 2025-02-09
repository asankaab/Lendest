import { useContext, useState } from "react"
import { Form } from "react-router-dom"
import { AuthContext } from "./Context"
import { Alert, Box, Button, Grid, Stack, TextField } from "@mui/material";

export default function Login() {
  const [emailError, setEmailError] = useState(false);
  const [emailHelper, setEmailHelper] = useState(' ')
  const [passError, setPassError] = useState(false)
  const [passHelper, setPassHelper] = useState(' ')

  const auth = useContext(AuthContext);

  function validationHandler(e) {
    
    if(e.target.name === 'email') {
      let emailVal = e.target.value;
      if (!emailVal.includes('@') || !emailVal.includes('.')) {
        setEmailError(true)
        setEmailHelper('Incorrect email format')
      } else {
        setEmailError(false)
        setEmailHelper(' ')
      }
    }

    if(e.target.name === 'password') {
      let passVal = e.target.value;
      // console.log(passVal.length === 0)
      if (passVal === '') {
        setPassError(true)
        setPassHelper('Please enter password')
      } else {
        setPassError(false)
        setPassHelper(' ')
      }
    }
  }

  if (!auth) {
    return (
      <Box sx={{width: '100%'}}>
        <Form method="post">
          <Grid container direction='column' spacing={2} maxWidth={400}>
            <Grid item>
              <TextField name="email" label="Email" fullWidth onChange={validationHandler} error={emailError} helperText={emailHelper}/>
            </Grid>
            <Grid item>
              <TextField name="password" label="Password" type="password" fullWidth onChange={validationHandler} error={passError} helperText={passHelper}/>
            </Grid>
            <Grid item>
              <Button onClick={validationHandler} variant="outlined" type={emailError || passError ? 'button' : 'submit'}>Login</Button></Grid>
            </Grid>
        </Form>
      </Box>
      )
  } else {
    return (
      <Stack direction='column' spacing={2}>
        <Alert>Logged in as {auth.email}</Alert>
        <Form method="post">
          <input type="hidden" name="signout" defaultValue="signout"/>
          <Button variant="outlined" type="submit">Logout</Button>
        </Form>
      </Stack>
      
    )
  }
}