import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

interface props {
    success: boolean,
    successMessage: string,
    onClear: () => void
  
  
  }
const SuccessModal: React.FC<props> = (props) => {

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }
  return (
    <div>
  
    <Snackbar
      open={!!props.success} 
      autoHideDuration={5000}
      onClose={props.onClear}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
     
     
    >
      <Alert onClose={props.onClear} severity='success'>
       {props.successMessage}
      </Alert>
    </Snackbar>
    </div>
  );
};

export default SuccessModal;
