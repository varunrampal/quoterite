import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import { ModuleType } from '../enums/app-enums';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

interface IProps {
    moduleType: ModuleType;
    quoteDate?: Date;
    invoiceDate?: Date;
    orderDate?: Date;
    deliveryDate?: Date;
}

const AppTimeline: React.FC<IProps> = ({
    moduleType,
    quoteDate,
    invoiceDate,
    orderDate,
    deliveryDate,
}) => {
    const classes = useStyles();
    let currModule = '';

    switch (moduleType) {
        case 'QUOTE':
            currModule = ModuleType.Quote;
            break;
        case 'INVOICE':
            currModule = ModuleType.Invoice;
            break;
        case 'ORDER':
            currModule = ModuleType.Order;
            break;
        case 'DELIVERY':
            currModule = ModuleType.Delivery;
            break;
    }

    return (
        <Timeline align="alternate">
            <TimelineItem>
                {quoteDate && (
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                            <Moment format="YYYY/MM/DD">{new Date()}</Moment>
                        </Typography>
                    </TimelineOppositeContent>
                )}

                <TimelineSeparator>
                    {currModule === ModuleType.Quote ? (
                        <TimelineDot color="primary">
                            <AssignmentIcon />
                        </TimelineDot>
                    ) : (
                        <TimelineDot>
                            <AssignmentIcon />
                        </TimelineDot>
                    )}
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Quote
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                {invoiceDate && (
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                            <Moment format="YYYY/MM/DD">{new Date()}</Moment>
                        </Typography>
                    </TimelineOppositeContent>
                )}
                <TimelineSeparator>
                    {currModule === ModuleType.Invoice ? (
                        <TimelineDot color="primary">
                            <ListAltIcon />
                        </TimelineDot>
                    ) : (
                        <TimelineDot>
                            <ListAltIcon />
                        </TimelineDot>
                    )}

                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Invoice
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
            {orderDate && (
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                            <Moment format="YYYY/MM/DD">{new Date()}</Moment>
                        </Typography>
                    </TimelineOppositeContent>
                )}
                <TimelineSeparator>
                    {currModule === ModuleType.Order ? (
                        <TimelineDot color="primary">
                            <LocalMallIcon />
                        </TimelineDot>
                    ) : (
                        <TimelineDot>
                            <LocalMallIcon />
                        </TimelineDot>
                    )}
                    <TimelineConnector className={classes.secondaryTail} />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Order
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
            {deliveryDate && (
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                            <Moment format="YYYY/MM/DD">{new Date()}</Moment>
                        </Typography>
                    </TimelineOppositeContent>
                )}
                <TimelineSeparator>
                   
                        {currModule === ModuleType.Delivery ? (
                            <TimelineDot color="primary">
                                <LocalShippingIcon />
                            </TimelineDot>
                        ) : (
                            <TimelineDot>
                                <LocalShippingIcon />
                            </TimelineDot>
                        )}
                
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Delivery/Pickup
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    );
};

export default AppTimeline;
