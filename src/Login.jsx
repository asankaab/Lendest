import { useContext, useState } from "react"
import { Form, Link, redirect, useLocation, useNavigate, useNavigation, useRoutes } from "react-router"
import { app, AuthContext } from "./Context"
import { Alert, Box, Button, Divider, Grid, Snackbar, Stack, TextField, Typography } from "@mui/material";
import GoogleSignButton from "./GoogleSignButton";
import FacebookSignButton from "./GithubSignButton";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { z } from "zod";


export default function Login() {

  const [errorMessages, setErrorMessages] = useState(null);
  const [open, setOpen] = useState(false);

  function closeHandler() {
    setOpen(false)
  }

  const auth = useContext(AuthContext);

  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  // validation
  const emailSchema = z.string().min(5).email();
  const passwordSchema = z.string().min(6);
  
  async function validationHandler(e) {
    if(e.target.name === "email") {
      const result = emailSchema.safeParse(e.target.value)
      setEmailError(result.error?.errors[0].message)
    } else if (e.target.name === "password") {
      const result = passwordSchema.safeParse(e.target.value)
      setPasswordError(result.error?.errors[0].message)
    }
  }

  const navigate = useNavigate();

  // action
  async function signIn(e) {
    e.preventDefault()
    setErrorMessages(null)
    setOpen(true)

    const authe = getAuth(app)

    const email = emailSchema.safeParse(e.target.email.value);
    const password = passwordSchema.safeParse(e.target.password.value);

    if ( email.success && password.success ) {
      signInWithEmailAndPassword(authe, email.data, password.data)
          .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          if (user.uid) navigate('/')
          })
          .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessages(error.message)
          });
        }
  }

  if (!auth) {
    return (
      <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}} minHeight='80vh'>
        <Typography variant="h6" paddingBottom={2}>SIGNIN</Typography>
        <form method="POST" onSubmit={(e) => signIn(e)}>
          <Grid container direction='row' spacing={2} maxWidth={400}>
            <Grid container item>
              <TextField name="email" label="Email" fullWidth onChange={validationHandler} error={emailError && true} helperText={emailError}/>
            </Grid>
            <Grid container item>
              <TextField name="password" label="Password" type="password" fullWidth onChange={validationHandler} error={passwordError && true} helperText={passwordError}/>
            </Grid>
            <Grid container item>
              <Button fullWidth type="submit" variant="contained">Login</Button>
            </Grid>
            <Grid container item>
              <Button fullWidth component={Link} to="/signup">Signup with Email</Button>
            </Grid>
            <Grid item sx={{ width: '100%'}}>
              <Divider><Typography variant="caption">Social Login</Typography></Divider>
              <Stack direction='row' spacing={2} paddingTop={2}>
                <GoogleSignButton/><FacebookSignButton/>
              </Stack>
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
        <Form method="post">
          <input type="hidden" name="signout" defaultValue="signout"/>
          <Button variant="outlined" type="submit">Logout</Button>
        </Form>
      </Stack>
      
    )
  }
}