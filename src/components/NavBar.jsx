import React from 'react';

//mui
import {
    AppBar, 
    Box, 
    MenuItem, 
    Toolbar, 
    Tooltip, 
    Menu, 
    Typography, 
    Button, 
    IconButton, 
    Avatar, 
    Container} 
from '@mui/material';

import {UserAuth} from '../contexts/AuthContext';

const pages = ['Dashboard', 'Sharpens','Graphs','About'];
const settings = ['Profile', 'Dashboard', 'Logout'];

export default function NavBar() {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
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
    return(
    <> 
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
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }} 
        >  
        <h2>Stat Tracker</h2>
        </Typography> 
        {user ? 
            <> 
            {/* <h3>{user.displayName}</h3> */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    {page}
                </Button>
                ))}
            </Box>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls = "menu-appbar"
                aria-haspopup = "true"
                onClick = {handleOpenNavMenu}
                color = "inherit"
            >
            </IconButton> 
            <Tooltip title = "Open Settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}> 
                <Avatar alt = {user.name} src = {user.photoURL}/>
            </IconButton>
            </Tooltip>

            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
        :
        null
        }
        </Toolbar>
        </Container>
        </AppBar>
        
        </>
    )
}