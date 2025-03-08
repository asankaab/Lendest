import './App.css'
import { useState, useEffect } from 'react'
import { Outlet, useNavigation, NavLink, useParams } from 'react-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, AuthContext } from "./Context"
import { AccountCircleRounded, HomeRounded, LoginRounded, PersonAddRounded, CloseOutlined, MenuOutlined } from '@mui/icons-material';
import {Container, LinearProgress, Stack, Box, Button, ButtonGroup, Card, Drawer, List, ListItem, ListItemButton, ListItemText, Skeleton, Typography, useMediaQuery, MenuItem, Menu } from '@mui/material';
import { collection, doc, getDocs, getFirestore, onSnapshot, query } from "firebase/firestore";


function App() {

  const authentication = getAuth(app);
  const [auth, setAuth] = useState(null);

  useEffect(()=> {
    onAuthStateChanged(authentication, (user) => {
    if (user) {
      setAuth(user)
    } else {
      setAuth(null)
    }
    });
  }, [authentication])

  // ******** 

  const path = useParams();

  // menu button toggle
  
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const matches = useMediaQuery('(min-width:600px)');

  // fetch names

  const [names, setNames] = useState([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}]);

  useEffect(()=> {

    async function getNames() {

      const db = getFirestore(app);

      const unsubscribe = onSnapshot(collection(db, auth.uid), (doc) => {
        setNames(doc.docs.map((doc)=> {  return {id: doc.id, name: doc.get("name")}   }));
      });

      if (!auth) unsubscribe();
      
    }

    if (auth) getNames();
      
  },[auth])

  // ** NameList component *****

  function NameList() {
    
    // const { names } = useLoaderData();
    
      return (
        <>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h6' paddingInline={2} paddingBlock={1}>People</Typography>
            {matches ? null : <Button onClick={toggleDrawer(false)}><CloseOutlined /></Button>}
          </Stack>
          {auth ? <List sx={{maxHeight: { xs: '75svh', md: '80vh' }, minHeight: '80vh', overflow: 'auto', minWidth: 100, width: {xs: '75vw', sm: 'auto'}}} 
            disablePadding={matches? true : false}>
              {names.length < 1 && <Typography variant='body2' paddingInline={2} paddingBlock={1}>No data</Typography>}
              {names?.map((element) => {
                  return (
                    <ListItem key={element.id} disablePadding divider onClick={toggleDrawer(false)}>
                      <ListItemButton component={NavLink} to={'../' + element.id} selected={path.id == element.id ? true : false}>
                        <ListItemText primary={element.name || <Skeleton/>} />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
          </List> : 
          <List>
            <ListItem disablePadding divider>
              <ListItemButton>
                <ListItemText primary={<Skeleton animation={false}/>} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding divider>
              <ListItemButton>
                <ListItemText primary={<Skeleton animation={false} sx={{ opacity: 0.5}}/>} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding divider>
              <ListItemButton>
                <ListItemText primary={<Skeleton animation={false} sx={{ opacity: 0.25}}/>} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding >
              <ListItemButton>
                <ListItemText primary={<Skeleton animation={false} sx={{ opacity: 0.15}}/>} />
              </ListItemButton>
            </ListItem>
          </List>}
        </>
        
      )
  }

  // ********

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  

  return (
    <AuthContext.Provider value={auth}>
          <Container maxWidth='lg' sx={{paddingBlock: {sm: '0.5em', lg: '1em'}}}>
            <Stack maxHeight='100vh'
              direction={{ xs: 'column', sm: 'row' }}
                  gap={{ xs: 2, sm: 2, md: 2 }}
                >
                {matches ? null :
                  <Box role="presentation">
                      <Drawer open={open} >
                        <Stack padding={1}>
                            <NameList sx={{width: '70vw'}} />
                          </Stack>
                      </Drawer>
                  </Box>}

                    <Stack spacing={2} minWidth={220}>
                      <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleClose} MenuListProps={{
                          'aria-labelledby': 'basic-button', }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'right', }} elevation={4}
                      >
                        <MenuItem onClick={handleClose} component={NavLink} to='../profile'>Profile</MenuItem>
                        <MenuItem onClick={handleClose} component={NavLink} to='../login'>Logout</MenuItem>
                      </Menu>
                      {auth? 
                        <ButtonGroup variant='contained' disableElevation component='nav'>
                          <Button size='large' component={NavLink} to='../' startIcon={<HomeRounded/>} sx={{flexGrow: 1}}>Dashboard</Button>
                          <Button component={NavLink} to='../adduser'><PersonAddRounded/></Button>
                          <Button id="basic-button"
                            aria-controls={openMenu ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={openMenu ? 'true' : undefined} onClick={handleMenuClick}><AccountCircleRounded/>
                          </Button>
                            
                          {!matches ? <Button onClick={toggleDrawer(true)} ><MenuOutlined/></Button> : null}
                        </ButtonGroup>
                        : 
                        <ButtonGroup variant='contained' disableElevation component='nav'>
                          <Button size='large' component={NavLink} to='../' startIcon={<HomeRounded/>} sx={{flexGrow: 1}}>Dashboard</Button>
                          <Button component={NavLink} to='../login' endIcon={<LoginRounded/>} sx={{flexGrow: 1}}>Login</Button>
                        </ButtonGroup>
                        }
                      
                      {matches ? 
                      <Card variant='outlined' sx={{flexGrow: 1}}>        
                        <NameList disablePadding={true}/>
                      </Card> : null}
                    </Stack>
                <Card variant='outlined' sx={{width: '100%', padding: '1em', minHeight: '80vh', overflow: 'auto'}}>
                  <Outlet />
                </Card>
            </Stack>
          </Container>
    </AuthContext.Provider>
  )
}

export default App
