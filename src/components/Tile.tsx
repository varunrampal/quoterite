import {
    CardActionArea,
    CardContent,
    Typography,
    Card,
    Grid,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import AppIcon from './AppIcon';

interface IProps {
    iconFontSize: 'small' | 'inherit' | 'default'  | 'large';
    iconColor: 'primary' | 'secondary';
    iconType: string;
    title: string;
    link: string;
  }
  
const Tile: React.FC<IProps> = ({iconColor, iconFontSize, iconType, title, link}) => {
    return (
        <Card>
            <CardActionArea component="div" disableRipple>
                <Link to={link}>
                    <CardContent>
                        <Grid
                            container
                            spacing={3}
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item xs={2}>
                             <AppIcon type={iconType} fontsize={iconFontSize} color={iconColor}></AppIcon>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="h6"
                                >
                                  {title}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card>
    );
};

export default Tile;
