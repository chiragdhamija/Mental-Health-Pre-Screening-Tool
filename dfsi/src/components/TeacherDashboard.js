// TeacherDashboard.js
import React, { useState } from "react";
import Card from "./Card";
import "./TeacherDashboard.css";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useFetchChildren } from "../hooks/FetchChildren";
import { setChildId, setQuestionnaireId, setUserType } from "../redux/result_reducer";
import { useNavigate } from "react-router-dom";
import { useFetchQuestionnaireId } from "../hooks/FetchQuestionnaireId";

function TeacherDashboard() {
  // State for children and selected child
  const userId = useSelector(state => state.result.userId);
  const role = useSelector(state => state.result.userType);
  const schoolName = useSelector(state => state.result.schoolName);


  // childrenUpdated is used to re-fetch the list of children when the handleAddChild function successfully adds a new child
  const [childrenUpdated, setChildrenUpdated] = useState(false);
  // selectedChild holds the child id of the selected child
  const [selectedChild, setselectedChild] = useState(null);

  const [{ isLoading, apiData: children = [], serverError }] = useFetchChildren(userId, role, schoolName, childrenUpdated);
  const [{ isLoading: isQuestionnaireLoading, apiData: questionnaireData, serverError: questionnaireError }] = useFetchQuestionnaireId(role);

  // role may change from parent to child
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("l31 userType = |", role);
  console.log("length  = ", role.length);

  // Handle clicking on the "Take Test" button
  const handleTakeTest = async () => {
    if (selectedChild) {
      console.log(`Selected Child: ${selectedChild}`);
      console.log(`Selected Role: ${role}`);
      dispatch(setQuestionnaireId(questionnaireData.questionnaire_id));
      dispatch(setChildId(selectedChild));
      console.log(`Fetched Questionnaire ID: ${questionnaireData.questionnaire_id}`);

      if (isQuestionnaireLoading) return <h3 className='text-light'>isLoading</h3>;
      if (questionnaireError) return <h3 className='text-light'>{serverError || "Unknown Error"}</h3>;
      navigate("/questions");
    }
  };

  console.log("l47 TeacherDashboard.js children = ", children);

  if (isLoading) return <h3 className='text-light'>isLoading</h3>;
  if (serverError) return <h3 className='text-light'>{serverError || "Unknown Error"}</h3>;
  return (
    <div className="TD-page-container">
      <Navbar />
      <div className="Outside-TD">
        <div className="button_and_card_container-TD">
          <p className="Role-Select-TD2">
            {Array.isArray(children) && children.length > 0
              ? "On whose behalf you want to give the test?"
              : "No children registered in school"}
          </p>
          <div className="Parent-Dashboard-card-container-PD">
            {/* Ensure children is an array before calling .map */}
            {Array.isArray(children) && children.length > 0 ? (
              children.map((child) => (
                <Card
                  key={child._id}
                  role={child.Name}
                  statement={`${child.School} - Age: ${child.Age}`}
                  isSelected={selectedChild === child._id}
                  onSelect={() => setselectedChild(child._id)}
                />
              ))
            ) : (
              <div style={{ height: '10vh' }}></div>
            )}
          </div>

          {/* Take Test Button */}
          <div className="two-buttons-TD">
            {selectedChild && (
              <button className="add-child-btn-TD" onClick={handleTakeTest}>
                Take Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
