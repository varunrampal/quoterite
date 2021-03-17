import {
    AppBar,
    Box,
    Button,
    Container,
    Dialog,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Slide,
    TextareaAutosize,
    TextField,
    Toolbar,
    Typography,
} from '@material-ui/core';
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
import CloseIcon from '@material-ui/icons/Close';
import {
    ModuleType,
    OrderTransportType,
    QuoteReplyFrom,
} from '../../../../../enums/app-enums';
import { AppState } from '../../../../../stores/root-reducer';
import { useSelector } from 'react-redux';
import {
    IItem,
    IProperty,
    QuoteDetails,
    IQuoteReply,
} from '../../../../../types/appTypes';
import { REACT_APP_API_BASE_URL } from '../../../../../utils/constants';
import QuoteTable from '../QuoteDetailsView/Table';
import AppAccordion from '../../../../AppAcordion';
import { InlineDateTimePicker } from 'material-ui-pickers';
import { TransitionProps } from '@material-ui/core/transitions';
import moment from 'moment';

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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 60,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

interface IOrderType {
    transportType: string;
    transportDate: string;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const QuoteDetailsView = () => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [orderType, setOrderType] = React.useState<any>(
        OrderTransportType.Delivery,
    );
    const [transportDate, setTransportDate] = React.useState<any>();
    const [notes, setNotes] = useState<string>('');
    const [dialogContent, setDialogContent] = useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [openCalendar, setopenCalendar] = React.useState(false);
    const [quoteItems, setquoteItems] = useState<IItem[]>([]);
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [totalAmount, settotalAmount] = useState<number>(0);
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

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log(event.target.value);
        setOrderType(event.target.value as string);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleCalendarOpen = () => {
        setopenCalendar(true);
    };

    const handleCalendarClose = () => {
        setopenCalendar(false);
    };

    const handleNotesChange = (e) => {
        const { value } = e.target;
        setNotes(value);
    };
    const handleInputChange = (
        e: any,
        index: number,
        id: number,
        stock: number,
        price: number,
        qtyalloted: any,
        type: string,
    ) => {
        let totalPrice: number = 0;
        let allottedQty = qtyalloted === undefined ? 0 : qtyalloted;
        const list: IItem[] = [...quoteItems];
        if (type === 'price') {
            list[index].price = price;
        }
        totalPrice = Number((price * allottedQty).toFixed(2));
        list[index].totalprice = Number(totalPrice);
        list[index].qtyallotted = allottedQty;

        const result = list.reduce(
            (sum, { totalprice = 0 }) => sum + totalprice,
            0,
        );
        settotalAmount(Number(result.toFixed(2)));
        setquoteItems(list);
        console.log(list);
    };

