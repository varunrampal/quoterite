import React, { ReactNode } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '90%',
      padding: theme.spacing(1, 1),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

interface IProps {

    heading: string;
    children: ReactNode;
    key: string;
}

const AppAccordion: React.FC<IProps> = ({heading, children, key}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion key = {key}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id={key}
        >
          <Typography className={classes.heading}>{heading}</Typography>
        </AccordionSummary>
        <AccordionDetails>
         {children}
        </AccordionDetails>
      </Accordion>
      
    </div>
  );
}

export default AppAccordion;