import { Box, Container, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { useHttpClient } from '../../../../hooks/http-hook';
import { AuthContext } from '../../../../context/auth-context';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import { IProperty, PropertyState } from '../../../../types/appTypes';
import AppAccordion from '../../../AppAcordion';
import AppBreadCrumb from '../../../AppBreadCrumb';
import Heading from '../../../Header';
import Page from '../../../page';
import PropertDetails from '../../../PropertyDetails';
import { ConfirmProvider } from 'material-ui-confirm';
import { AppState } from '../../../../stores/root-reducer';
import {
    getProperties
    
} from '../../../../stores/property/PropertiesActions';
import Toolbar from './ToolBar';

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

const Properties = () => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();

    const dispatch = useDispatch();
    const {
        properties,
        totalRecords,
        filterRecords,
        searchStr,
    } = useSelector((state: AppState) => state.properties);


    const loadProperties = async () => {
        try {
            const endpoint =
                process.env.REACT_APP_API_BASE_URL + 'customer/properties';
            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify({
                    custemail: auth.userEmail,
                }),
                {
                    Authorization: 'Bearer ' + auth.token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            );

            if (responseData.code === 200) {
                const propertyDetails: IProperty[] =
                    responseData.results.properties;
               
                //setProperties(propertyDetails);

                const propertyState: PropertyState = {
                    properties: responseData.results.properties,
                    totalRecords: responseData.results.totalRecords,
                    filterRecords: false,
                    searchStr: '',
                };
                dispatch(getProperties(propertyState));
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        loadProperties();
    }, [dispatch]);

    const handlePropertiesSearch = async (value: string) => {

    }

    return (
        <Page className={classes.root} title="Manage Properties">
            {isLoading && <LoadingSpinner asOverlay />}
            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Manage Properties"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                <Box mt={3}>
                <Toolbar filterProperties={handlePropertiesSearch} />
                </Box>
                {properties.length > 0 ? (
                    <Box mt={3}>
                        {properties.map((property, i) => (
                            <LazyLoad
                                key={i}
                                height={100}
                                offset={[100, 100]}
                                placeholder={<LoadingSpinner></LoadingSpinner>}
                            >
                                <ConfirmProvider>
                                    <AppAccordion
                                        heading={property.name}
                                        key={property.__id}
                                    >
                                        <PropertDetails
                                            key={i}
                                            __id={property.__id}
                                            address={property.address}
                                            custmail={property.custmail}
                                            name={property.name}
                                            phone={property.phone}
                                            email={property.email}
                                        ></PropertDetails>
                                    </AppAccordion>
                                </ConfirmProvider>
                            </LazyLoad>
                        ))}
                    </Box>
                ) : (
                    <Box mt={3}>
                        <div>No record found</div>
                    </Box>
                )}
            </Container>
        </Page>
    );
};

export default Properties;
