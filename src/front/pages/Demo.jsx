import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.

export const Demo = () => {
  const { store, dispatch } = useGlobalReducer()

  return (
    <div className="container">
      
    </div>
  );
};
