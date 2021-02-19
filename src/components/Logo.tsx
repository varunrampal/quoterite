import React from 'react';

interface IProps {
  type: "main" | "inner"
}

const Logo: React.FC<IProps> = ({type}) => {
  return (
    <React.Fragment>
    { 
      type === 'main'? ( <img
        alt="Logo"
        src="/static/images/site_logo.png"
      />): ( <img
        alt="Logo"
        src="/static/images/site_logo_inner.png"
      />)
    }
    </React.Fragment>
   
  );
};

export default Logo;
