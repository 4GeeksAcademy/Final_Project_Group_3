import { useState } from "react";
import RoleModal from "./RoleModal";

export const UserTable = ({ props }) => {
    // function to PUT change user's role here
    const [isOpen, setIsOpen] = useState(false);
    const allRoles = ["Admin", "Staff", "Customer"]

    return (
        <tbody>
            <tr>
                <th scope="row">{props.id}</th>
                <td>{props.first}</td>
                <td>{props.last}</td>
                <td>{props.email}</td>
                <td>{props.phone}</td>
                <td>
                    <button className="btn btn-secondary" type="button" onClick={() => setIsOpen(true)}>Edit Roles</button>
                    <RoleModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        // onSave={handleSave}
                        user={props}
                        roles={allRoles}
                    />
                </td>
                {/* modal button brings up a modal of three checkboxes, with a save and cancel button to change a user's roles */}
            </tr>
        </tbody>
    )

}

export default UserTable;