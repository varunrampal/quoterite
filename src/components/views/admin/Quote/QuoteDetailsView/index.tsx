import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../../context/auth-context';
import { useHttpClient } from '../../../../../hooks/http-hook';
import ErrorModal from '../../../../../ui/ErrorModal';
import LoadingSpinner from '../../../../../ui/LoadingSpinner';
import AppBreadCrumb from '../../../../AppBreadCrumb';
import AppDialog from '../../../../AppDialog';
import AppTimeLine from '../../../../AppTimeLine';
import Heading from '../../../../Header';
import Page from '../../../../page';
import QuoteHeader from '../../../../QuoteHeader';
import SuccessModal from '../../../../SuccessModal';
import {
    ModuleType,
    OrderTransportType,
    QuoteType,
    QuoteStatus,
} from '../../../../../enums/app-enums';
import { AppState } from '../../../../../stores/root-reducer';
import { useSelector } from 'react-redux';
import {
    IItem,
    IProperty,
    IQuote,
    QuoteDetails,
} from '../../../../../types/appTypes';
import { REACT_APP_API_BASE_URL } from '../../../../../utils/constants';
import QuoteTable from '../QuoteDetailsView/Table';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '100%',
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
const QuoteDetailsView = () => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogContent, setDialogContent] = useState<string>('');
    const [quoteItems, setquoteItems] = useState<IItem[]>([]);
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const dialogTitle = 'Alert';

    const { selectedQuote } = useSelector((state: AppState) => state.quotes);
    const quoteObj: QuoteDetails = selectedQuote;
    const propObj: IProperty = quoteObj.property;

    const clearSuccess = () => {
        setSuccess(false);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const getQuoteDetails = async () => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/quote/admin/${quoteObj.id}`;

            const responseData = await sendRequest(endpoint, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            if (responseData.code === 200) {
                console.log(responseData.results.items);
                setquoteItems(responseData.results.quoteDetails.items);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getQuoteDetails();
        if (quoteItems.length > 0) {
            setquoteItems(quoteItems);
        }
    }, []);

    return (
        <Page className={classes.root} title="Quote Details">
            {isLoading && <LoadingSpinner asOverlay />}
            <SuccessModal
                success={success}
                successMessage={message}
                onClear={clearSuccess}
            />
            <ErrorModal error={error} onClear={clearError} />

            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Quote Details"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                <Grid item container direction="row" spacing={1}>
                    {propObj !== null ? (
                        <Grid item xs={8}>
                            <Box m={1} p={2}>
                                <QuoteHeader
                                    propertyObj={propObj}
                                    type={'admin'}
                                ></QuoteHeader>
                            </Box>
                        </Grid>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    {
                        quoteItems.length > 0 ? (<QuoteTable quotesItems = {quoteItems} ></QuoteTable>):(<></>)
                    }
                  
                    <Grid item xs={4} alignItems="flex-end">
                        <AppTimeLine
                            moduleType={ModuleType.Quote}
                            quoteDate={new Date()}
                        ></AppTimeLine>
                    </Grid>
                </Grid>
                <AppDialog
                    title={dialogTitle}
                    content={dialogContent}
                    open={openDialog}
                    type="error"
                    onClose={handleDialogClose}
                ></AppDialog>
            </Container>
        </Page>
    );
};

export default QuoteDetailsView;
