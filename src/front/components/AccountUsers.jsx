import { useEffect, useState } from "react";
import UserTable from "./AccountUsersTables";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const UsersTab = () => {
    {/* gets for admins, employees, and customers */ }
    const [admins, setAdmins] = useState([]);
    const [staff, setStaff] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const backendLink = import.meta.env.VITE_BACKEND_URL

    {/* Change to not show a 404 if there are no admins */ }
    const getAdmins = () => {
    fetch(`${backendLink}/api/admins`)
        .then(resp => resp.json())
        .then(dataObj => setAdmins(dataObj))
        .catch(err => console.log(err))
}

const getStaff = () => {
    fetch(`${backendLink}/api/staff`)
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
                <div>
                    <h4>Admins</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Role</th>
                            </tr>
                        </thead>
                        {
							admins.map(
								(char, ind) => < UserTable key={ind} props={char} />
							)
						}
                    </table>
                </div>
                <div>
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
                <div className="mb-5">
                    <h4>Customers</h4>
                    
                </div>
            </div>
        </div>
    )
}

export default UsersTab