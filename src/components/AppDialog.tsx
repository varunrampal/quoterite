import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IProps {
    title: string,
    content: string,
    open: boolean,
    onClose: () => void
}

const AppDialog: React.FC<IProps> = ({title,content,open,onClose}) => {

  const handleClose = () => {
      onClose();
  };


  return (
    <div>
    
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="dialog-title">
         {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
         {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Ok
          </Button>
         
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default AppDialog;