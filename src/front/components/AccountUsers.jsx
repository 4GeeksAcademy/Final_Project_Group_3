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
    const [loadingAdmins, setLoadingAdmins] = useState(true);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingCustomers, setLoadingCustomers] = useState(true);


    const getAdmins = () => {
        setLoadingAdmins(true);
        fetch(`${backendLink}/api/admins`)
            .then((resp) => resp.json())
            .then((dataObj) => setAdmins(dataObj))
            .catch((err) => console.log(err))
            .finally(() => setLoadingAdmins(false));
    };

    const getStaff = () => {
        setLoadingStaff(true);
        fetch(`${backendLink}/api/staff`)
            .then((resp) => resp.json())
            .then((dataObj) => setStaff(dataObj))
            .catch((err) => console.log(err))
            .finally(() => setLoadingStaff(false));
    };

    const getCustomers = () => {
        setLoadingCustomers(true);
        fetch(`${backendLink}/api/customers`)
            .then((resp) => resp.json())
            .then((dataObj) => setCustomers(dataObj))
            .catch((err) => console.log(err))
            .finally(() => setLoadingCustomers(false));
    };



    useEffect(() => { // Runs depending on the dependency array at the end. If empty, runs once on app start, and not when changing pages (to another .jsx file)
        getAdmins(); //runs getAdmins function on first load
        getStaff();
        getCustomers();
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
                                <th scope="col">Role</th>
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
                            customers.map(
                                (char, ind) => < UserTable key={ind} props={char} />
                            )
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UsersTab