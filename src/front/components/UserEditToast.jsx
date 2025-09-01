import { useState } from "react";

export const UserEditToast = ({ show, onClose, message }) => {
  return (
    <div 
      className={`toast position-fixed top-0 end-0 m-3 ${show ? "show" : "hide"}`}
      role="alert"
    >
      <div className="toast-header bg-gold text-white">
        <strong className="me-auto">Success</strong>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default UserEditToast;