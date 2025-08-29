import { useState } from "react";
import RoleModal from "./RoleModal";

export const UserTable = ({ props, refresh }) => {
    // function to PUT change user's role here
    const [isOpen, setIsOpen] = useState(false);
    const allRoles = ["Admin", "Staff", "Customer"]
    const backendLink = import.meta.env.VITE_BACKEND_URL

    const handleSave = (updatedRoles) => {
        console.log("Saving roles for user:", props.id, updatedRoles);

        fetch(`${backendLink}/api/user/${props.id}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roles: updatedRoles }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update roles");
                return res.json();
            })
            .then((data) => {
                console.log("Updated user:", data);
                setIsOpen(false);
                if (typeof refresh === "function") refresh(); // refresh
            })
            .catch((err) => {
                console.error(err);
            });
    };

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
                        onSave={handleSave}
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