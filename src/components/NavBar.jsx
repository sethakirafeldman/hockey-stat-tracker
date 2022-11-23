import React, {useRef} from 'react';
import { Link } from 'react-router-dom';

//mui
import {
    AppBar, 
    Box, 
    MenuItem, 
    Toolbar, 
    Tooltip,  
    Typography,  
    IconButton, 
    Avatar, 
    Container,
} 
from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';

import {UserAuth} from '../contexts/AuthContext';

const pages = ['Dashboard', 'Sharpenings','Graphs','About'];
const pageObjs = [];

pages.forEach((page) => {
    pageObjs.push(
        {name:page,
         path: `/${page.toLowerCase()}`
        }
    )
})

export default function NavBar(props) {

    const menuRef = useRef();
    
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(true);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(true);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };    

    const {user, logOut} = UserAuth();

    const handleSignOut = async () =>{
        try {
            await logOut()
        }
        catch (err) {
            console.log(err);
        }
    }

    const LoggedInBar = () => {
      return (
        <AppBar position="sticky">
        <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >Stat Tracker   
          </Typography>
           
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            {Object.values(pageObjs).map((page) => (
                <Link to = {page.path} className = 'nav-menu'
                    key={page.name}
                    onClick={handleCloseNavMenu}
                >
                {page.name}
              </Link>
            ) )}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          > Stat Tracker
            
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    
            {Object.values(pageObjs).map((page) => (
                <Link to = {page.path} className = 'nav-btn'
                    key={page.name}
                    onClick={handleCloseNavMenu}
                >
                {page.name}
              </Link>
            ) )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {/* user menu */}
            <Tooltip title="Open Settings">
              <span><IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }} ref={menuRef}>
                <Avatar alt={`${user.displayName} profile image`} src={user.photoURL} />
              </IconButton></span>
              </Tooltip>
              <Menu
                sx={{ mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin=
                  {{vertical: 'top', 
                  horizontal: 'right'}}
                // keepMounted
                transformOrigin=
                  {{vertical: 'top', 
                  horizontal: 'right'}}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
              <MenuItem> <Link style = {{textDecoration: 'none', color: 'black'}} to = "/settings" onClick={handleCloseUserMenu}>Settings</Link></MenuItem>
              <MenuItem onClick ={handleSignOut}>Log Out</MenuItem>
            </Menu>
            
          </Box>
        </Toolbar>
      </Container>
        </AppBar>
        )
    }

    const LoggedOutBar = () => {
      return (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
          Stat Tracker
        </Typography>
        </Toolbar>
        </Container>
        </AppBar> 
      )
    } 

    return (
      <> 
      {user === null || Object.keys(user).length === 0 ?

      <LoggedOutBar />
      : 
      <LoggedInBar />
      
      } 
      </>    
    )
}