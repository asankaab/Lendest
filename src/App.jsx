import './App.css'
import { useState, useEffect } from 'react'
import { Outlet, useNavigation, NavLink, useLoaderData, useParams, Await } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { AuthContext } from "./Context"
import { AccountCircleRounded, HomeRounded, LoginRounded, PersonAddRounded, CloseOutlined, MenuOutlined } from '@mui/icons-material';
import {Container, LinearProgress, Stack, Box, Button, ButtonGroup, Card, Drawer, List, ListItem, ListItemButton, ListItemText, Skeleton, Typography, useMediaQuery, MenuItem, Menu } from '@mui/material';
import { onSnapshot ,collection, doc, getAggregateFromServer, getDoc, getDocs, getFirestore, initializeFirestore, memoryLocalCache, persistentLocalCache, query, sum } from "firebase/firestore";
import { firebaseConfig } from './config/firebaseConfig';

const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
console.log(app)

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(()=> {
    onAuthStateChanged(authentication, (user) => {
    if (user) {
      setAuth(user)
    } else {
      setAuth(user)
    }
    });
  }, [])

  // ******** 


  const path = useParams();

  // menu button toggle
  
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const matches = useMediaQuery('(min-width:600px)');

  const navigation = useNavigation();

  // fetch names

  const [names, setNames] = useState([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}]);
  const [size, setSize] = useState();

  useEffect(()=> {
    
  const db = getFirestore(app);
  const q = query(collection(db, "people"));

    onSnapshot(q, (querySnapshot) => {
      setSize(querySnapshot.size)
    });

    async function getNames() {

      const querySnapshot = await getDocs(q);

      const docs = await querySnapshot.docs;

      const names = docs.map((doc)=> {  return {id: doc.id, name: doc.get("name")}   })

      setNames(names)
    }

    getNames();
      
  },[size])

  // ** NameList component *****

  function NameList() {
    
    // const { names } = useLoaderData();
    
      return (
        <>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h6' paddingInline={2} paddingBlock={1}>People</Typography>
            {matches ? null : <Button onClick={toggleDrawer(false)}><CloseOutlined /></Button>}
          </Stack>
          <List sx={{maxHeight: '78vh', minHeight: 400, overflow: 'auto', minWidth: 100, width: {xs: '75vw', sm: 'auto'}}} 
            disablePadding={matches? true : false}>
              {names?.map((element) => {
                  return (
                    <ListItem key={element.id} disablePadding divider onClick={toggleDrawer(false)}>
                      <ListItemButton component={NavLink} to={element.id} selected={path.id == element.id ? true : false}>
                        <ListItemText primary={element.name || <Skeleton/>} />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
          </List>
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
        {navigation.state === 'loading' ? <LinearProgress/> : <LinearProgress variant='determinate' value={0} color='none'/> }
          <Container maxWidth='lg' sx={{paddingBlock: {sm: '0.5em', lg: '1em'}}}>
            <Stack
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
                        <MenuItem onClick={handleClose} component={NavLink} to='/profile'>Profile</MenuItem>
                        <MenuItem onClick={handleClose} component={NavLink} to='/login'>Logout</MenuItem>
                      </Menu>
                      {auth? 
                        <ButtonGroup variant='contained' disableElevation component='nav'>
                          <Button size='large' component={NavLink} to='/' startIcon={<HomeRounded/>} sx={{flexGrow: 1}}>Dashboard</Button>
                          <Button component={NavLink} to='/adduser'><PersonAddRounded/></Button>
                          <Button id="basic-button"
                            aria-controls={openMenu ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={openMenu ? 'true' : undefined} onClick={handleMenuClick}><AccountCircleRounded/>
                          </Button>
                            
                          {!matches ? <Button  onClick={toggleDrawer(true)} ><MenuOutlined/></Button> : null}
                        </ButtonGroup>
                        : 
                        <ButtonGroup variant='contained' disableElevation component='nav'>
                          <Button size='large' component={NavLink} to='/' startIcon={<HomeRounded/>} sx={{flexGrow: 1}}>Dashboard</Button>
                          <Button component={NavLink} to='/login' endIcon={<LoginRounded/>} sx={{flexGrow: 1}}>Login</Button>
                          {!matches ? <Button  onClick={toggleDrawer(true)}><Menu/></Button> : null}
                        </ButtonGroup>
                        }
                      
                      {matches ? 
                      <Card variant='outlined' sx={{flexGrow: 1}}>        
                        <NameList disablePadding={true}/>
                      </Card> : null}
                    </Stack>
                <Card variant='outlined' sx={{width: '100%', padding: '1em', minHeight:{ xs: '75vh', lg: '90vh'}, display: 'flex', alignContent: 'space-between'}}>
                  <Outlet />
                </Card>
            </Stack>
          </Container>
    </AuthContext.Provider>
  )
}

export default App
