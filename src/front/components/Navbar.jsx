import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export const Navbar = () => {

	{/* Logout functionality; Please do not remove */ }
	{/* function logout() {
		localStorage.removeItem("jwt-token");
		window.location.href = "/login";
	} */}
	const { loggedIn, logout } = useAuth();

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<button className="ms-1 btn btn-secondary" onClick={logout}>Log out</button>
					<div className="dropdown" style={{ position: 'relative' }}>
						<button
							className="btn btn-secondary dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Menu
						</button>
						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
							{loggedIn ? (
								<>
									<li><a className="dropdown-item" href="/profile">change-to-account-path</a></li>
									<li><button className="dropdown-item" onClick={logout}>Logout</button></li>
								</>
							) : (
								<>
									<li><a className="dropdown-item" href="/login">Login</a></li>
									<li><a className="dropdown-item" href="/signup">Sign Up</a></li>
								</>
							)}

						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};