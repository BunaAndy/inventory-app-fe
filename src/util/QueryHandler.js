import { useQuery, useMutation } from "react-query";

export const Methods = Object.freeze({
	Get: "GET",
	Post: "POST",
})

export function useRequest(url, body, method, key, dataFunc) {
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
    const mutation = useMutation({
        mutationKey: key,
        mutationFn: (data) => {
            console.log('here')
            console.log(data)
            var requestData = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            if (method === "POST") {
                requestData.body = JSON.stringify(data)
            }
            console.log('req')
            console.log(requestData)
            return fetch(url, requestData)
                .then((res) => {return errorCatch(res)})
                .then((data) => {dataFunc(data); return data})
        },
        retry: 1,
        staleTime: Infinity
    })
    return mutation
}

function errorCatch(response) {
    var res = response
    if (!res.ok) {
        return res.json().then((err) => {throw new Error(String(err['error']) + ". " + String(err['message']))})
    }
    return res.json()
}
