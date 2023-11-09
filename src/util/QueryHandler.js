import { useQuery, useMutation } from "react-query";
import useToken from "../components/useToken";
import { useNavigate } from "react-router-dom";
import { Logout } from "../pages/Login";

export const Methods = Object.freeze({
	Get: "GET",
	Post: "POST",
})

export function useRequest(url, body, method, key, dataFunc) {
    const navigate = useNavigate()
    function errorCatch(response) {
        var res = response
        if (!res.ok) {
            if (res.status === 401) {
                // Call error here
                navigate('/login')
            }
            return res.json().then((err) => {throw new Error(String(err['error']) + ". " + String(err['message']))})
        }
        return res.json()
    }
    
    const query = useQuery({
        queryKey: key,
        queryFn: () => {

            var requestData = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            if (method === "POST") {
                requestData.body = body
            }
            return fetch(url, requestData)
                .then((res) => {return errorCatch(res)})
                .then((data) => {dataFunc(data); return data})
        },
        retry: 1,
    })
    return query
}

export function useMutate(url, method, key, dataFunc) {
    const navigate = useNavigate()
    function errorCatch(response) {
        var res = response
        var json = res.json()
        if (!res.ok) {
            console.log(String(json['error']))
            console.log(String(json['message']))
            if (res.status === 401) {
                // Call error here
                navigate('/login')
            } else if (res.status === 401) {
                // Call error here
                Logout()
                navigate('/login')
            }
            return json.then((err) => {throw new Error(String(err['error']) + ". " + String(err['message']))})
        }
        return json
    }
    
    const {token} = useToken()
    const mutation = useMutation({
        mutationKey: key,
        mutationFn: (data) => {
            var requestData = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify(data)
            }
            if (method === "POST") {
                requestData.body = JSON.stringify(data)
            }
            return fetch(url, requestData)
                .then((res) => {return errorCatch(res)})
                .then((data) => {dataFunc(data); return data})
        },
        retry: 1,
        staleTime: Infinity
    })
    return mutation
}