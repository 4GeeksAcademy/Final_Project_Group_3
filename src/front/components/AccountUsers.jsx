import { useState } from "react";

export const UsersTab = () => {
    {/* gets for admins, employees, and customers */}
    const [admins, setAdmins] = useState([]);
	const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);

    {/* ANOTHER 422 error. */}
	const getAdmins = () => {
		fetch("https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/admins")
			.then(resp => resp.json())
			.then(dataObj => setAdmins(dataObj.results))
			.catch(err => console.log(err))
	}

    useEffect(() => { // Runs depending on the dependency array at the end. If empty, runs once on app start, and not when changing pages (to another .jsx file)
		getAdmins(); //runs getAdmins function on first load
	}, [])

    return (
        <div>
            <div className="container">
                <div>Admin (get from Employee table where role=Admin). Loop below table's tr property for each table entry.
                    <h4>Admins</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">id</th>
                                <td>fname</td>
                                <td>lname</td>
                                <td>email</td>
                                <td>phone</td>
                            </tr>
                            <tr>
                                <th scope="row">id</th>
                                <td>fname</td>
                                <td>lname</td>
                                <td>email</td>
                                <td>phone</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>Employees (get from Employee table where role=!admin)
                    <h4>Employees</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">id</th>
                                <td>fname</td>
                                <td>lname</td>
                                <td>email</td>
                                <td>phone</td>
                            </tr>
                            <tr>
                                <th scope="row">id</th>
                                <td>fname</td>
                                <td>lname</td>
                                <td>email</td>
                                <td>phone</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>Customers (get from Users table where role=customer)
                    <h4>Customers</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">id</th>
                                <td>fname</td>
                                <td>lname</td>
                                <td>email</td>
                                <td>phone</td>
                            </tr>
                            <tr>
                                <th scope="row">id</th>
                                <td>fname</td>
                                <td>lname</td>
                                <td>email</td>
                                <td>phone</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UsersTab