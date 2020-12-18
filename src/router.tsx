import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import Login from './components/views/auth/login';
import Signup from './components/views/auth/signup';
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook';
import DashboardView from './components/views/admin/DashboardView';
import CustomerDashboardView from './components/views/customer/DashboardView';
import CustomerAccountView from './components/views/customer/AccountView';
import CustomerPropertiesView from './components/views/customer/ProprtiesListView';
import AdminLayoutRoute from './layouts/AdminLayout';
import NotFoundView from './components/views/errors/NotFoundView';
import ThemeProvider from './theme/ThemeProvider';
import CustomerListView from './components/views/admin/CustomerListView';

const Router = () => {
   
    let routes;
    const {
        token,
        login,
        logout,
        userId,
        userName,
        userEmail,
        userRole,
        newuser,
    } = useAuth();

    // function to guard the component for private access
    // const authGuard = (Component) => () => {
    //     return token ? <Component /> : <Redirect to="/" />;
    // };

    if (!token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else if (token && userRole === 1) {
      
        routes = (
            <ThemeProvider>
                <Switch>
                    <AdminLayoutRoute
                        path="/admin/dashboard"
                        component={DashboardView}
                    />
                    <AdminLayoutRoute
                        path="/customer/list"
                        component={CustomerListView}
                    />
                    <AdminLayoutRoute path="*" component={NotFoundView} />
                </Switch>
            </ThemeProvider>
        );
    } else if (token && userRole === 0) {
       
        routes = (
            <ThemeProvider>
                <Switch>
                    <AdminLayoutRoute
                        path="/customer/dashboard"
                        component={CustomerDashboardView}
                    />
                    <AdminLayoutRoute
                        path="/customer/account"
                        component={CustomerAccountView}
                        exact
                    />

                    <AdminLayoutRoute
                        path="/customer/account/manageproperties"
                        component={CustomerPropertiesView}
                        
                    />

                    <AdminLayoutRoute path="*" component={NotFoundView} />
                </Switch>
            </ThemeProvider>
        );
    }
    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                userRole: userRole,
                isNewUser: newuser,
                login: login,
                logout: logout,
            }}
        >
            <BrowserRouter>
                <Suspense fallback={<div className="center">...Loading</div>}>
                    {routes}
                </Suspense>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default Router;
