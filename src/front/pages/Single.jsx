import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types";  // To define prop types for this component
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state

export const Single = props => {
  const { store } = useGlobalReducer()
  const { theId } = useParams()
 
  

  return (
    <div className="container text-center">
      
    </div>
  );
};
