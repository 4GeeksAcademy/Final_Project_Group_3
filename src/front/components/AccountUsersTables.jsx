export const UserTable = ({ props }) => {
    // function to PUT change user's role here
    // edit roles button brings up modal to change roles for users

    return (
        <tbody>
            <tr>
                <th scope="row">{props.id}</th>
                <td>{props.first}</td>
                <td>{props.last}</td>
                <td>{props.email}</td>
                <td>{props.phone}</td>
                <td>
                    <button className="btn btn-secondary" type="button">
                        Edit Roles
                    </button>
                </td>
                {/* modal button brings up a modal of three checkboxes, with a save and cancel button to change a user's roles */}
            </tr>
        </tbody>
    )

}

export default UserTable;