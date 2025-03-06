import { useContext, useState } from "react"
import { Form, Link } from "react-router"
import { app, AuthContext } from "./Context"
import { Alert, Box, Button, Grid, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { z } from "zod";


export default function Signup() {

  const [errorMessages, setErrorMessages] = useState(null);
  const [successMessages, setSuccessMessages] = useState(null);
  const [open, setOpen] = useState(false);

  function closeHandler() {
    setOpen(false)
  }

  const auth = useContext(AuthContext);

  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [repasswordError, setRepasswordError] = useState(null);

  // validation
  const emailSchema = z.string().min(5).email();
  const passwordSchema = z.string().min(6);

  const [password, setPassword] = useState(null);

  async function validationHandler(e) {
    if(e.target.name === "email") {
      const result = emailSchema.safeParse(e.target.value)
      setEmailError(result.error?.errors[0].message)
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
      const result = passwordSchema.safeParse(e.target.value)
      setPasswordError(result.error?.errors[0].message)
    } else if (e.target.name === "repassword") {
      if (password !== e.target.value) {
        setRepasswordError("Passwords do not match")
      } else {
        setRepasswordError(null)
      }
    }
  }

  // action
  async function signUp(e) {
    e.preventDefault()
    setErrorMessages(null)
    setOpen(true)

    const authe = getAuth(app)

    const email = emailSchema.safeParse(e.target.email.value);
    const password = passwordSchema.safeParse(e.target.password.value);

    if ( email.success && password.success) {
      if (e.target.password.value === e.target.repassword.value ) {
        createUserWithEmailAndPassword(authe, email.data, password.data)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if (user.uid) console.log('User created with uid:', user.uid)
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorMessages(error.message)
            });
  } else {
    setErrorMessages("Passwords do not match")
    setOpen(true)
  }}}

  if (!auth) {
    return (
      <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}} minHeight='80vh'>
        <Typography variant="h6" paddingBottom={2}>SIGNUP</Typography>
        <form method="POST" onSubmit={(e) => signUp(e)}>
          <Grid container direction='row' spacing={2} maxWidth={400}>
            <Grid container item>
              <TextField name="email" label="Email" fullWidth onChange={validationHandler} error={emailError && true} helperText={emailError}/>
            </Grid>
            <Grid container item>
              <TextField name="password" label="Set a Password" type="password" fullWidth onChange={validationHandler} error={passwordError && true} helperText={passwordError}/>
            </Grid>
            <Grid container item>
              <TextField name="repassword" label="Retype Password" type="password" fullWidth onChange={validationHandler} error={repasswordError && true} helperText={repasswordError}/>
            </Grid>
            <Grid container item>
              <Button fullWidth type="submit" variant="contained">Create Account</Button>
            </Grid>
            <Grid container item>
              <Button fullWidth component={Link} to="/login">Back to Login</Button>
            </Grid>
          </Grid>
        </form>
        { errorMessages &&
        <Snackbar open={open} onClose={closeHandler} autoHideDuration={5000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {errorMessages}
          </Alert>
        </Snackbar> }
      </Box>
      )
  } else {
    return (
      <Stack direction='column' spacing={2}>
        <Alert>Logged in as {auth.email}</Alert>
        <Stack direction='row' spacing={2}>
          {!auth.emailVerified && <Button variant="outlined" color="warning" onClick={async() => {
              const authe = getAuth(app)
              await sendEmailVerification(authe.currentUser).then((res) => {
                setSuccessMessages("Verification email sent");
              }).catch((error) => {
                console.log('error', error) 
              })
              }}>Verify Email</Button>}
          <Form method="post">
            <input type="hidden" name="signout" defaultValue="signout"/>
            <Button variant="outlined" type="submit">Logout</Button>
          </Form>
        </Stack>
        { successMessages && <Alert>{successMessages}</Alert>}
      </Stack>
      
    )
  }
}