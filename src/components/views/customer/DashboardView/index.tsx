import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../../page';
import SuccessModal from '../../../SuccessModal';
import { AuthContext } from '../../../../context/auth-context';
import Heading from '../../../Header';
import AppBreadCrumb from '../../../AppBreadCrumb';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: '100vh',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const [success, setSuccess] = useState<boolean>(false);
    const message = 'You are registered successfully';
    const auth = useContext(AuthContext);

    const clearSuccess = () => {
        setSuccess(false);
        auth.isNewUser = false;
    };

    useEffect(() => {
        auth.isNewUser ? setSuccess(true) : setSuccess(false);
    }, []);

    return (
        <Page className={classes.root} title="Dashboard">
            <SuccessModal
                success={success}
                successMessage={message}
                onClear={clearSuccess}
            />

            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Dashboard"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                <Grid container spacing={3}>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        Customer Dashboard View
                    </Grid>
                    {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid> */}
                </Grid>
            </Container>
        </Page>
    );
};

export default Dashboard;
