import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getServerData } from '../helper/helper';
import * as Action from '../redux/result_reducer';
import axios from 'axios';

export const useFetchChildren = (userId, userType, schoolName, triggerFetch) => {
    const dispatch = useDispatch();
    const [getData, setGetData] = useState({ isLoading: false, apiData: [], serverError: null });

    useEffect(() => {
        if (userId && userType) {
            // Set loading state to true
            setGetData(prev => ({ ...prev, isLoading: true }));

            // Prepare data to send to the server
            const requestData = {
                user_type: userType.toLowerCase(),
                parent_id: userType !== "teacher" ? userId : undefined,
                schoolName: userType === "teacher" ? schoolName : undefined,
            };

            // Fetch children data when userId and userType are available
            (async () => {
                try {
                    let url = `${process.env.REACT_APP_SERVER_HOSTNAME}/children?user_type=${encodeURIComponent(requestData.user_type)}`;
                    if (requestData.parent_id !== undefined) {
                        url += `&parent_id=${encodeURIComponent(requestData.parent_id)}`;
                    }
                    if (requestData.schoolName !== undefined) {
                        url += `&school=${encodeURIComponent(requestData.schoolName)}`;
                    }

                    console.log("l34 FetchChildren.js url = ", url);

                    const childrenData = await getServerData(url, (requestData) => requestData);

                    // Update state with fetched data
                    setGetData(prev => ({ ...prev, isLoading: false, apiData: childrenData }));


                } catch (error) {
                    // Handle errors and update loading state
                    setGetData(prev => ({ ...prev, isLoading: false, serverError: error.message }));
                }
            })();
        }
    }, [dispatch, userId, userType, schoolName, triggerFetch]);

    return [getData, setGetData];
};
