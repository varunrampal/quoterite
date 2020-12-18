import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { AuthContext } from '../../context/auth-context';
import {
    AppBar,
    Badge,
    Box,
    Hidden,
    IconButton,
    Toolbar,
    makeStyles,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { ThemeContext } from '../../theme/ThemeProvider';

const useStyles = makeStyles(() => ({
    root: {},
    avatar: {
        width: 60,
        height: 60,
    },
    logoText: {
        fontSize: '2vw',
        fontFamily: 'Roboto',
        color: '#FFFFFF',
        textAlign: 'center',
        textDecoration: 'none',
    },
}));

interface IProps {
    className?: string;
    onMobileNavOpen: () => void;
}

const TopBar: React.FC<IProps> = ({ className, onMobileNavOpen, ...rest }) => {
    const classes = useStyles();
    const [notifications] = useState([]);
    const [darkState, setDarkState] = useState(false);
    const auth = useContext(AuthContext);
    const setThemeName = useContext(ThemeContext);
    let logoLink;
    const handleThemeChange = () => {
        setDarkState(!darkState);
    };

    useEffect(() => {
        !darkState ? setThemeName('lightTheme') : setThemeName('darkTheme');
    }, [darkState, setThemeName]);

    if (auth.userRole === 0) {
        logoLink = '/customer/dashboard';
    } else if (auth.userRole === 1) {
        logoLink = '/admin/dashboard';
    }

    return (
        <AppBar
            className={clsx(classes.root, className)}
            elevation={0}
            {...rest}
        >
            <Toolbar>
                <RouterLink to={logoLink} style={{ textDecoration: 'none' }}>
                    {' '}
                    <div className={classes.logoText}>Quoterite</div>
                </RouterLink>
                <Box flexGrow={1} />
                <Hidden mdDown>
                    <IconButton color="inherit">
                        <Badge
                            badgeContent={notifications.length}
                            color="primary"
                            variant="dot"
                        >
                            <NotificationsIcon style={{ fill: 'white' }} />
                        </Badge>
                    </IconButton>
                    <Switch
                        checked={darkState}
                        aria-label="Toggle light/dark theme"
                        onChange={handleThemeChange}
                    />
                    <IconButton color="inherit" onClick={auth.logout}>
                        <InputIcon style={{ fill: 'white' }} />
                    </IconButton>
                </Hidden>

                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onMobileNavOpen}>
                        <MenuIcon style={{ fill: 'white' }} />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
