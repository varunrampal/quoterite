import React from 'react';
import clsx from 'clsx';
import {
    Avatar,
    Card,
    CardContent,
    Grid,
    Typography,
    makeStyles,
    colors,
} from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Person from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    },
    avatarRed: {
        backgroundColor: colors.red[600],
        height: 56,
        width: 56,
    },

    avatarMain: {
        backgroundColor: theme.palette.primary.main,
        height: 56,
        width: 56,
    },
    avatarGrey: {
      backgroundColor: colors.grey[600],
      height: 56,
      width: 56,
  },
  avatarCeyan: {
    backgroundColor: '#98e6e6',
    height: 56,
    width: 56,
},
avatarYellow: {
  backgroundColor: '#e6b800',
  height: 56,
  width: 56,
}
 
}));

interface IProps {
    className?: string;
    type: 'quote' | 'order' | 'invoice' | 'delivery' | 'customers';
    heading: string;
    content: number;
}

const Widget: React.FC<IProps> = ({
    className,
    type,
    heading,
    content,
    ...rest
}) => {
    const classes = useStyles();
    const avatar = () => {
        switch (type) {
            case 'quote':
                return (
                    <Avatar className={classes.avatarRed}>
                        <AssignmentIcon></AssignmentIcon>
                    </Avatar>
                );
            case 'invoice':
              return (
                <Avatar className={classes.avatarCeyan}>
                    <ListAltIcon></ListAltIcon>
                </Avatar>
            );
            case 'order':
              return (
                <Avatar className={classes.avatarMain}>
                    <LocalMallIcon></LocalMallIcon>
                </Avatar>
            );
            case 'delivery':
              return (
                <Avatar className={classes.avatarGrey}>
                    <LocalShippingIcon></LocalShippingIcon>
                </Avatar>
              );
            case 'customers':
              return (
                <Avatar className={classes.avatarYellow}>
                    <Person></Person>
                </Avatar>
              );
        }
    };

   return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <CardContent>
                <Grid container justify="space-between" spacing={3}>
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h6"
                        >
                            {heading}
                        </Typography>

                        <Typography color="textPrimary" variant="h3">
                            {content}
                        </Typography>
                    </Grid>
                    <Grid item>
                     {avatar()}
                    </Grid>
                </Grid>
                {/* <Box mt={3}>
          <LinearProgress
            value={75.5}
            variant="determinate"
          />
        </Box> */}
            </CardContent>
        </Card>
    );
};

export default Widget;
