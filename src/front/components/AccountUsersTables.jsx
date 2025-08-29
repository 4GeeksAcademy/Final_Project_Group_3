export const UserTable = ({ props }) => {
    // function to PUT change user's role here

    return (
        <tbody>
            <tr>
                <th scope="row">{props.id}</th>
                <td>{props.first}</td>
                <td>{props.last}</td>
                <td>{props.email}</td>
                <td>{props.phone}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {props.role}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </div>
                </td>
                {/* modal button brings up a modal of three checkboxes, with a save and cancel button to change a user's roles */}
            </tr>
        </tbody>
    )

}

export default UserTable;