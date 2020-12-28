import { Box, Grid, IconButton, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { IProperty } from '../types/appTypes';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useConfirm } from 'material-ui-confirm';
import SuccessModal from './SuccessModal';
const PropertDetails: React.FC<IProperty> = ({
    __id,
    address,
    email,
    phone,
    name
}) => {
    const confirm = useConfirm();
    const [success, setSuccess] = useState<boolean>(false);
    const message = 'Property deleted successfully';

    const handleDelete = (item: string) => {
        
        confirm({ description: `This will permanently delete property: ${item}.` })
            .then(() =>  setSuccess(true))
            .catch(() => console.log('Deletion cancelled.'));
    };
    const clearSuccess = () => {
        setSuccess(false);
     
    };

    const handleQuote = (propertyId: string) => {

          alert('go to create quote page');
    }

    const propertyAddress = `${address.street}, ${address.city}, ${address.state} ${address.postcode}`;
    return (
        <div style={{ width: '100%' }} key={__id}>
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
                <Tooltip title="Create quote" arrow>
                    <IconButton aria-label="quote" onClick={() => handleQuote(__id)}>
                        <AssignmentIcon />
                    </IconButton>
                    </Tooltip>
                   
                </Box>
                <Box>
                    <Tooltip title="Edit" arrow>
                        <IconButton
                            aria-label="edit"
                            onClick={() => alert('go to edit page')}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box>
                <Tooltip title="Delete" arrow>
                    <IconButton aria-label="delete" onClick={() => handleDelete(name)}>
                        <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                   
                </Box>
              
            </Box>
        </div>
    );
};

export default PropertDetails;
