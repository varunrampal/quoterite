import React, { useContext, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';

import NavItem from './NavItem';
import {customerItems, adminItems} from './NavBarItems';
import { AuthContext } from '../../../context/auth-context';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};


const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  name: {
      textAlign: 'left'
  }
}));

interface IProps {
    onMobileClose: () => void,
    openMobile: boolean

  }


const NavBar: React.FC<IProps> = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const auth = useContext(AuthContext);
  let links: any;
  let userType: string = "";

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if(auth.userRole === 0) {
    userType = "Customer";
    links =  <List>
    {customerItems.map((item) => (
      <NavItem
        href={item.href}
        key={item.title}
        title={item.title}
        icon={item.icon}
      />
    ))}
  </List>
  
  } else if(auth.userRole === 1) {
    userType = "Admin";
    links =  <List>
    {adminItems.map((item) => (
      <NavItem
        href={item.href}
        key={item.title}
        title={item.title}
        icon={item.icon}
      />
    ))}
  </List>
  }



  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/customer/account"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {auth.userName}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
         {userType}
          {/* {user.jobTitle} */}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
      {links}
      </Box>
      <Box flexGrow={1} />
      {/* <Box
        p={2}
        m={2}
        bgcolor="background.dark"
      >
        <Typography
          align="center"
          gutterBottom
          variant="h4"
        >
          Need more?
        </Typography>
        <Typography
          align="center"
          variant="body2"
        >
          Upgrade to PRO version and access 20 more screens
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          <Button
            color="primary"
            component="a"
            href="https://react-material-kit.devias.io"
            variant="contained"
          >
            See PRO version
          </Button>
        </Box>
      </Box> */}
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};


export default NavBar;
