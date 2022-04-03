import React, { useState, useEffect } from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Input, Button, Alert } from 'antd';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import loginSchema from '../formSchema/loginSchema';
import { getUser } from '../actions';


const initialValues = {
    email: '',
    password: ''
}

function LogIn() {
    const [loginValues, setLoginValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState(initialValues);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [loginMessage, setLoginMessage] = useState({
        message: "",
        type: ""
    })
    

    const history = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        loginSchema.isValid(loginValues)
        .then((valid) => {
            setDisabled(!valid)
        })
    }, [loginValues])

    const handleFormErrors = (name, value) => {
        Yup.reach(loginSchema,name).validate(value)
            .then(valid => {
                setFormErrors({...formErrors, [name]: ''})
            })
            .catch(err => {
                setFormErrors({...formErrors, [name]: err.errors[0]})
            })
    }

    
    const handleChange = (e) => {
        handleFormErrors(e.target.name, e.target.value)
        setLoginValues({...loginValues, [e.target.name]: e.target.value})
    }
    
    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true);

        axios.post('https://reciplease-backend.vercel.app/users/login', {email: loginValues.email.toLowerCase(), password: loginValues.password})
            .then(res => {
                setLoading(false);
                setLoginMessage({
                    message: "Login Successful!", 
                    type: "success"
                })

                setLoginStatus(true);


                dispatch(getUser({username: res.data.username, email: loginValues.email}));
                localStorage.setItem('user', JSON.stringify({username: res.data.username, email: loginValues.email.toLowerCase()}))
                localStorage.setItem('token', res.data.token)

                setTimeout(() => {
                    history('/search');
                }, 1500)
            })

            .catch(err => {
                setLoading(false)
                setLoginMessage({
                    message: err.response.data.message,
                    type: "error"
                })
                setLoginStatus(true)
            })
    }
    
    return (
        <div className="login-screen">
            <div className="login-wrapper">
                <h1>Login</h1>
                <p className='login-desc'>Welcome back! Lettuce show you some more recipes to fall in love with!</p>

                { loading && <Loading3QuartersOutlined spin />}

                {loginStatus && 
                    <Alert 
                        message={loginMessage.message}
                        type={loginMessage.type}
                        showIcon
                    />}

                <form onSubmit={onSubmit}>
                    <div className="input-container">
                        <Input
                            className="login-input"
                            type='text'
                            name='email'
                            placeholder='Email'
                            onChange={handleChange}
                        />
                        {formErrors.email && <p className='errors'>{formErrors.email}</p>}
                    </div>

                    <div className="input-container">
                        <Input
                            className="login-input"
                            type='password'
                            name='password'
                            placeholder='Password'
                            onChange={handleChange}
                        />
                        {formErrors.password && <p className='errors'>{formErrors.password}</p>}
                    </div>

                    <Button type='primary' disabled={disabled} className="login-btn" htmlType="submit">Login</Button>

                    <p className='options'>
                        Don't have an account? <br /> 
                        <Link to='/signup' className='options-link'>Sign up here</Link> <br />
                        <Link to='/forgot' className='options-link'>Forgot password?</Link>
                    </p>
                </form>
            </div>
            
        </div>
    )
}


const mapStateToProps = state => {
    return state
}

export default connect(mapStateToProps, {getUser})(LogIn)
