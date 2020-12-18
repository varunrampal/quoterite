import React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import {Breadcrumbs, Chip, emphasize, Theme, withStyles} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
interface IProps extends RouteComponentProps<any> {}

const StyledBreadcrumb = withStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: theme.palette.grey[800],
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.grey[300],
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[300], 0.12),
      },
    },
  }))(Chip) as typeof Chip;

const AppBreadCrumb: React.FC<IProps> = (props) => {
    
    const results: string[] = [];
    const {history, location: {pathname}} = props;
    let pathnames = pathname.split("/").filter(x => x);
 
    pathnames.forEach((x: string) => {if (x.includes("customer") || x.includes("admin")) results.push(x)});
    pathnames = pathnames.filter((x: string) => x !== 'customer' && x !== 'admin');
     
    return(
    <Breadcrumbs aria-label = "breadcrumb" maxItems={4}>
        {  
            pathnames.length > 0 && !pathnames.includes('dashboard') ? (
               <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small"  style={{ color: '#000' }} />}
                onClick={() => history.push(`/${results[0]}/dashboard`)}
              />

            ):(
                <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small"  style={{ color: '#000' }}/>}
                
              />
            )
        }
       {
        
         pathnames.map((name, index) => {
              
              let displayName = '';

              switch (name) {
                case 'account':
                    displayName = 'Account';
                    break;
                case 'manageproperties':
                    displayName = 'Manage properties';
                    break;
              }

              if(name !== 'dashboard') {
                const routeTo = `/${results[0]}/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length -1;
                return isLast ? ( <StyledBreadcrumb
                    component="a"
                    href="#"
                    label={displayName}
                    key = {index}
                              
                  />):(
                  <StyledBreadcrumb
                  component="a"
                  href="#"
                  label={displayName}
                  key = {index}
                  onClick={() => history.push(routeTo)}
                                     
                />
                  );
             }
       })}
    </Breadcrumbs>
  );


}

export default withRouter(AppBreadCrumb);