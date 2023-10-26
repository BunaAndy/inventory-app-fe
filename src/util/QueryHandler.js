import { useQuery } from "react-query";

export const Methods = Object.freeze({
	Get: "GET",
	Push: "PUSH",
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
            if (method == "PUSH") {
                requestData.body = body
            }
            return fetch(url, requestData)
                .then((res) => {return errorCatch(res)})
                .then((data) => {dataFunc(data); return data})
        },
        retry: 1
    })
    return query
}

function errorCatch(response) {
    var res = response
    if (!res.ok) {
        return res.json().then((err) => {throw new Error(String(err['error']) + ". " + String(err['message']))})
    }
    return res.json()
}
