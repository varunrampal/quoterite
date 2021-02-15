import React, { useContext } from 'react';
import { createStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { TextField, Theme, makeStyles, Grid } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import AccountCircleRounded from '@material-ui/icons/AccountCircleRounded';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '../../../ui/Button';
import { green } from '@material-ui/core/colors';
import loginBg from '../../../assets/site-logo.png';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import ErrorModal from '../../../ui/ErrorModal';
import { AuthContext } from '../../../context/auth-context';
import withErrorBoundary from '../../../hoc/withErrorBoundary';
import AppLink from '../../AppLink';
import { REACT_APP_API_BASE_URL } from '../../../utils/constants';
import Background from '../../../assets/login-bg.jpg';
import { GoogleLogin } from 'react-google-login';

//TODO: try to refactor using example from medium subscription
const styles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            [theme.breakpoints.down('xs')]: {
                width: '90%',
                margin: 'auto',
            },
        },
        image: {
            backgroundImage: `url(${Background})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light'
                    ? theme.palette.grey[50]
                    : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        logo: {
            position: 'relative',
            width: '40%',
            height: '100%',
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        logoText: {
            fontSize: '2vw',
            fontFamily: 'Roboto',
            color: '#4CAF50',
            textAlign: 'center',
        },
        main: {
            width: 'auto',
            display: 'block',
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            [theme.breakpoints.up(400 + theme.spacing(6))]: {
                width: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        paper: {
            marginTop: theme.spacing(1),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${theme.spacing(2)}px ${theme.spacing(
                3,
            )}px ${theme.spacing(3)}px`,
        },
        avatar: {
            margin: theme.spacing(),
            backgroundColor: green[500],
            width: 100,
            height: 100,
            fontSize: 110,
        },
        textField: {
            '& > *': {
                width: '100%',
            },
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(),
        },

        submitButton: {
            marginTop: '10px',
        },

        googleButton: {
            marginTop: '10px',
            width:'100%',
            fontSize: '16px'
        }
    }),
);

export interface ILoginForm {
    email?: string;
    password?: string;
}

const initialFormValues: ILoginForm = {
    email: '',
    password: '',
};

const formValidationSchema = Yup.object().shape({
    email: Yup.string().email().required('Please enter your register email-id'),
    password: Yup.string().required('Please enter your password'),
});

const clientId =
    '639444473821-rs05mdbi48kl5bhl3jd3q73ucviqnp8r.apps.googleusercontent.com';

