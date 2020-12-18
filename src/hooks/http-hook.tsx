import { useState, useCallback, useRef, useEffect } from 'react';
import useAsyncError from '../ui/ErrorHandling/AsyncErrors';
//import RollbarErrorTracking from '../../helpers/RollbarErrorTracking';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>('');
    const [success, setSuccess] = useState<boolean>(false);
    const throwError = useAsyncError();


    const activeHttpRequests = useRef([] as any);

    const sendRequest = useCallback(
        async (
            url,
            method = 'GET',
            body = null,
            headers = {},
            jsonReturnData = true
        ) => {
            setIsLoading(true);
            const httpAbortCtrl  = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try {

                    const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal,
                })

                let responseData;
                              
                if (!jsonReturnData) {
                    responseData = await response;
                } else {
                    responseData = await response.json();
                }
              
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    (reqCtrl: AbortController) => reqCtrl !== httpAbortCtrl
                );

                if (!response.ok) {

                 throw (responseData);
                    
                }

                setIsLoading(false);
                setSuccess(true);
                return responseData;
            } catch (err) {
               // RollbarErrorTracking.logErrorInRollbar(err);
                setError(err.message);
                setIsLoading(false);
                //throwError(new Error("Asynchronous error"));
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };
    const clearSuccess = () => {
        setSuccess(false);
    };

    useEffect(() => {
             
        return () => {
           
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach((abortCtrl: AbortController) =>
                abortCtrl.abort()
            );
        };
    }, []);

    return { isLoading, error, success, sendRequest, clearError, clearSuccess };
};
