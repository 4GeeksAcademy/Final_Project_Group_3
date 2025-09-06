import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export const Navbar = () => {

	{/* Logout functionality; Please do not remove // Deprecated. */ }
	{/* function logout() {
		localStorage.removeItem("jwt-token");
		window.location.href = "/login";
	} */}
	const { loggedIn, logout } = useAuth();

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1">Icon Nails & Spa</span>
				</Link>
				{/* Invisible div pushes all the buttons over */}
				<div className="ms-auto"></div>
				<Link to="/OurTeam" className="text-decoration-none">
					<span className="navbar-text mb-0 highlight-on-hover">Our Team</span>
				</Link>
				<Link to="/Services" className="text-decoration-none">
					<span className="navbar-text mb-0 ms-3 highlight-on-hover">Services</span>
				</Link>
				<Link to="/booking-app" className="text-decoration-none">
					<span className="navbar-text mb-0 ms-3 highlight-on-hover">Booking</span>
				</Link>
				<div className="ms-4">
					<div className="dropdown" style={{ position: 'relative' }}>
						<button
							className="btn btn-gold dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Account
						</button>
						<ul className="dropdown-menu dropdown-menu-end bg-dark" aria-labelledby="dropdownMenuButton">
							{loggedIn ? (
								<>
									<li><a className="dropdown-item text-warning nav-drop" href="/account">My Info</a></li>
									<li><button className="dropdown-item text-light nav-drop" onClick={logout}>Logout</button></li>
								</>
							) : (
								<>
									<li><a className="dropdown-item text-warning nav-drop" href="/login">Login</a></li>
									<li><a className="dropdown-item text-light nav-drop" href="/signup">Sign Up</a></li>
								</>
							)}

						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};