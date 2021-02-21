import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

interface IErrorProps {
    error: string;
    onClose: () => void;
}

const SyncErrorModal: React.FC<IErrorProps> = ({ error, onClose}) => {

    return (
        <div>
            <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
    
            >
               <MuiAlert elevation={6} variant="filled"  severity="error">{error}</MuiAlert>
            </Snackbar>
        </div>
    );
};

export default SyncErrorModal;
