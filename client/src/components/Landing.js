import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

import '../styles/landing.scss'

function Landing() {
    const history = useNavigate();

    const handleClick = () => {
        history('/login');
    }

    return (
        <div className="content">
            <h1 className="landing-title">Reciplease</h1>
            <p className="landing-description">Don't know what to cook next?</p>
            <div className='button-container'>
                <Button type="primary" onClick={handleClick}>Let's get cook'n</Button>
            </div>
        </div>
    )
}

export default Landing