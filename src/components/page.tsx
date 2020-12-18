import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
  interface IProps {
    children: ReactNode
    title: string,
    className: string

  }

  export type Ref = HTMLDivElement;

const Page = React.forwardRef<
  Ref, 
  IProps
>((props, ref) => {
    return (
        <div
          ref={ref}
          {...props}
          className = {props.className}
        
        >
          <Helmet>
            <title>{props.title}</title>
          </Helmet>
        {props.children}
        </div>
      );
    });
    

export default Page;