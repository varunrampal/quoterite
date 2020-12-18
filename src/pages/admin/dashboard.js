import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
  
    <div>  
    <h2>Welcome User</h2>  
  <span>Welcome the demo of multiple page this page is rendered using second layout</span>  
  </div> 
   
  );
};

export default Dashboard;
