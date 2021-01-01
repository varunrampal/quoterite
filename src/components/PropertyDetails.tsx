import { Box, IconButton, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IProperty } from '../types/appTypes';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { useConfirm } from 'material-ui-confirm';
import SuccessModal from './SuccessModal';
import { selectedProperty } from '../stores/property/PropertiesActions';
import { useDispatch } from 'react-redux';

const PropertDetails: React.FC<IProperty> = ({
    _id,
    address,
    email,
    phone,
    name,
}) => {
    const confirm = useConfirm();
    const [success, setSuccess] = useState<boolean>(false);
    const message = 'Property deleted successfully';
    const history = useHistory();
    const dispatch = useDispatch();

    //handle delete icon click
    const handleDelete = (item: string) => {
        confirm({
            description: `This will permanently delete property: ${item}.`,
        })
            .then(() => setSuccess(true))
            .catch(() => console.log('Deletion cancelled.'));
    };
    const clearSuccess = () => {
        setSuccess(false);
    };

    //handle quote icon click
    const handleQuote = (propertyId: string) => {
       
        dispatch(selectedProperty(propertyId));
        history.push('/customer/account/manageproperties/createquote');
    };

    const propertyAddress = `${address.street}, ${address.city}, ${address.state} ${address.postcode}`;
    return (
        <div style={{ width: '100%' }} key={_id}>
            <SuccessModal
                success={success}
                successMessage={message}
                onClear={clearSuccess}
            />

            <Box
                component="span"
                display="block"
                p={1}
                m={1}
                bgcolor="background.paper"
            >
                <strong>Address:</strong> {propertyAddress}
            </Box>
            <Box
                component="span"
                display="block"
                p={1}
                m={1}
                bgcolor="background.paper"
            >
                <strong>Phone:</strong> {phone}
            </Box>
            <Box
                component="span"
                display="block"
                p={1}
                m={1}
                bgcolor="background.paper"
            >
                <strong>Email:</strong> {email}
            </Box>
            <Box
                display="flex"
                justifyContent="flex-end"
                m={0}
                p={0}
                bgcolor="background.paper"
            >
                <Box>
                    <Tooltip title="Orders" arrow>
                        <IconButton
                            aria-label="orders"
                            onClick={() => alert('open order history page')}
                        >
                            <LocalMallIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box>
                    <Tooltip title="quotes" arrow>
                        <IconButton
                            aria-label="quotes"
                            onClick={() => alert('open quote history page')}
                        >
                            <AssignmentIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box>
                    <Tooltip title="Create new quote" arrow>
                        <IconButton
                            aria-label="create quotes"
                            onClick={() => handleQuote(_id)}
                        >
                            <PlaylistAddCheckIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box>
                    <Tooltip title="Edit property" arrow>
                        <IconButton
                            aria-label="edit"
                            onClick={() => alert('go to edit page')}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box>
                    <Tooltip title="Delete property" arrow>
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(name)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </div>
    );
};

export default PropertDetails;
