import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useToken() {
    const navigate = useNavigate()
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        if (tokenString == null) {
            return ''
        } else {
            try {
                const userToken = JSON.parse(tokenString);
                return userToken
            }
            catch (error) {
                console.log(error)
                return ""
            }
        }
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
        navigate(0)
    };


    return {
        setToken: saveToken,
        token
    }
}