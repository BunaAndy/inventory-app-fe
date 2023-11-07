import React, { useState } from 'react';
import './Login.css';
import { useMutate, Methods } from '../util/QueryHandler';
// import { Alert } from '@mui/material';
import { api_url } from '../resources/constants';
import useToken from '../components/useToken';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate()
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const {setToken} = useToken()

    const loginQuery = useMutate(
        String(api_url) + '/login',
        Methods.Post,
        ['login'],
        // Data population function, called in query handler
        ((data) => {
            setToken(data['token'])
        })
    )

    const handleSubmit = async e => {
        e.preventDefault();
        loginQuery.mutate({'Username': username, 'Password': password})
        window.location.reload(true);
        console.log(window.history)
        navigate(-1)
    }

    return (
        <div>
            {/* {mutateError != undefined ? <Alert severity="error">{mutateError.toString()}</Alert> : <></>} */}
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setUserName(e.target.value)} />
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setPassword(e.target.value)} />
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function Logout() {
    localStorage.removeItem('token')
    console.log("Logged out")
    window.location.reload(false);
    return 
}

export function useLogin() {
    const {token} = useToken()
    const navigate = useNavigate()
    const checkLogin = () => {
        if (!token) {
            navigate('/login')
        }
    }
    return checkLogin
}