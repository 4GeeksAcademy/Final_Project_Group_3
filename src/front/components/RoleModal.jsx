import { useState, useEffect } from "react";

export const RoleModal = ({ isOpen, onClose, onSave, user, roles }) => {
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (user?.roles) {
            setSelectedRoles(user.roles);
        }
    }, [user]);

    const toggleRole = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    if (!isOpen) return null;

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
                                    checked={selectedRoles.includes(role)}
                                    onChange={() => toggleRole(role)}
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
                            onClick={() => onSave(selectedRoles)}
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