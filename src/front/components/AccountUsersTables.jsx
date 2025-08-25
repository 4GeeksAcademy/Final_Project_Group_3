export const UserTable = ({ props }) => {

    return (
        <tbody>
            <tr>
                <th scope="row">{props.id}</th>
                <td>{props.first}</td>
                <td>{props.last}</td>
                <td>{props.email}</td>
                <td>{props.phone}</td>
                <td>role modal btn</td>
            </tr>
        </tbody>
    )

}

export default UserTable;