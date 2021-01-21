import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../../page';
import Widget from './Widget';
import { REACT_APP_API_BASE_URL } from '../../../../utils/constants';
import { AuthContext } from '../../../../context/auth-context';
import { useHttpClient } from '../../../../hooks/http-hook';
import Heading from '../../../Header';
import AppBreadCrumb from '../../../AppBreadCrumb';
import moment from 'moment';
import Sales from './sales';
import OrderDeliveryMode from './OrderDeliveryMode';
import LatestQuotes from './LatestQuotes';
import { IQuote } from '../../../../types/appTypes';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '100%',
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
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();
    const [pendingQuotes, setPendingQuotes] = useState<number>(0);
    const [totalCustomers, settotalCustomers] = useState<number>(0);
    const [latestQuotes, setLatestQuotes] = useState<IQuote[]>([]);
    // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    //Load widget data
    const getWidgetsData = async () => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/admin/dashboard/widget`;

            const responseData = await sendRequest(endpoint, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            if (responseData.code === 200) {
                setPendingQuotes(responseData.results.pendingQuotes);
                settotalCustomers(responseData.results.totalCustomers);
                setLatestQuotes(responseData.results.latestQuotes)
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getWidgetsData();
    }, []);
    return (
        <Page className={classes.root} title="Dashboard">
            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Dashboard"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                <Grid container spacing={3}>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Widget
                            type="quote"
                            heading="PENDING QUOTES"
                            content={pendingQuotes}
                        />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Widget type="order" heading="NEW ORDERS" content={2} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Widget
                            type="delivery"
                            heading="DELIVERY/PICKUP"
                            content={5}
                        />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Widget
                            type="customers"
                            heading="TOTAL CUSTOMERS"
                            content={totalCustomers}
                        />
                    </Grid>
                    <Grid item lg={8} md={12} xl={9} xs={12}>
                        <Sales />
                    </Grid>
                    <Grid item lg={4} md={6} xl={3} xs={12}>
                        <OrderDeliveryMode />
                    </Grid>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                        <LatestQuotes quotes= {latestQuotes} />
                    </Grid>
                
                    {/* <Grid
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
