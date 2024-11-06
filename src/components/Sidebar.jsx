import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'

import Logo from "../images/logo.png";
import { styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useAuth } from './../context'
import { doSignOut } from './../firebase/auth'

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()

  const handleCloseNavMenu = () => {
    doSignOut().then(() => { navigate('/login') })
  };
  console.log("userLoggedIn", userLoggedIn)

  return (
    <>
      <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={Logo}
            width={"60px"}
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            fontFamily={'Kanit, sans-serif'}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Kanit, sans-serif',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Capacity Standard Database
          </Typography>

          
          <Box
            component="img"
            src={Logo}
            width={"60px"}
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
         
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Kanit, sans-serif',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Capacity STD
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {
              userLoggedIn ?
              <>
                <Button style={{fontFamily: 'Kanit, sans-serif'}} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                  Logout
                </Button>
              </>
              :
              <>
                <Button style={{fontFamily: 'Kanit, sans-serif'}} sx={{ my: 2, color: 'white', display: 'block' }}>
                  Login
                </Button>
              </>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </>
  );
}