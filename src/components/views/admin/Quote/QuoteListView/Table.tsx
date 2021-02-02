import React, { useContext, useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../../context/auth-context';
import { useHttpClient } from '../../../../../hooks/http-hook';
import SuccessModal from '../../../../SuccessModal';
import { IQuote } from '../../../../../types/appTypes';

const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
        marginRight: theme.spacing(2),
    },
}));

interface IProps {
    className?: string;
    quotes: IQuote[];
    totalRecords: number;
    limit: number;
    page: number;
    onPageChange: (newPage: number) => void;
    onRowsLimitChange: (newLimit: number) => void;
}

const QuoteTable: React.FC<IProps> = ({
    className,
    quotes,
    totalRecords,
    limit,
    page,
    onPageChange,
    onRowsLimitChange,
    ...rest
}) => {
    const classes = useStyles();

    const [custdata, setCustData] = useState(quotes);

    const auth = useContext(AuthContext);

    const {
        isLoading,
        error,
        success,
        sendRequest,
        clearError,
        clearSuccess,
    } = useHttpClient();

    const handleLimitChange = (event) => {
        onRowsLimitChange(event.target.value);
    };

    const handlePageChange = (event, newPage: number) => {
        onPageChange(newPage);
    };

    const handleQuoteClick = (quoteid) => {
        console.log(quoteid);
    };

    useEffect(() => {
        if (quotes.length > 0) {
            setCustData(quotes);
        }
    }, [quotes]);

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <PerfectScrollbar>
                <SuccessModal
                    success={success}
                    successMessage={'Customer status updated successfully'}
                    onClear={clearSuccess}
                />
                <Box minWidth={1050}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ref</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Delivery Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {custdata.map((data: IQuote) => (
                                <TableRow hover key={data.id}>
                                    <TableCell
                                       
                                    >
                                        <Link to={`quotedetails/${data.id}`} style={{ textDecoration: 'none' }}>
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {data.id}
                                               
                                            </Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{data.customerName}</TableCell>
                                    <TableCell>{data.customerEmail}</TableCell>
                                    <TableCell>{data.customerPhone}</TableCell>
                                    <TableCell>{data.transportType}</TableCell>
                                    <TableCell>{data.transportDate}</TableCell>

                                    <TableCell>
                                        <Chip
                                            color="primary"
                                            label={data.status}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={totalRecords}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[]}
                // rowsPerPageOptions={[5, 10]}
            />

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
