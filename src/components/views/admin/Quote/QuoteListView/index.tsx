import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Container,
    makeStyles,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Page from '../../../../page';
import QuoteTable from './Table';
import Toolbar from './ToolBar';
import { useHttpClient } from '../../../../../hooks/http-hook';
import { AuthContext } from '../../../../../context/auth-context';
import LoadingSpinner from '../../../../../ui/LoadingSpinner';
import { AppState } from '../../../../../stores/root-reducer';
import { loadQuotes } from '../../../../../stores/quotes/QuotesActions';
import { QuoteState } from '../../../../../types/appTypes';
import Heading from '../../../../Header';
import { REACT_APP_API_BASE_URL } from '../../../../../utils/constants';
import AppBreadCrumb from '../../../../AppBreadCrumb';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
    },
}));

const QuoteListView = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let quotesCount = 0;
    const recordsPerPage = 10;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

     const {
        quotes,
        currentPage,
        totalRecords,
        filterRecords,
        searchStr,
    } = useSelector((state: AppState) => state.quotes);

    const {
        isLoading,
        sendRequest,
        clearError,
        clearSuccess,
    } = useHttpClient();


    useEffect(() => {
        if (!filterRecords) {
              getQuoteCount();
        } else {
            filterCustomers(searchStr);
        }
    }, [page]);

    const getQuoteCount = async (reset: boolean = false) => {
        try {
            // const endpoint =
            //     process.env.REACT_APP_API_BASE_URL + 'user/total/0';

            const endpoint = `${REACT_APP_API_BASE_URL}/quote/count`;

            const responseData = await sendRequest(endpoint, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            if (responseData.code === 200) {
                //setcustomerCount(responseData.results.userCount);
                quotesCount = responseData.results.quoteCount;
                getQuotes(reset);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getQuotes = async (reset: boolean) => {
        try {
            // const endpoint = process.env.REACT_APP_API_BASE_URL + 'user/';
            const endpoint = `${REACT_APP_API_BASE_URL}/quote/admin/quotes/`;
            let currentPage = page;

            if (reset) {
                currentPage = 0;
            }

            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify({
                    page: currentPage + 1,
                    pagination: recordsPerPage,
                    role: 0,
                }),
                {
                    Authorization: 'Bearer ' + auth.token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            );

            if (responseData.code === 200) {
                const quoteState: QuoteState = {
                    quotes: responseData.results.Quotes,
                    currentPage,
                    totalRecords: quotesCount,
                    filterRecords: false,
                    searchStr: '',
                };

                dispatch(loadQuotes(quoteState));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRowsLimitChange = (newLimit: number) => {
        setLimit(newLimit);
    };
    const filterCustomers = async (value: string) => {
        if (value.trim() === '') {
            getQuoteCount();
        } else {
            const userRole = 0;
            let currentPage = page;

            if ((filterRecords && searchStr !== value) || searchStr === '') {
                currentPage = 0;
            }

            const endpoint = `${REACT_APP_API_BASE_URL}/user/filter/${userRole}&${
                currentPage + 1
            }&${recordsPerPage}&${value}`;
            const responseData = await sendRequest(endpoint, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            const quoteState: QuoteState = {
                quotes: responseData.results.Quotes,
                currentPage,
                totalRecords: responseData.results.totalRecords,
                filterRecords: true,
                searchStr: value,
            };
            dispatch(loadQuotes(quoteState));
        }
    };
    return (
        <Page className={classes.root} title="Customers">
            {isLoading && <LoadingSpinner asOverlay />}

            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Quotes"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                
                <Toolbar filterCustomers={filterCustomers} />

                {quotes.length > 0 ? (
                    <Box mt={3}>
                        <QuoteTable
                            quotesDetails={quotes}
                            totalRecords={totalRecords}
                            page={currentPage}
                            limit={limit}
                            onPageChange={handlePageChange}
                            onRowsLimitChange={handleRowsLimitChange}
                        />

                        <Box mt={3}>
                            <Button
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                color="primary"
                                variant="contained"
                                onClick={handleClick}
                            >
                                Open Menu
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Block</MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Send message
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Recent Quote
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Recent Order
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Recent Invoice
                                </MenuItem>
                            </Menu>
                        </Box>
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

export default QuoteListView;
