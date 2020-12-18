import React from 'react';
import Icon, { IconProps } from '@material-ui/core/Icon';

interface IProps extends IconProps {
    fontsize: 'small' | 'inherit' | 'default'  | 'large';
    color: 'primary' | 'secondary';
    type: string;
}

const AppIcon: React.FC<IProps> = ({fontsize, color, type}) => {

  return (
    <Icon  fontSize={fontsize} 
    color={color}>{type}</Icon>
  );
}

export default AppIcon