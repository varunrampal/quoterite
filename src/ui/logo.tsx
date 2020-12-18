import React from 'react';

const Logo: React.FC<{}> = ({...props}) => {
  return (
    <img
      alt="Logo"
      src="/static/logo.png"
     height="110px"
     width="80px"
      {...props}
    />
  );
};

export default Logo;
