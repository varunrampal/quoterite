import React, { useState } from 'react';

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    makeStyles,
    Collapse,
    TableContainer,
    Paper,
    TextField,
    Grid,
    ButtonBase,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Scrollbars } from 'rc-scrollbars';
import { Link } from 'react-router-dom';
import { IItem } from '../../../../../types/appTypes';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
            flexGrow: 1,
        },
    },
    cellTextRed: {
        color: '#FF0000',
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
});

interface IProps {
    className?: string;
    quotesItems: IItem[];
    totalAmount: number;
    onChange: (
        e: any,
        index: number,
        id: number,
        stock: number,
        price: number,
        qtyallotted: number,
        type: string,
    ) => void;
}

const QuoteTable: React.FC<IProps> = ({
    className,
    quotesItems,
    totalAmount,
    onChange,
    ...rest
}) => {
    const GSTRate = 5;
    const PSTRate = 7;
    return (
        <TableContainer component={Paper}>
            <Scrollbars
                style={{
                    width: '100%',
                }}
                autoHide
                autoHeight
                autoHeightMin={0}
                autoHeightMax={600}
            >
                <Table stickyHeader aria-label="quote items table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {/* <TableCell align="right">Id</TableCell> */}
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Qty Requested</TableCell>
                            <TableCell align="right">Qty available</TableCell>
                            <TableCell align="right">Qty allotted</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quotesItems.map((item, index) => (
                            <Row
                                key={item.name}
                                row={item}
                                index={index}
                                onChange={onChange}
                            />
                        ))}
                        <TableRow>
                            <TableCell rowSpan={7} />
                            <TableCell colSpan={5}>
                                {' '}
                                <strong>Subtotal</strong>
                            </TableCell>
                            <TableCell align="right">
                                <strong> ${totalAmount.toFixed(2)}</strong>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <strong>Tax</strong>(
                                {`PST ${PSTRate}% + GST ${GSTRate}%`})
                            </TableCell>
                            <TableCell align="right">{`${(
                                PSTRate + GSTRate
                            ).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">
                                <strong>
                                    $
                                    {(
                                        (totalAmount * (PSTRate + GSTRate)) /
                                        100
                                    ).toFixed(2)}
                                </strong>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5}>
                                <strong>Total</strong>
                            </TableCell>
                            <TableCell align="right">
                                <strong>
                                    $
                                    {`${(
                                        (totalAmount * (PSTRate + GSTRate)) /
                                            100 +
                                        totalAmount
                                    ).toFixed(2)}`}
                                </strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Scrollbars>
        </TableContainer>
    );
};

function Row(props: {
    row: IItem;
    index: number;
    onChange: (
        e: any,
        index: number,
        id: number,
        stock: number,
        price: number,
        qtyalloted: number,
        type: string,
    ) => void;
}) {
    const { row, index, onChange } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    // handle input change
    const handleQtyInputChange = (e, index, id, stock, price, qtyAllotted) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
        qtyAllotted = val;
        if (parseInt(e.target.value) > parseInt(stock)) {
            e.target.value = stock;
        } else {
            onChange(e, index, id, stock, price, e.target.value, 'qty');
        }
    };

    const handlePriceInputChange = (e, index, id, stock, qtyAllotted) => {
        let allotedQty = qtyAllotted === undefined ? 0 : qtyAllotted;
        onChange(e, index, id, stock, e.target.value, allotedQty, 'price');
    };
    const handleSubstituteClick = (xyz) => {};

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                {/* <TableCell align="right">{row.id}</TableCell> */}
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                {row.stock === 0 ? (
                    <TableCell align="right" className={classes.cellTextRed}>
                        {row.stock}
                    </TableCell>
                ) : (
                    <TableCell align="right">{row.stock}</TableCell>
                )}

                <TableCell align="right">
                    <TextField
                        name="qtyallotted"
                        type="number"
                        variant="standard"
                        size="small"
                        defaultValue={0}
                        value={row.qtyallotted}
                        InputProps={{
                            inputProps: {
                                startAdornment: '$',
                                max: `${row.stock}`,
                                min: 1,
                            },
                        }}
                        style={{ width: 50 }}
                        onChange={(e) =>
                            handleQtyInputChange(
                                e,
                                index,
                                row.id,
                                row.stock,
                                row.price,
                                row.qtyallotted,
                            )
                        }
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        name="price"
                        variant="standard"
                        size="small"
                        defaultValue={0}
                        value={row.price}
                        style={{ width: 50 }}
                        InputProps={{
                            inputProps: {
                                max: 10000,
                                min: 0,
                            },
                        }}
                        onChange={(e) =>
                            handlePriceInputChange(
                                e,
                                index,
                                row.id,
                                row.stock,
                                row.qtyallotted,
                            )
                        }
                    />
                </TableCell>
                {row.totalprice === undefined ? (
                    <TableCell align="right">$0</TableCell>
                ) : (
                    <TableCell align="right">${row.totalprice}</TableCell>
                )}
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <ButtonBase className={classes.image}>
                                        <img
                                            className={classes.img}
                                            alt="item pic"
                                            src={`/static/images/items/${row.name}.jpg`}
                                        />
                                    </ButtonBase>
                                </Grid>
                                <Grid item xs={12} sm container>
                                    <Grid
                                        item
                                        xs
                                        container
                                        direction="column"
                                        spacing={2}
                                    >
                                        <Grid item xs>
                                            <Typography
                                                gutterBottom
                                                variant="subtitle1"
                                            >
                                                Common Name: {row.commonName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                gutterBottom
                                            >
                                                ID: {row.id}
                                            </Typography>
                                            <Typography variant="body2">
                                                Latest price: $2.50
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <Typography
                                                        variant="body2"
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Substitute:
                                                    </Typography>
                                                    <Grid item>
                                                        <Link
                                                            to="#"
                                                            onClick={() =>
                                                                handleSubstituteClick(
                                                                    'xyz'
                                                                )
                                                            }
                                                        >
                                                            <Typography
                                                                color="textPrimary"
                                                                variant="body1"
                                                            >
                                                                XYZ
                                                            </Typography>
                                                        </Link>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id="notes"
                                            label="Notes"
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            style={{ width: 200 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default QuoteTable;
