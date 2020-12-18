import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import AppBreadCrumb from '../../../AppBreadCrumb';
import Heading from '../../../Header';
import Page from '../../../page';
import Tile from '../../../Tile';

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

const Account = () => {
    const classes = useStyles();
    let { url } = useRouteMatch();
    console.log(url);
   
    return (
        <Page className={classes.root} title="Dashboard">
            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Account"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>

                <Grid container spacing={3}>
                    <Grid item lg={3} sm={6} xl={3} xs={6}>
                        <Tile
                            iconColor="primary"
                            iconType="homework"
                            iconFontSize="large"
                            title="Manage Properties"
                            link={`${url}/manageproperties`}
                        ></Tile>
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={6}>
                        <Tile
                            iconColor="primary"
                            iconType="person"
                            iconFontSize="large"
                            title="Manage Profile"
                            link={`${url}/manageprofile`}
                        ></Tile>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Account;
