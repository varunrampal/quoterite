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

const Login: React.FC = () => {
    const classes = styles();
    const history = useHistory();

    const {
        isLoading,
        error,
        sendRequest,
        clearError,
           } = useHttpClient();

    const auth = useContext(AuthContext);

    const loginUser = async (values: ILoginForm, resetForm: Function) => {
        try {
            const endpoint = process.env.REACT_APP_API_BASE_URL + 'user/login';
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

                if( responseData.results.userRole === 1) {
                    history.push('/admin/dashboard');
                } else  if( responseData.results.userRole === 0) {
                    history.push('/customer/dashboard');
                }
            }
        } catch (error) {
            if (error.code === 401) {
                resetForm({});
            }
        }
    };

    return (
        <div className={classes.container}>
            {isLoading && <LoadingSpinner asOverlay />}
            <ErrorModal error={error} onClear={clearError} />

            <main className={classes.main}>
                <CssBaseline />

                <Paper className={classes.paper}>
                    <div className={classes.logoText}>Quoterite</div>
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
                                        </Grid>
                                     
                                            <Grid item
                                             lg={10}
                                             md={10}
                                             sm={10}
                                             xs={10}
                                            >
                                             Don't have an account?{' '}<AppLink to = '/signup'  variant="body1"  color="inherit">Sign Up</AppLink>
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
