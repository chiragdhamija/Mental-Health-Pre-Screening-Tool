import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getServerData } from '../helper/helper';
import * as Action from '../redux/result_reducer';

export const useFetchQuestionnaireId = (userType) => {
    const dispatch = useDispatch();
    const [getData, setGetData] = useState({ 
        isLoading: false, 
        apiData: [], 
        serverError: null 
    });

    useEffect(() => {
        if (userType) {
            setGetData(prev => ({ ...prev, isLoading: true }));
            const requestData = {
                user_type: userType.toLowerCase()
            };

            (async () => {
                try {
                    let url = `${process.env.REACT_APP_SERVER_HOSTNAME}/questionnaire/active?user_type=${encodeURIComponent(requestData.user_type)}`;
                    const questionnaireData = await getServerData(url, (requestData) => requestData);
                    const questionnaireId = questionnaireData.questionnaire_id;

                    // console.log("l23 FetchQuestionnaireId: ")
                    // console.log("questionnaireData = ", questionnaireData);
                    // console.log("questionnaireId = ", questionnaireId);

                    // dispatch(Action.setQuestionnaireId(questionnaireId));
                    setGetData(prev => ({ ...prev, isLoading: false, apiData: questionnaireData }));

                } catch (error) {
                    // Handle errors and update loading state
                    setGetData(prev => ({ ...prev, isLoading: false, serverError: error.message }));
                }
            })();
        }
    }, [dispatch, userType]);

    return [getData, setGetData];
};
