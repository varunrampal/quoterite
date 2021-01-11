import React, { useContext, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    IconButton,
    makeStyles,
    Radio,
    TextField,
    Tooltip,
} from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import _, { xor } from 'lodash';
import { useHttpClient } from '../../../../hooks/http-hook';
import { AuthContext } from '../../../../context/auth-context';
import Page from '../../../page';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import Heading from '../../../Header';
import AppBreadCrumb from '../../../AppBreadCrumb';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../stores/root-reducer';
import { IProperty } from '../../../../types/appTypes';
import QuoteHeader from '../../../QuoteHeader';
import AppTimeLine from '../../../AppTimeLine';
import { ModuleType, OrderType } from '../../../../enums/app-enums';
import Button from '../../../../ui/Button';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Scrollbars } from 'rc-scrollbars';
import AppDialog from '../../../AppDialog';
import { REACT_APP_API_BASE_URL, ITEMTYPE } from '../../../../utils/constants';
import { IItem } from '.././../../../types/appTypes';
import AppAccordion from '../../../AppAcordion';
import { InlineDateTimePicker } from 'material-ui-pickers';

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
    const { isLoading, sendRequest } = useHttpClient();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogContent, setDialogContent] = useState<string>('');
    const [items, setItems] = useState<IItem[]>([]);
    const [inputList, setInputList] = useState<IItem[]>([]);
    const [orderType, setOrderType] = React.useState<any>(OrderType.Delivery);
    const [selectedDeliveryDate, handleDeliveryDate] = useState(null);
    const [selectedPickupDate, handlePickupDate] = useState(null);

    const dialogTitle ='Alert';
    let selectedItem: IItem = { id: 0, name: '', qty: 0 };

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
                let item: IItem = { id: 0, name: '', qty: 0 };
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
                `Enter new ${ITEMTYPE.toLowerCase()} name to search`,
            );
            setOpenDialog(true);
        }
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle input change
    const handleInputChange = (e, index) => {

        const val = e.target.value.replace(/\D/g, "");
        e.target.value= val;

        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = Number(value);
        setInputList(list);
    };

    const handleSubmitClick = async () => {
        if (inputList.length > 0) {
           
             let invalidQty = inputList.some(
                (x) => x.qty === undefined || x.qty === 0);

            if (invalidQty) {
                setDialogContent(
                    `Quantity should be greater than 0 and a whole number`,
                );
                setOpenDialog(true);
            }
            else{
                console.log(inputList);
                console.log(orderType);

                if(orderType === OrderType.Delivery && selectedDeliveryDate === null){
                    setDialogContent(
                        `Please select the delivery date`,
                    );
                    setOpenDialog(true);
                } else if(orderType === OrderType.Pickup && selectedPickupDate === null) {
                    setDialogContent(
                        `Please select the delivery date`,
                    );
                    setOpenDialog(true);
                } else if(orderType === OrderType.Delivery){

                     console.log(selectedDeliveryDate);
                }else if(orderType === OrderType.Pickup){

                    console.log(selectedPickupDate);
               }

            }
        }
    };

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
                                                height: '44px',
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
                                            style={{ height: 44 }}
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
                                                        height: 220,
                                                    }}
                                                >
                                                    <Box
                                                        m={1}
                                                        p={1}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        {isLoading && (
                                                            <LoadingSpinner
                                                                asOverlay
                                                            />
                                                        )}
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
                                                                                name="qty"
                                                                                type="number"
                                                                                value={
                                                                                    x.qty
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
                                                                                defaultValue={0}
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
                            <Box m={2} p={1}>
                                <Grid container spacing={1}>
                                    <Grid xs={6}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                aria-label="ordermode"
                                                name="ordermode"
                                                value={orderType}
                                                onChange={handleChange}
                                            >
                                                <Grid container spacing={1}>
                                                    <Grid xs={6}>
                                                        <FormControlLabel
                                                            value={OrderType.Delivery}
                                                            control={<Radio />}
                                                            label="Delivery"
                                                        />
                                                    </Grid>
                                                    <Grid xs={6}>
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
                                                    <Grid xs={6}>
                                                        <FormControlLabel
                                                            value={OrderType.Pickup}
                                                            control={<Radio />}
                                                            label="Pickup"
                                                        />
                                                    </Grid>
                                                    <Grid xs={6}>
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
                                <Box m={2} alignItems="right">
                                    <Button
                                        type="button"
                                        size="large"
                                        color="primary"
                                        variant="contained"
                                        onClick={handleSubmitClick}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
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
                    onClose={handleDialogClose}
                ></AppDialog>
            </Container>
        </Page>
    );
};

export default CreateQuote;