    const getQuoteDetails = async () => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/quote/admin/${quoteObj.id}`;

            const responseData = await sendRequest(endpoint, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            if (responseData.code === 200) {
                setquoteItems(responseData.results.quoteDetails.items);
                setOrderType(responseData.results.quoteDetails.transportType);
                setTransportDate(
                    responseData.results.quoteDetails.transportDate,
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitClick = async () => {
        const reply: IQuoteReply = {
            id:quoteObj.id,
            from: QuoteReplyFrom.admin,
            date: moment().format('YYYY/MM/DD'),
            notes: notes,
            items: quoteItems,
        };
        saveQuoteReply(reply);
      
    };
    const saveQuoteReply = async (quoteReply: IQuoteReply) => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/quote/savequotereply`;
            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify(quoteReply),
                {
                    'Content-Type': 'application/json',
                },
            );

            if (responseData.code === 200) {
                setSuccess(true);
                setMessage(
                    `Quote reply is sent successfully!`
                );
            } else{

            }
        } catch (err) {
            console.log(err);
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
                    <Grid item xs={8}>
                        <Box m={1} p={2} style={{ width: '100%' }}>
                            <QuoteHeader
                                propertyObj={propObj}
                                type={'admin'}
                            ></QuoteHeader>
                        </Box>
                        <AppAccordion
                            heading="Quote details"
                            key="accordDetails"
                        >
                            <QuoteTable
                                quotesItems={quoteItems}
                                totalAmount={totalAmount}
                                onChange={handleInputChange}
                            ></QuoteTable>
                        </AppAccordion>
                        <AppAccordion
                            heading="Order mode & Time"
                            key="accordMode"
                        >
                            <Box m={1} p={2} style={{ width: '100%' }}>
                                <Grid container spacing={1}>
                                    <Grid xs={12}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                aria-label="ordermode"
                                                name="ordermode"
                                                value={orderType?.transportType}
                                            >
                                                <Grid container spacing={1}>
                                                    <Grid item xs={3}>
                                                        <FormControl
                                                            className={
                                                                classes.formControl
                                                            }
                                                        >
                                                            <InputLabel id="lblOrderMode">
                                                                Mode
                                                            </InputLabel>
                                                            <Select
                                                                labelId="lblOrderMode"
                                                                id="ddlOrderMode"
                                                                open={open}
                                                                onClose={
                                                                    handleClose
                                                                }
                                                                onOpen={
                                                                    handleOpen
                                                                }
                                                                value={
                                                                    orderType
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            >
                                                                <MenuItem
                                                                    value={
                                                                        'DELIVERY'
                                                                    }
                                                                >
                                                                    DELIVERY
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value={
                                                                        'PICKUP'
                                                                    }
                                                                >
                                                                    PICKUP
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <FormControl
                                                            className={
                                                                classes.formControl
                                                            }
                                                        >
                                                            <InlineDateTimePicker
                                                                keyboard
                                                                ampm={false}
                                                                label="Date"
                                                                value={
                                                                    transportDate
                                                                }
                                                                onChange={() => {
                                                                    console.log();
                                                                }}
                                                                onError={
                                                                    console.log
                                                                }
                                                                format="yyyy/MM/dd HH:mm"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FormControl
                                                            className={
                                                                classes.formControl
                                                            }
                                                        >
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={
                                                                    handleCalendarOpen
                                                                }
                                                                style={{
                                                                    paddingTop:
                                                                        '20px',
                                                                }}
                                                            >
                                                                Check
                                                                Delivery/Pickup
                                                                schedule
                                                            </Button>
                                                            <Dialog
                                                                fullScreen
                                                                open={
                                                                    openCalendar
                                                                }
                                                                onClose={
                                                                    handleCalendarClose
                                                                }
                                                                TransitionComponent={
                                                                    Transition
                                                                }
                                                            >
                                                                <AppBar
                                                                    className={
                                                                        classes.appBar
                                                                    }
                                                                >
                                                                    <Toolbar>
                                                                        <IconButton
                                                                            edge="start"
                                                                            color="inherit"
                                                                            onClick={
                                                                                handleCalendarClose
                                                                            }
                                                                            aria-label="close"
                                                                        >
                                                                            <CloseIcon />
                                                                        </IconButton>
                                                                        <Typography
                                                                            variant="h6"
                                                                            className={
                                                                                classes.title
                                                                            }
                                                                        >
                                                                            Calendar
                                                                        </Typography>
                                                                        {/* <Button
                                                                        autoFocus
                                                                        color="inherit"
                                                                        onClick={
                                                                            handleClose
                                                                        }
                                                                    >
                                                                        save
                                                                    </Button> */}
                                                                    </Toolbar>
                                                                </AppBar>
                                                                <List>
                                                                    <ListItem
                                                                        button
                                                                    >
                                                                        <ListItemText
                                                                            primary="Phone ringtone"
                                                                            secondary="Titania"
                                                                        />
                                                                    </ListItem>
                                                                    <Divider />
                                                                    <ListItem
                                                                        button
                                                                    >
                                                                        <ListItemText
                                                                            primary="Default notification ringtone"
                                                                            secondary="Tethys"
                                                                        />
                                                                    </ListItem>
                                                                </List>
                                                            </Dialog>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                        </AppAccordion>

                        <AppAccordion heading="Submit quote" key="accordSubmit">
                            <Grid container spacing={4} direction="column">
                                <Grid item xs={6}>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <TextareaAutosize
                                            rowsMax={5}
                                            rowsMin={4}
                                            aria-label="notes"
                                            placeholder="Notes(optional)"
                                            style={{ width: '100%' }}
                                            onChange={(e) =>
                                                handleNotesChange(e)
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <Button
                                            type="button"
                                            size="large"
                                            color="primary"
                                            variant="contained"
                                            onClick={handleSubmitClick}
                                        >
                                            Submit
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </AppAccordion>
                    </Grid>

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