const Login: React.FC = () => {
    const classes = styles();
    const history = useHistory();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const auth = useContext(AuthContext);

    const loginUser = async (values: ILoginForm, resetForm: Function) => {
        try {
            // const endpoint = process.env.REACT_APP_API_BASE_URL + 'user/login';

            const endpoint = `${REACT_APP_API_BASE_URL}/user/login`;
            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
                {
                    'Content-Type': 'application/json',
                },
            );
            resetForm({});

            if (responseData.code !== 401) {
                auth.login(
                    responseData.results.userId,
                    responseData.results.userName,
                    responseData.results.userEmail,
                    responseData.results.userRole,
                    false,
                    responseData.results.token,
                );

                if (responseData.results.userRole === 1) {
                    history.push('/admin/dashboard');
                } else if (responseData.results.userRole === 0) {
                    history.push('/customer/dashboard');
                }
            }
        } catch (error) {
            if (error.code === 401) {
                resetForm({});
            }
        }
    };
    const handleGoogleLogin = (user) => {
  
        const userObj = {
            name: user.profileObj.name,
            email: user.profileObj.email,
            password:user.profileObj.email,
            phone: 123,
            type: 'GOOGLE'
        }
        createNewUser(userObj);
    };

    const handleGoogleLoginFailure = (err) => {
       console.log(err);
    };
    const createNewUser = async (userObj) => {
        try {
            const endpoint = `${REACT_APP_API_BASE_URL}/user/signup`;
            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify({
                    name: userObj.name,
                    email: userObj.email,
                    password: userObj.password,
                    phone: userObj.phone,
                    type: userObj.type
                }),
                {
                    'Content-Type': 'application/json',
                },
            );
            auth.login(
                responseData.results.userId,
                responseData.results.userName,
                responseData.results.userEmail,
                responseData.results.userRole,
                true,
                responseData.results.token,
            );
            
            history.push('/customer/dashboard');
                 
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={classes.container}>
            {isLoading && <LoadingSpinner asOverlay />}
            <ErrorModal error={error} onClear={clearError} />

            <main className={classes.main}>
                <CssBaseline />

                <Paper className={classes.paper} elevation={6} square>
                    <div className={classes.logoText}>Finnso</div>
                    <Avatar className={classes.avatar}>
                        <AccountCircleRounded fontSize="inherit" />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Formik
                        initialValues={initialFormValues}
                        onSubmit={(values: ILoginForm, actions) => {
                            loginUser(values, actions.resetForm);
                        }}
                        validationSchema={formValidationSchema}
                    >
                        {(props: FormikProps<ILoginForm>) => {
                            const {
                                values,
                                touched,
                                errors,
                                handleBlur,
                                handleChange,
                                isSubmitting,
                            } = props;
                            return (
                                <Form>
                                    <Grid
                                        container
                                        justify="space-around"
                                        direction="row"
                                    >
                                        <Grid
                                            item
                                            lg={10}
                                            md={10}
                                            sm={10}
                                            xs={10}
                                            className={classes.textField}
                                        >
                                            <TextField
                                                name="email"
                                                id="email"
                                                label="Email-id"
                                                value={values.email}
                                                type="email"
                                                helperText={
                                                    errors.email &&
                                                    touched.email
                                                        ? errors.email
                                                        : 'Enter email-id'
                                                }
                                                error={
                                                    errors.email &&
                                                    touched.email
                                                        ? true
                                                        : false
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={10}
                                            md={10}
                                            sm={10}
                                            xs={10}
                                            className={classes.textField}
                                        >
                                            <TextField
                                                name="password"
                                                id="password"
                                                label="Password"
                                                value={values.password}
                                                type="password"
                                                helperText={
                                                    errors.password &&
                                                    touched.password
                                                        ? 'Please enter your password'
                                                        : 'Enter your password'
                                                }
                                                error={
                                                    errors.password &&
                                                    touched.password
                                                        ? true
                                                        : false
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={11}
                                            className={classes.submitButton}
                                        >
                                            <Button
                                                btnCat="success"
                                                type="submit"
                                                size="large"
                                                fullWidth
                                                variant="contained"
                                                disabled={isSubmitting}
                                            >
                                                Login
                                            </Button>
                                            <Grid  item
                                            xs={12}
                                            className={classes.submitButton}>
                                                <GoogleLogin
                                                    clientId={clientId}
                                                    buttonText="Login with Google&nbsp;&nbsp;"
                                                    onSuccess={
                                                        handleGoogleLogin
                                                    }
                                                    onFailure={
                                                        handleGoogleLoginFailure
                                                    }
                                                    cookiePolicy={
                                                        'single_host_origin'
                                                    }
                                                    //isSignedIn={true}
                                                     className = {classes.googleButton}                                       
                                                ></GoogleLogin>
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            item
                                            lg={10}
                                            md={10}
                                            sm={10}
                                            xs={10}
                                        >
                                            Don't have an account?{' '}
                                            <AppLink
                                                to="/signup"
                                                variant="body1"
                                                color="inherit"
                                            >
                                                Sign Up
                                            </AppLink>
                                        </Grid>
                                    </Grid>
                                </Form>
                            );
                        }}
                    </Formik>
                    
                </Paper>
            </main>
        </div>
    );
};
export default withErrorBoundary(Login);
