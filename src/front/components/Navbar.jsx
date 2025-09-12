import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SalonLogo from "../assets/img/SalonLogo.png";


export const Navbar = () => {

	{/* Logout functionality; Please do not remove // Deprecated. */ }
	{/* function logout() {
		localStorage.removeItem("jwt-token");
		window.location.href = "/login";
	} */}
	const { loggedIn, logout } = useAuth();

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container mb-1">
				<Link to="/" className="text-decoration-none d-flex align-items-center">
					<div style={{ width: 55, height: 55 }}>
						<img
							src={SalonLogo}
							alt="Logo"
							style={{ width: "100%", height: "100%", objectFit: "contain" }}
						/>
					</div>
					<span className="navbar-brand mb-0 h1 gold-title ms-2">
						Icon Nails & Spa
					</span>
				</Link>
				{/* Invisible div pushes all the buttons over */}
				<div className="ms-auto"></div>
				<Link to="/OurTeam" className="text-decoration-none">
					<span className="diff-text mb-0 highlight-on-hover">Team</span>
				</Link>
				<Link to="/Services" className="text-decoration-none">
					<span className="diff-text mb-0 ms-3 highlight-on-hover">Services</span>
				</Link>
				<Link to="/booking-app" className="text-decoration-none">
					<span className="diff-text mb-0 ms-3 highlight-on-hover">Booking</span>
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
							{loggedIn ? (
								<span>Account </span>
							) : (
								<span className="button-text">Login </span>
							)}
						</button>
						<ul className="dropdown-menu dropdown-menu-end bg-dark" aria-labelledby="dropdownMenuButton">
							{loggedIn ? (
								<>
									<li><a className="dropdown-item text-warning nav-drop button-text" href="/account">My Info</a></li>
									<li><button className="dropdown-item text-light nav-drop button-text" onClick={logout}>Logout</button></li>
								</>
							) : (
								<>
									<li><a className="dropdown-item text-light nav-drop button-text" href="/login">Login</a></li>
									<li><a className="dropdown-item text-light nav-drop button-text" href="/login">Staff Login</a></li>
									<li><a className="dropdown-item text-light nav-drop button-text" href="/signup">Sign Up</a></li>
								</>
							)}

						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};