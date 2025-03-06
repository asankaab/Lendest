import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./Context";
import { Alert, Box, Button, Snackbar, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function GoogleSignButton() {

  const [errorMessages, setErrorMessages] = useState(null);
  const [open, setOpen] = useState(false);

  function closeHandler() {
    setOpen(false)
  }

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

  async function googleSignIn(e) {
    e.preventDefault();
    setOpen(false)
    setErrorMessages(null);
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you the user's profile information.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // You can use this token for backend authentication
      const user = result.user;
      if (user.uid) navigate('/')
      // console.log("Signed in with Google:", user);
      // Redirect to your app's home page or other relevant location.
    } catch (error) {
      setErrorMessages(error.message);
      setOpen(true);
      // Handle the error appropriately (e.g., display an error message to the user).
    }
  }

    return (
        <Button fullWidth variant="outlined" onClick={googleSignIn}>
            <Stack spacing={2} direction="row" alignItems="center">
                <img src="/Google_G_logo.svg" alt="Facebook Logo" width="20" height="20"/>
                <span>Google</span>
            </Stack>
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
        </Button>      
    )
}