import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IProps {

    title: string;
    children: JSX.Element;
    open: boolean;
    setOpen: (status: boolean) => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<IProps> = ({ title, children, open, setOpen, onConfirm }) => {

    return (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="confirm-dialog"
        >
          <DialogTitle id="confirm-dialog">{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="secondary"
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
              color="default"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      );
    };
    export default ConfirmDialog;