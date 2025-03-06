import { useContext } from "react"
import { AuthContext } from "./Context";
import { Link } from "react-router";
import { Avatar, Button, Divider, Grid, ListItem, ListItemIcon, Stack, Typography } from "@mui/material";
import { AccountCircle, MailRounded } from "@mui/icons-material";

export default function Profile() {
    const auth = useContext(AuthContext);

    if (auth) {
        return (
            <Grid container spacing={2}>
                <Grid item>
                    <Stack>
                        <ListItem>
                            <ListItemIcon><AccountCircle /></ListItemIcon>
                            <Typography variant="body">{auth.displayName}</Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><MailRounded /></ListItemIcon>
                            <Typography variant="body">{auth.email}</Typography>
                        </ListItem>
                    </Stack>
                    <Divider />
                    <Stack direction='row' spacing={1} sx={{marginTop: '1em'}}>
                        <Button variant="outlined" to='/profile/edit' LinkComponent={Link}>Edit Profile</Button>
                        <Button variant="outlined" to='/login' LinkComponent={Link}>Logout</Button>
                    </Stack>
                </Grid>
                <Grid item>
                    <Avatar alt="photo" src={auth.photoURL} />
                </Grid>
            </Grid>
        )
    } else {
        return null
    }
}