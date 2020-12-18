import React, { useContext } from 'react';
import {
    Grid,
    TextField,
    makeStyles,
    createStyles,
    Theme,
    CssBaseline,
    Avatar,
    Paper,
    Typography,
} from '@material-ui/core';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useHttpClient } from '../../../hooks/http-hook';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import ErrorModal from '../../../ui/ErrorModal';
import { AccountCircleRounded } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import loginBg from '../../../assets/site-logo.png';
import Button from '../../../ui/Button';
import AppLink from '../../AppLink';

const useStyles = makeStyles((theme: Theme) =>
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

interface ISignUpForm {
    name: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string
}

interface IFormStatus {
    message: string;
    type: string;
}

const SignUp: React.FunctionComponent = () => {
    const classes = useStyles();
  
     const {
        isLoading,
        error,
        sendRequest,
        clearError,
         } = useHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const createNewUser = async (values: ISignUpForm, resetForm: Function) => {
        try {
            const endpoint = process.env.REACT_APP_API_BASE_URL + 'user/signup';
            const responseData = await sendRequest(
                endpoint,
                'POST',
                JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    phone: values.phone
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
            <Formik
                initialValues={{
                    name: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    phone: ''
                }}
                onSubmit={(values: ISignUpForm, actions) => {
                    createNewUser(values, actions.resetForm);
                    setTimeout(() => {
                        actions.setSubmitting(false);
                    }, 500);
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email()
                        .required('Enter valid email-id'),
                    name: Yup.string().required('Please enter full name'),
                    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
                    password: Yup.string()
                        .matches(
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/,
                        )
                        .required(
                            'Please valid password. Minium length 8, One uppercase, one lowercase, one special character and no spaces',
                        ),
                    confirmPassword: Yup.string()
                        .required('Required')
                        .test(
                            'password-match',
                            'Password musth match',
                            function (value) {
                                return this.parent.password === value;
                            },
                        ),
                })}
            >
                {(props: FormikProps<ISignUpForm>) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        isSubmitting,
                    } = props;
                    return (
                        <Paper className={classes.paper}>
                    <div className={classes.logoText}>Quoterite</div>
                    <Avatar className={classes.avatar}>
                        <AccountCircleRounded fontSize="inherit" />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Signup
                    </Typography>
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
                                        name="name"
                                        id="name"
                                        label="Full Name"
                                        value={values.name}
                                        type="text"
                                        helperText={
                                            errors.name && touched.name
                                                ? errors.name
                                                : 'Enter your full name.'
                                        }
                                        error={
                                            errors.name && touched.name
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
                                            errors.password && touched.password
                                                ? 'Please valid password. Minimum length 8, One uppercase, one lowercase, one special character and no spaces'
                                                : 'Minimum length 8, One uppercase, one lowercase, one special character and no spaces'
                                        }
                                        error={
                                            errors.password && touched.password
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
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        label="Confirm password"
                                        value={values.confirmPassword}
                                        type="password"
                                        helperText={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                                ? errors.confirmPassword
                                                : 'Re-enter password to confirm'
                                        }
                                        error={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
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
                                        name="email"
                                        id="email"
                                        label="Email-id"
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
                                        name="phone"
                                        id="phone"
                                        label="Phone Number"
                                        value={values.phone}
                                        type="phone"
                                        helperText={
                                            errors.phone && touched.phone
                                                ? errors.phone
                                                : 'Enter phone number'
                                        }
                                        error={
                                            errors.phone && touched.phone
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
                                        Submit
                                    </Button>
                                   
                                </Grid>
                               
                                            <Grid item
                                             lg={10}
                                             md={10}
                                             sm={10}
                                             xs={10}
                                            >
                                            Already have an account?{' '}<AppLink to = '/login' variant="body1" color="inherit">  Sign in</AppLink>
                                            </Grid>
                                        </Grid>
                            
                        </Form>
                        </Paper>
                    );
                }}
            </Formik>
            </main>
        </div>
    );
};

export default SignUp;
