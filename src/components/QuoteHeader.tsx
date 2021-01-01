import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from '@material-ui/core';
import React from 'react';
import { IProperty } from '../types/appTypes';

interface IProps {
    propertyObj: IProperty;
    type: string;
}

const QuoteHeader: React.FC<IProps> = ({ propertyObj, type }) => {
    const propertyAddress = `${propertyObj.address.street}, ${propertyObj.address.city}, ${propertyObj.address.state} ${propertyObj.address.postcode}`;
    return (
        <Grid container spacing={3}>
            <Grid item xs={8}>
                <Card>
                    <CardActionArea component="div" disableRipple>
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h1"
                            >
                                {propertyObj.name}
                            </Typography>
                            <Box m={1} p={2}>
                                <Grid item container direction="row">
                                    <Grid item xs={8}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            Property address
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            {propertyAddress}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} direction="row">
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            Contact details
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            {propertyObj.email}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            {propertyObj.phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card>
                    <CardActionArea component="div" disableRipple>
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h1"
                            >
                                Quote details
                            </Typography>
                            <Box m={1} p={2}>
                                <Grid item container direction="row">
                                    <Grid item xs={8}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            Quote number
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            1
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} direction="row">
                                        {type === 'new' ? (
                                            <React.Fragment>
                                                <Typography
                                                    gutterBottom
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    Date
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    component="p"
                                                >
                                                {new Date().toDateString()}
                                                </Typography>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <React.Fragment>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="h2"
                                                    >
                                                        Date
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        component="p"
                                                    >
                                                        12/12/2020
                                                    </Typography>
                                                </React.Fragment>
                                            </React.Fragment>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default QuoteHeader;
