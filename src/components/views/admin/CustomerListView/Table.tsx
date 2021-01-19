import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Switch from 'react-switch';
import {
    Box,
    Card,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { AuthContext } from '../../../../context/auth-context';
import { useHttpClient } from '../../../../hooks/http-hook';
import SuccessModal from '../../../SuccessModal';
import { ICustomer } from '../../../../types/appTypes';
import { REACT_APP_API_BASE_URL } from '../../../../utils/constants';
const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
        marginRight: theme.spacing(2),
    },
}));

interface IProps {
    className?: string;
    customers: ICustomer[];
    totalRecords: number;
    limit: number;
    page: number;
    onPageChange: (newPage: number) => void;
    onRowsLimitChange: (newLimit: number) => void;
}

const CustomerTable: React.FC<IProps> = ({
    className,
    customers,
    totalRecords,
    limit,
    page,
    onPageChange,
    onRowsLimitChange,
    ...rest
}) => {
    const classes = useStyles();
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>(
        [],
    );
    const [custdata, setCustData] = useState(customers);

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

    const handleSelectAll = (event) => {
        let newSelectedCustomerIds;

        if (event.target.checked) {
            newSelectedCustomerIds = customers.map((customer) => customer._id);
        } else {
            newSelectedCustomerIds = [];
        }

        setSelectedCustomerIds(newSelectedCustomerIds);
    };

    const handleSelectOne = (event, id: any) => {
        const selectedIndex = selectedCustomerIds.indexOf(id);
        let newSelectedCustomerIds: string[] = [];

        if (selectedIndex === -1) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(
                selectedCustomerIds,
                id,
            );
        } else if (selectedIndex === 0) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(
                selectedCustomerIds.slice(1),
            );
        } else if (selectedIndex === selectedCustomerIds.length - 1) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(
                selectedCustomerIds.slice(0, -1),
            );
        } else if (selectedIndex > 0) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(
                selectedCustomerIds.slice(0, selectedIndex),
                selectedCustomerIds.slice(selectedIndex + 1),
            );
        }

        setSelectedCustomerIds(newSelectedCustomerIds);
    };

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //    console.log(event.target.name);
    //   };

    // Status switch onchange handler
    const handleChange = (activeStatus: boolean, custId: string) => {
        
        let custs: ICustomer[] = [];

        const customerIndex = custdata.findIndex(function (customer, index) {
            return customer._id === custId;
        });

        custs = [...custdata];
        let customer = { ...custs[customerIndex] };
        customer.active = !activeStatus;
        custs[customerIndex] = customer;

        changeCustomerStatus(custId, !activeStatus, custs);
    };

    const changeCustomerStatus = async (
        custId: string,
        status: boolean,
        custs: ICustomer[],
    ) => {
        try {
            const endpoint = REACT_APP_API_BASE_URL + 'user/update';

            sendRequest(
                endpoint,
                'POST',
                JSON.stringify({
                    id: custId,
                    active: status,
                }),
                {
                    Authorization: 'Bearer ' + auth.token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            ).then((response) => {
                setCustData(custs);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (customers.length > 0) {
            setCustData(customers);
        }
    }, [customers]);

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
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={
                                            selectedCustomerIds.length ===
                                            customers.length
                                        }
                                        color="primary"
                                        indeterminate={
                                            selectedCustomerIds.length > 0 &&
                                            selectedCustomerIds.length <
                                                customers.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>

                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {custdata.map((data: ICustomer) => (
                                <TableRow hover key={data._id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={
                                                selectedCustomerIds.indexOf(
                                                    data._id,
                                                ) !== -1
                                            }
                                            onChange={(event) =>
                                                handleSelectOne(event, data._id)
                                            }
                                            value="true"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box alignItems="center" display="flex">
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {data.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{data.email}</TableCell>
                                    <TableCell>{data.phone}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={data.active}
                                            onChange={() => {
                                                handleChange(
                                                    data.active,
                                                    data._id,
                                                );
                                            }}
                                            key={data._id}
                                            data-id={`${data._id}`}
                                            handleDiameter={30}
                                            uncheckedIcon={false}
                                            checkedIcon={true}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={20}
                                            width={48}
                                            onColor="#CCCCCC"
                                            offColor="#CC4646"
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

export default CustomerTable;
