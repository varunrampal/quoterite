import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import { ThemeProvider } from '@material-ui/core';
// import theme from './theme/admin-theme';
import Router from './router';

const App = () => {
    //  const routing = useRoutes(routes);

    // let routes;

    // routes = (
    //     <Switch>
    //         <Route path="/" exact>
    //             <Login />
    //         </Route>
    //         <Route path="/signup">
    //             <Signup />
    //         </Route>

    //         <Redirect to="/" />
    //     </Switch>
    // );
    // const [btnDoubleClick, setBtnDoubleClick] = useState(false);

    // const clickHander = () => {
    //     setBtnDoubleClick(true);
    // };
    return (
        //   <div className="App">
        //    <AppButton btnType="success"
        //              size="small"
        //              variant="contained"
        //              disabled={btnDoubleClick}
        //              onClick={() => clickHander()}
        //              >Click me</AppButton>
        //              <AppIConButton btnType="save" size="small" ariaLabel="save" ></AppIConButton>

        //  </div>
        // <BrowserRouter>
        //     <Suspense fallback={<div className="center">...Loading</div>}>
        //         {routes}
        //     </Suspense>
        // </BrowserRouter>
        // <ThemeProvider theme={theme}>
            <Router />
        // </ThemeProvider>

    );
};

export default App;
