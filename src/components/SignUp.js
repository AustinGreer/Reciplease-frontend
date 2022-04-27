import React, { useState, useEffect } from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Input, Button, Alert } from 'antd';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

import * as yup from 'yup';
import schema from '../formSchema/signSchema';

import "../styles/signup.scss";
import { getUser } from '../actions';



const initialValues = {
    username: '',
    email: '',
    password: '',
}

function SignUp() {
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(initialValues)
    const [disabledBtn, setDisabledBtn] = useState(true)
    
    const push = useNavigate();

    const handleFormErrors = ((name, value) => {
        yup
            .reach(schema, name)
            .validate(value)
            .then(() => {
                setFormErrors({
                    ...formErrors,
                    [name]: '',
                })
            })
            .catch(err => {
                setFormErrors({
                    ...formErrors,
                    [name]: err.errors[0],
                })
            })
    })

    const handleInputChange = (e => {
        handleFormErrors(e.target.name, e.target.value);
        setFormValues({...formValues, [e.target.name]: e.target.value})
    })

    useEffect(() => {
        schema.isValid(formValues)
            .then(valid => {
                setDisabledBtn(!valid)
            })
    }, [formValues])


    // const handleSubmit = (e) => {
    //     e.preventDefault();
        
    //     axios.post('https://reciplease-backend.vercel.app/users/register', formValues)
    //         .then((res) => {
    //             dispatch(getUser({username: formValues.username, email: formValues.email}));
    //             localStorage.setItem('user', JSON.stringify({username: formValues.username, email: formValues.email}))
    //             localStorage.setItem("token", JSON.stringify(res.data.token))
    //             setTimeout(() => {
    //                 push("/search")
    //             }, 1500)
    //         })
    //         .catch(err => {

    //             console.log({err})
    //         })
    //         .finally(() => {
    //             setFormValues(initialValues)
    //         })
    // }


    return (
        <div className="signup-screen">
            <div className="signup-container">
                <h1>Sign Up</h1>
                <p className='signup-desc'>Sign up today and begin searching for your favorite recipes right away!</p>

                <form>
                    <div className="input-container">
                        <Input
                            className="signup-input"
                            variant="outlined"
                            name='username'
                            type='text'
                            value={formValues.username}
                            onChange={handleInputChange}
                            placeholder='Username'
                        /> 

                        { formErrors.username && <p className='errors'>{formErrors.username}</p>}

                    </div>

                    <div className="input-container">
                    <Input
                        className="signup-input"
                        name='email'
                        type='email'
                        value={formValues.email}
                        onChange={handleInputChange}
                        placeholder='Email'
                    /> 

                        { formErrors.email && <p className='errors'>{formErrors.email}</p>}

                    </div>

                    <div className="input-container">
                    <Input
                        className="signup-input"
                        name='password'
                        type='password'
                        value={formValues.password}
                        onChange={handleInputChange}
                        placeholder='Password'
                    />

                        { formErrors.password && <p className='errors'>{formErrors.password}</p>}

                    </div>

                    <Button htmlType="submit" type="primary" className="signup-btn">Let's get cook'n</Button>

                </form>
                    <p className='options'>
                        Already have an account? <br /> 
                        <Link to="/login">Login here</Link>
                    </p>

            </div>
            </div>
    )
}

export default SignUp