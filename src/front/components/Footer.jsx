import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="bg-dark text-light py-5">
		<div className="container pe-5">
			<div className="row">
				{/* Brand */}
				<div className="col-md-4 mb-3">
					<h5>Nails Spa</h5>
					<p className="small">© 2025 Nails Spa. All rights reserved.</p>
				</div>

				{/* Social Media */}
				<div className="col-md-4 mb-3">
					<h5>Follow Us</h5>
					<a className="btn text-light mx-2" onClick={() => { window.open("https://instagram.com"); }}>
						<i className="fab fa-instagram fa-lg"></i>
					</a>
					<a className="btn text-light mx-2" onClick={() => { window.open("https://facebook.com"); }}>
						<i className="fab fa-facebook fa-lg"></i>
					</a>
				</div>

				{/* Hours */}
				<div className="col-md-4 mb-3">
					<h5>Hours of Operation</h5>
					<p className="small">
						<strong>Mon - Fri:</strong> 9:00 A.M. - 7:30 P.M.
						<br />
						<strong>Sun:</strong> 10:00 A.M. - 6:00 P.M.
						<br />
						Last walk-ins 30 mins before close.
					</p>
				</div>

				{/* Quick Links */}
				<div className="col-md-4">
					<h6>Quick Links</h6>
					<ul className="list-unstyled small">
						<li>
							<Link to="/" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Home</span>
							</Link>
						</li>
						<li>
							<Link to="/OurTeam" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Our Team</span>
							</Link>
						</li>
						<li>
							<Link to="/Services" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Services</span>
							</Link>
						</li>
						<li>
							<Link to="/booking-app" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Booking</span>
							</Link>
						</li>
					</ul>
				</div>

				{/* Location */}
				<div className="col-md-4">
					<h6>Location</h6>
					<p>
						<a
							href="https://www.google.com/maps/dir/?api=1&destination=1634+N+Federal+Hwy,+Fort+Lauderdale,+FL+33305"
							target="_blank"
							rel="noopener noreferrer"
							className="text-decoration-none text-light"
						>
							<span className="highlight-on-hover">
							1634 N Federal Hwy,
							<br />
							Fort Lauderdale, FL 33305
							</span>
						</a>
					</p>
				</div>

				{/* Contact */}
				<div className="col-md-4">
					<h5>Call Us</h5>
					<p>
						<a
							href="tel:+19545550123"
							className="text-decoration-none text-light"
						>
							<span className="highlight-on-hover">
							<i className="fa-solid fa-phone me-2"></i>
							(954) 555-0123
							</span>
						</a>
					</p>

					<h5>Email</h5>
					<p>
						<a
							href="mailto:info@nailsspa.com"
							className="text-decoration-none text-light"
						>
							<span className="highlight-on-hover">
							<i className="fa-solid fa-envelope me-2"></i>info@nailsspa.com
							</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	</footer>
);