import React, { useContext } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Grid,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { useHttpClient } from '../../../../hooks/http-hook';
import { AuthContext } from '../../../../context/auth-context';
import Page from '../../../page';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import Heading from '../../../Header';
import AppBreadCrumb from '../../../AppBreadCrumb';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../stores/root-reducer';
import { IProperty } from '../../../../types/appTypes';
import DynamicInput from '../../../DynamicInput';
import QuoteHeader from '../../../QuoteHeader';
import AppTimeLine from '../../../AppTimeLine';
import { ModuleType } from '../../../../enums/app-enums';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: '100vh',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    textField: {
        '& > *': {
            width: '100%',
        },
    },
    fixedHeight: {
        height: 240,
    },
}));

const CreateQuote = () => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();

    const { selectedProperty } = useSelector(
        (state: AppState) => state.properties,
    );

    const propertyObj: IProperty = selectedProperty;

  const handleSubmitClick = async (value: []) => {

          console.log(value);
    }

    return (
        <Page className={classes.root} title="Create Quote">
            {isLoading && <LoadingSpinner asOverlay />}
            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Create Quote"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                <Grid item container direction="row">
                <Grid item xs={9}>
                    <Box m={1} p={2}>
                        <QuoteHeader propertyObj = {propertyObj} type={'new'}></QuoteHeader>
                    </Box>
                    <Box m={1} p={2}>
                        <Card>
                            <CardActionArea component="div" disableRipple>
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                    >
                                        Add Product/Item/Service
                                    </Typography>
                                    <DynamicInput handleSubmit={handleSubmitClick}></DynamicInput>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <AppTimeLine moduleType={ModuleType.Quote} quoteDate = {new Date()}></AppTimeLine>
                </Grid>
                </Grid>

               
              
            </Container>
        </Page>
    );
};

export default CreateQuote;
