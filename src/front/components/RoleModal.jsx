//edit roles for firstname lastname
//checkboxes populated based on whether the user has those roles
//cancel button to close
//save button to post new roles

// export const RoleModal = () => {

//     return (
//         <div className="modal" tabindex="-1">
//             <div className="modal-dialog">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">User Roles</h5>
//                         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                     </div>
//                     <div className="modal-body">
//                         <p>Modal body text goes here.</p>
//                     </div>
//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                         <button type="button" className="btn btn-primary">Save changes</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )

// }

// export default RoleModal;

export const RoleModal = ({ isOpen, onClose, onSave, user, roles }) => {
  if (!isOpen) return null; // Don't render if closed

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Edit Roles for {user?.first} {user?.last}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            {roles?.map((role) => (
              <div className="form-check" key={role}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={role}
                  defaultChecked={user?.roles?.includes(role)}
                />
                <label className="form-check-label" htmlFor={role}>
                  {role}
                </label>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-gold"
              onClick={onSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;