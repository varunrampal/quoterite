import React, { Component, useState } from 'react';  
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './Navbar';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));
  
const AdminLayout = ({children, ...rest}) => {  
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  return (  

    <div className={classes.root}>
           <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
          <NavBar
            onMobileClose={() => setMobileNavOpen(false)}
            openMobile={isMobileNavOpen}
          />
          <div className={classes.wrapper}>
            <div className={classes.contentContainer}>
              <div className={classes.content}>
              {children}
              </div>
            </div>
          </div>
        </div>
      )  
}  
  
const AdminLayoutRoute = ({component: Component, ...rest}) => {  
  console.log({...rest})
  return (  
    <Route {...rest} render={matchProps => (  
      <AdminLayout>  
          <Component {...matchProps} />  
      </AdminLayout>  
    )} />  
  )  
};  
  
export default AdminLayoutRoute; 