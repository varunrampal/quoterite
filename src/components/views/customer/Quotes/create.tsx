import React, { useContext, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    IconButton,
    makeStyles,
    Radio,
    TextareaAutosize,
    TextField,
    Tooltip,
} from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import _ from 'lodash';
import { useHttpClient } from '../../../../hooks/http-hook';
import { AuthContext } from '../../../../context/auth-context';
import Page from '../../../page';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import Heading from '../../../Header';
import AppBreadCrumb from '../../../AppBreadCrumb';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../stores/root-reducer';
import { IProperty, IQuote } from '../../../../types/appTypes';
import QuoteHeader from '../../../QuoteHeader';
import AppTimeLine from '../../../AppTimeLine';
import { ModuleType, OrderTransportType, QuoteType, QuoteStatus } from '../../../../enums/app-enums';
import Button from '../../../../ui/Button';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Scrollbars } from 'rc-scrollbars';
import AppDialog from '../../../AppDialog';
import { REACT_APP_API_BASE_URL, ITEMTYPE } from '../../../../utils/constants';
import { IItem } from '.././../../../types/appTypes';
import AppAccordion from '../../../AppAcordion';
import { InlineDateTimePicker } from 'material-ui-pickers';
import moment from 'moment';
import SuccessModal from '../../../SuccessModal';
import ErrorModal from '../../../../ui/ErrorModal';

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
//'2018-01-01T00:00:00.000Z',
const CreateQuote = () => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogContent, setDialogContent] = useState<string>('');
    const [items, setItems] = useState<IItem[]>([]);
    const [inputList, setInputList] = useState<IItem[]>([]);
    const [orderType, setOrderType] = React.useState<any>(
        OrderTransportType.Delivery,
    );
    const [selectedDeliveryDate, handleDeliveryDate] = useState(null);
    const [selectedPickupDate, handlePickupDate] = useState(null);
    const [notes, setNotes] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const dialogTitle = 'Alert';
    let selectedItem: IItem = { id: 0, name: '', quantity: 0 };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     
        setOrderType((event.target as HTMLInputElement).value);
    };
    const { selectedProperty } = useSelector(
        (state: AppState) => state.properties,
    );
    const propertyObj: IProperty = selectedProperty;

    // handle click event of the Add button
    const handleAddClick = () => {
        if (!_.isEmpty(selectedItem) && selectedItem.name !== '') {
            const itemExists = inputList.some((x) => x.id === selectedItem.id);
            if (!itemExists) {
                setInputList([...inputList, selectedItem]);
                let item: IItem = { id: 0, name: '', quantity: 0 };
                // setSelectedItem(item);
                selectedItem = item;
            } else {
                setDialogContent(
                    `${ITEMTYPE} with the name ${selectedItem.name} already exsits in the list`,
                );
                setOpenDialog(true);
            }
        } else {
            setDialogContent(
                `Enter ${ITEMTYPE.toLowerCase()} name to search`
            );
            setOpenDialog(true);
        }
    }

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle input change
    const handleInputChange = (e, index) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;

        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = Number(value);
        setInputList(list);
    };

    const clearSuccess = () => {
        setSuccess(false);
    };

    const handleSubmitClick = async () => {
        if (inputList.length > 0) {
            let invalidQty = inputList.some(
                (x) => x.quantity === undefined || x.quantity === 0,
            );

            if (invalidQty) {
                setDialogContent(`Quantity should be greater than 0.`);
                setOpenDialog(true);
            } else {
                // let orderTransportType: OrderTransportType =
                //     OrderTransportType.Delivery;
                  
                if (
                    orderType === OrderTransportType.Delivery &&
                    selectedDeliveryDate === null
                ) {
                    setDialogContent(`Please select the delivery date`);
                    setOpenDialog(true);
                } else if (
                    orderType === OrderTransportType.Pickup &&
                    selectedPickupDate === null
                ) {
                    setDialogContent(`Please select the pickup date`);
                    setOpenDialog(true);
                }
                 else
                 {
                    const transportDate =
                        orderType === OrderTransportType.Delivery
                            ? selectedDeliveryDate
                            : selectedPickupDate;

                        let quoteDetails: IQuote = {
                        createDate: moment().format('YYYY/MM/DD'),
                        items: inputList,
                        notes: notes,
                        property: propertyObj._id,
                        status: QuoteStatus.Open,
                        submitedBy: auth.userId,
                        transportType: orderType,
                        transportDate: moment(transportDate).format(
                            'YYYY/MM/DD HH:mm',
                        ),
                        type: QuoteType.Property,
                    };
                    saveQuote(quoteDetails);
                }
            }
        }
    };

    const saveQuote = async (quote: IQuote) => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/quote/create`;
            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify(quote),
                {
                    'Content-Type': 'application/json',
                },
            );

            setSuccess(true);
            setMessage(
                `Thank you. We have received your quote and very shortly we will process it.
                 Your quote id is ${responseData.results.quoteId}`
            );
            resetControlls();

        } catch (err) {
            console.log(err);
        }
    };

    const resetControlls = () => {
        inputList.length = 0;
        setNotes('');
        handleDeliveryDate(null);
        handlePickupDate(null);
    }

    const handleOnSearch = (value: string, cached) => {
        const searchStr = value.trim();
        if (searchStr !== '') {
            getItems(searchStr);
        }
    };

    const handleOnSelect = (item: IItem) => {
        selectedItem = item;
    };

    const handleOnFocus = () => {
        //console.log('Focused');
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const handleNotesChange = (e) => {
        const { value } = e.target;
        setNotes(value);
    };

    const getItems = async (searchStr: string) => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/item/searchbyname/${searchStr}`;

            const responseData = await sendRequest(endpoint, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            if (responseData.code === 200) {
                let resItems: IItem[] = responseData.results.items;
                setItems(resItems);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Page className={classes.root} title="Create Quote">
             {isLoading && (<LoadingSpinner asOverlay />)}
            <SuccessModal
                success={success}
                successMessage={message}
                onClear={clearSuccess}
            />
            <ErrorModal error={error} onClear={clearError} />

            <Container maxWidth={false}>
                <Box m={1} p={2}>
                    <Heading heading="Create Quote"></Heading>
                    <AppBreadCrumb></AppBreadCrumb>
                </Box>
                <Grid item container direction="row" spacing={1}>
                    <Grid item xs={8}>
                        <Box m={1} p={2}>
                            <QuoteHeader
                                propertyObj={propertyObj}
                                type={'new'}
                            ></QuoteHeader>
                        </Box>

                        <AppAccordion heading="Add plants" key="accordAdd">
                            <Box m={1} p={2} style={{ width: '100%' }}>
                                <Grid item container direction="row">
                                    <Grid xs={4}>
                                       
                                        <ReactSearchAutocomplete
                                            items={items}
                                            onSearch={handleOnSearch}
                                            onSelect={handleOnSelect}
                                            onFocus={handleOnFocus}
                                            showIcon={true}
                                            placeholder={`Search ${ITEMTYPE}`}
                                            styling={{
                                                height: '40px',
                                                border: '1px solid lightgrey',
                                                borderRadius: '4px',
                                                backgroundColor: 'white',
                                                boxShadow: 'none',
                                                hoverBackgroundColor:
                                                    'lightgrey',
                                                color: 'grey',
                                                fontSize: '16px',
                                                fontFamily: 'Arial',
                                                iconColor: 'green',
                                                lineColor: 'grey',
                                                placeholderColor: 'grey',
                                            }}
                                        
                                        />
                                    </Grid>
                                    <Grid xs={2}>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="medium"
                                            variant="contained"
                                            onClick={handleAddClick}
                                            style={{ 
                                                height: '44px',
                                                marginLeft: '5px'
                                                
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                    <Grid xs={6}>
                                        {inputList.length > 0 && (
                                            <React.Fragment>
                                                <Scrollbars
                                                    style={{
                                                        width: '100%',
                                                        height: 200,
                                                    }}
                                                    autoHide
                                                >
                                                    <Box
                                                        m={1}
                                                        p={1}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        {inputList.map(
                                                            (x, i) => {
                                                                return (
                                                                    <Grid
                                                                        container
                                                                        spacing={
                                                                            1
                                                                        }
                                                                    >
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                5
                                                                            }
                                                                        >
                                                                            <TextField
                                                                                name="item"
                                                                                value={
                                                                                    x.name
                                                                                }
                                                                                autoFocus
                                                                                variant="standard"
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                5
                                                                            }
                                                                        >
                                                                            <TextField
                                                                                name="quantity"
                                                                                type="number"
                                                                                value={
                                                                                    x.quantity
                                                                                }
                                                                                variant="standard"
                                                                                placeholder="Enter quantity"
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleInputChange(
                                                                                        e,
                                                                                        i,
                                                                                    )
                                                                                }
                                                                                defaultValue={
                                                                                    0
                                                                                }
                                                                                required
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                2
                                                                            }
                                                                        >
                                                                            <Tooltip
                                                                                title="Delete entry"
                                                                                arrow
                                                                            >
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() =>
                                                                                        handleRemoveClick(
                                                                                            i,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                    </Grid>
                                                                );
                                                            },
                                                        )}
                                                    </Box>
                                                </Scrollbars>
                                            </React.Fragment>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </AppAccordion>

                        {inputList.length > 0 && (
                            <React.Fragment>
                                <AppAccordion
                                    heading="Select delivery/pickup date"
                                    key="accordDate"
                                >
                                    <Box m={1} p={2} style={{ width: '100%' }}>
                                        <Grid container spacing={1}>
                                            <Grid xs={6}>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        aria-label="ordermode"
                                                        name="ordermode"
                                                        value={orderType}
                                                        onChange={handleChange}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={3}
                                                        >
                                                            <Grid xs={3}>
                                                                <FormControlLabel
                                                                    value={
                                                                        OrderTransportType.Delivery
                                                                    }
                                                                    control={
                                                                        <Radio />
                                                                    }
                                                                    label="Delivery"
                                                                />
                                                            </Grid>
                                                            <Grid xs={9}>
                                                                <InlineDateTimePicker
                                                                    keyboard
                                                                    ampm={false}
                                                                    label="Select delivery date"
                                                                    value={
                                                                        selectedDeliveryDate
                                                                    }
                                                                    onChange={
                                                                        handleDeliveryDate
                                                                    }
                                                                    onError={
                                                                        console.log
                                                                    }
                                                                    disablePast
                                                                    format="yyyy/MM/dd HH:mm"
                                                                />
                                                            </Grid>
                                                            <Grid xs={3}>
                                                                <FormControlLabel
                                                                    value={
                                                                        OrderTransportType.Pickup
                                                                    }
                                                                    control={
                                                                        <Radio />
                                                                    }
                                                                    label="Pickup"
                                                                />
                                                            </Grid>
                                                            <Grid xs={9}>
                                                                {/* <DatePicker></DatePicker> */}
                                                                <InlineDateTimePicker
                                                                    keyboard
                                                                    ampm={false}
                                                                    label="Select pickup date"
                                                                    value={
                                                                        selectedPickupDate
                                                                    }
                                                                    onChange={
                                                                        handlePickupDate
                                                                    }
                                                                    onError={
                                                                        console.log
                                                                    }
                                                                    disablePast
                                                                    format="yyyy/MM/dd HH:mm"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </AppAccordion>
                                <AppAccordion
                                    heading="Submit quote"
                                    key="accordSubmit"
                                >
                                    <Grid
                                        container
                                        spacing={4}
                                        direction="column"
                                    >
                                        <Grid
                                            xs={6}
                                            style={{
                                                width: '100%',
                                                paddingLeft: '6px',
                                            }}
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
                                        </Grid>
                                        <Grid xs={6}>
                                            <Button
                                                type="button"
                                                size="large"
                                                color="primary"
                                                variant="contained"
                                                onClick={handleSubmitClick}
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </AppAccordion>
                            </React.Fragment>
                        )}

                        {/* <div style={{ marginTop: 20 }}>
                                                {JSON.stringify(inputList)}
                                            </div> */}
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

export default CreateQuote;
