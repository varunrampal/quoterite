import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

interface IErrorProps {
    error: any;
    onClear: () => void;
}

const ErrorModal: React.FC<IErrorProps> = ({ error, onClear}) => {

    return (
        <div>
            <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={onClear}
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

export default ErrorModal;
