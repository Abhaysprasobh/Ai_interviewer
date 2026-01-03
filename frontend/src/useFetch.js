import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);


    // npx json-server --watch data/db.json --port 8000
    useEffect(() => {
        const abortCont = new AbortController();
        // console.log("Runs when dom changes?");
        fetch(
            url, { signal: abortCont.signal }
        ).then(
            (response) => {
                if (!response.ok) {
                    throw Error("Couldnt fetch data for that resource");
                }
                return response.json()
            })
            .then((data) => {
                setTimeout(() => {
                    setIsPending(false);
                    setError(null);
                    setData(data);
                }, 1000);
            }).catch((err) => {
                if (err.name !== "AbortError") {
                    console.log(err.message);
                    setIsPending(false);
                    setError(err.message);
                }
            });
        return () => {
            abortCont.abort();
        }
    }, [url])
    return { data, isPending, error }

}

export default useFetch;