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
        await loginQuery.mutate({'Username': username, 'Password': password})
        console.log(loginQuery.isError)
        if (!loginQuery.isError) {
            window.location.reload(true);
            console.log(window.history)
            navigate(-1)
        }
    }

    return (
        <div>
            {/* {mutateError != undefined ? <Alert severity="error">{mutateError.toString()}</Alert> : <></>} */}
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => setUserName(e.target.value)} required/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setPassword(e.target.value)} required/>
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <div style={{'height': '70px', 'width': '100%'}}></div>
            {loginQuery.isError ? <div>{loginQuery.error.message}</div> : <></>}
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

export function useLoggedIn() {
    const {token} = useToken()
    const checkToken = () => {
        return token ? true : false
    }
    return checkToken
}