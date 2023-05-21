import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Container, Menu, MenuItem, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import * as React from 'react';
export default function Navbar() {
  const { data: session, status } = useSession();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const isLoggedIn = status === 'authenticated' && session?.user?.email;

  const settings = [{ title: 'Logout', action: signOut }];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (action?: () => void) => () => {
    action?.();
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar variant="dense" disableGutters>
            <Typography
              variant="body1"
              component={Link}
              href="/feed"
              sx={{ display: 'flex', alignItems: 'center', alignSelf: 'start' }}
            >
              <Image src="/icon-512x512.png" alt="website icon" width={48} height={48} />
              GMBTS
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex' }, marginLeft: 3 }}>
              <Button sx={{ color: '#fff' }} LinkComponent={Link} href="/complaint/create">
                Create +
              </Button>

              <Button sx={{ color: '#fff' }} LinkComponent={Link} href="/heatmap">
                <LocationOnIcon />
                Heatmap
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {isLoggedIn && <Avatar alt={session.user?.name} src={session.user?.image} />}
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
                onClose={handleCloseUserMenu()}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.title} onClick={handleCloseUserMenu(setting.action)}>
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
