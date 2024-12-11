import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getServerData } from "../helper/helper";
import * as Action from '../redux/question_reducer'

/** fetch question hook to fetch api data and set value to store */
export const useFetchQuestion = () => {
    const dispatch = useDispatch();
    const [getData, setGetData] = useState({ 
        isLoading: false, 
        apiData: [], 
        serverError: null 
    });
    const questionnaireId = useSelector(state => state.result.questionnaireId);
    useEffect(() => {
        setGetData(prev => ({ ...prev, isLoading: true }));

        (async () => {
            try {
                const questionData = await getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/questionnaire/${questionnaireId}/questions`, (data) => data);

                console.log("l20")
                console.log(questionData)


                if (questionData.length > 0) {
                    setGetData(prev => ({ ...prev, isLoading: false }));
                    setGetData(prev => ({ ...prev, apiData: questionData }));

                    /** dispatch an action */
                    dispatch(Action.startExamAction({ question: questionData }))

                } else {
                    throw new Error("No Question Available");
                }
            } catch (error) {
                setGetData(prev => ({ ...prev, isLoading: false }));
                setGetData(prev => ({ ...prev, serverError: error }));
            }
        })();
    }, [dispatch]);

    return [getData, setGetData];
}


/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveNextAction()); /** increase trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movePrevAction()); /** decrease trace by 1 */
    } catch (error) {
        console.log(error)
    }
}