import * as React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { ButtonProps } from '@material-ui/core/Button';
import { green, red, blue, purple } from '@material-ui/core/colors';
import classNames from 'classnames';

interface IButtonProps extends ButtonProps {
    classes: any;
    btnCat?: 'success' | 'danger' | 'login';
    variant: 'contained' | 'outlined';
    size: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    disabled?: boolean;
}

const styles = (theme: Theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    success: {
        color: '#FFFFFF',
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: green[500],
            },
        },
    },
    danger: {
        color: '#FFFFFF',
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: red[500],
            },
        },
    },
    login: {
        color: '#FFFFFF',
        backgroundColor: purple[500],
        '&:hover': {
            backgroundColor: purple[700],
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: purple[500],
            },
        },
    },
    default: {
        color: '#FFFFFF',
        backgroundColor: blue[500],
        '&:hover': {
            backgroundColor: blue[700],
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: blue[500],
            },
        },
    },
});

const AppButton: React.FC<IButtonProps> = ({
    btnCat,
    type,
    variant,
    children,
    disabled,
    classes,
    ...others
}) => {
    const getClass = () => {
        switch (btnCat) {
            case 'success': {
                return classNames(classes.button, classes.success);
            }
            case 'danger': {
                return classNames(classes.button, classes.danger);
            }
            case 'login': {
                return classNames(classes.button, classes.login);
            }
            default: {
                return classNames(classes.button, classes.blue);
            }
        }
    };
    return (
        <div>
            <Button
                type= {type}
                variant={variant}
                className={getClass()}
                disabled={disabled}
                {...others}
            >
                {children}
            </Button>
        </div>
    );
};

export default withStyles(styles)(AppButton);
