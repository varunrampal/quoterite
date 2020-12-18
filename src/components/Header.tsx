import {
 Typography,
 
} from '@material-ui/core';
import React from 'react'

interface IProps {
    heading: string;
    breadCrum?: string;
    class?: string;
}

const Heading: React.FC<IProps> = ({heading}) => {
  return (
    <div>
      <Typography
              color="textSecondary"
              gutterBottom
              variant="h1"
            >
            {heading}
            </Typography>
          
    </div>
  )
}

export default Heading;