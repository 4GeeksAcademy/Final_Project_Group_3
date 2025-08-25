import { useEffect, useState } from "react";
import UserTable from "./AccountUsersTables";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const UsersTab = () => {
    {/* gets for admins, employees, and customers */ }
    const [admins, setAdmins] = useState([]);
    const [staff, setStaff] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);

    {/* ANOTHER 422 error. // 401 Unauthorized now. */ }
    const getAdmins = () => {
    fetch("https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/admins")
        .then(resp => resp.json())
        .then(dataObj => setAdmins(dataObj))
        .catch(err => console.log(err))
}

const getStaff = () => {
    fetch("https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/staff")
        .then(resp => resp.json())
        .then(dataObj => setStaff(dataObj))
        .catch(err => console.log(err))
}


    useEffect(() => { // Runs depending on the dependency array at the end. If empty, runs once on app start, and not when changing pages (to another .jsx file)
        getAdmins(); //runs getAdmins function on first load
        getStaff(); // 500
    }, [])

    return (
        <div>
            <div className="container">
                <div>Admin (get from Employee table where role=Admin). Loop below table's tr property for each table entry.
                    <h4>Admins</h4>
                    <p> table here </p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                            </tr>
                        </thead>
                        {
							admins.map(
								(char, ind) => < UserTable key={ind} props={char} />
							)
						}
                    </table>
                </div>
                <div>Employees (get from Employee table where role=!admin)
                    <h4>Employees</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                            </tr>
                        </thead>
                        {
							staff.map(
								(char, ind) => < UserTable key={ind} props={char} />
							)
						}
                    </table>
                </div>
                <div>Customers (get from Users table where role=customer)
                    <h4>Customers</h4>
                    
                </div>
            </div>
        </div>
    )
}

export default UsersTab