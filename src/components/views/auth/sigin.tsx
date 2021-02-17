import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import AppButton from '../../../ui/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField, Theme, makeStyles, Grid } from '@material-ui/core';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withErrorBoundary from '../../../hoc/withErrorBoundary';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import ErrorModal from '../../../ui/ErrorModal';
import { AuthContext } from '../../../context/auth-context';
import AppLink from '../../AppLink';
import { REACT_APP_API_BASE_URL } from '../../../utils/constants';
import Background from '../../../assets/login-background.jpg';
import { GoogleLogin } from 'react-google-login';
import { green } from '@material-ui/core/colors';
import Copyright from '../../CopyRight';



const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(/static/images/login-background.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    googleButton: {
        marginTop: '10px',
        width: '100%',
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: green[500],
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export interface ILoginForm {
    email?: string;
    password?: string;
}

const initialFormValues: ILoginForm = {
    email: '',
    password: '',
};

const formValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter your registered email-id'),
    password: Yup.string().required('Please enter your password'),
});

const clientId =
    '639444473821-rs05mdbi48kl5bhl3jd3q73ucviqnp8r.apps.googleusercontent.com';

const SignIn: React.FC = () => {
    const classes = useStyles();
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
            password: user.profileObj.email,
            phone: 123,
            type: 'GOOGLE',
        };
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
                    type: userObj.type,
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
        <Grid container component="main" className={classes.root}>
            {isLoading && <LoadingSpinner asOverlay />}
            <ErrorModal error={error} onClear={clearError} />

            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
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
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={values.email}
                                        type="email"
                                        helperText={
                                            errors.email && touched.email
                                                ? errors.email
                                                : 'Enter email-id'
                                        }
                                        error={
                                            errors.email && touched.email
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        helperText={
                                            errors.password && touched.password
                                                ? 'Please enter your password'
                                                : 'Enter your password'
                                        }
                                        error={
                                            errors.password && touched.password
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {/* <FormControlLabel
                                        control={
                                            <Checkbox
                                                value="remember"
                                                color="primary"
                                            />
                                        }
                                        label="Remember me"
                                    /> */}
                                   
                                    <AppButton
                                        btnCat="success"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                        variant="contained"
                                        disabled={isSubmitting}
                                    >
                                        Login
                                    </AppButton>
                                    <GoogleLogin
                                        clientId={clientId}
                                        buttonText="Login with Google&nbsp;&nbsp;"
                                        onSuccess={handleGoogleLogin}
                                        onFailure={handleGoogleLoginFailure}
                                        cookiePolicy={'single_host_origin'}
                                        //isSignedIn={true}
                                        className={classes.googleButton}
                                    ></GoogleLogin>
                                    <Grid container>
                                        <Grid item xs>
                                            <Link href="#" variant="body2">
                                                Forgot password?
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <AppLink
                                                to="/signup"
                                                variant="body2"
                                                color="primary"
                                            >
                                                Don't have an account? Sign Up
                                            </AppLink>
                                        </Grid>
                                    </Grid>
                                    <Box mt={5}>
                                        <Copyright />
                                    </Box>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </Grid>
        </Grid>
    );
};

export default withErrorBoundary(SignIn);
