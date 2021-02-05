import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    makeStyles,
    Chip,
    
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Link, useHistory } from 'react-router-dom';
import { IItem, IQuote,QuoteDetails } from '../../../../../types/appTypes';
import { selectedQuote } from '../../../../../stores/quotes/QuotesActions';

const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
        marginRight: theme.spacing(2),
    },
}));

interface IProps {
    className?: string;
    quotesItems: IItem[];
   
}

const QuoteTable: React.FC<IProps> = ({
    className,
    quotesItems,
    ...rest
}) => {
    const classes = useStyles();
    //const [custdata, setCustData] = useState(quotesItems);
    const history = useHistory();
    const dispatch = useDispatch();


    const handleQuoteClick = (quoteid) => {
        dispatch(selectedQuote(quoteid));
        history.push('/admin/quotedetails');
    };

    // useEffect(() => {
    //     if (quotesItems.length > 0) {
    //         setCustData(quotesItems);
    //     }
    // }, [quotesItems]);

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <PerfectScrollbar>
             
                <Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Quantity Requested</TableCell>
                                <TableCell>Stock</TableCell>
                                {/* <TableCell>Substitute</TableCell>
                                <TableCell>Quantity Available</TableCell>
                                <TableCell>Notes</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotesItems.map((data: IItem) => (
                                <TableRow hover key={data.id}>
                                    <TableCell><AddBoxIcon></AddBoxIcon></TableCell>
                                    <TableCell
                                       
                                    >
                                        <Link to='#' onClick={() => handleQuoteClick(data.id)}>
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {data.id}
                                               
                                            </Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.quantity}</TableCell>
                                    <TableCell>{data.stock}</TableCell>
                            
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
          
            {/* <ConfirmDialog
                title="Do you want to block/unbloack customer?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={}
            >
                Are you sure you want to delete this post?
            </ConfirmDialog> */}
        </Card>
    );
};

export default QuoteTable;
