import * as React from 'react';
import { Theme } from '@material-ui/core/styles';
import { ButtonProps } from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

interface IButtonProps extends ButtonProps {
    classes: any;
    btnType: 'send' | 'save' | 'delete' | 'edit';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    ariaLabel?: string;
}

const styles = (theme: Theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
});

const AppIConButton: React.FC<IButtonProps> = ({
    btnType,
    variant,
    children,
    disabled,
    classes,
    ariaLabel,
    ...others
}) => {
    const getIcon = () => {
        switch (btnType) {
            case 'delete': {
                return <DeleteIcon />;
            }
            case 'edit': {
                return <EditIcon />;
            }
            case 'save': {
                return <SaveIcon/>
            }
            default: {
                return <EditIcon />;
            }
        }
    };
    return (
        <div className={classes.root}>
            <IconButton aria-label={ariaLabel}>
               {getIcon()}
            </IconButton>
        </div>
    );
};

export default withStyles(styles)(AppIConButton);
