import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
const Copyright: React.FC = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="http://wwww.finnso.online/">
                Finsso
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright