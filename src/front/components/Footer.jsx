import React from "react";

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
					<a className="btn text-light mx-2" onClick={() => {window.open("https://instagram.com");}}>
						<i className="fab fa-instagram fa-lg"></i>
					</a>
					<a className="btn text-light mx-2" onClick={() => {window.open("https://facebook.com");}}>
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
							<a href="/" className="text-light">
								Home
							</a>
						</li>
						<li>
							<a href="/booking-app" className="text-light">
								Booking
							</a>
						</li>
						<li>
							<a href="/Services" className="text-light">
								Services
							</a>
						</li>
						<li>
							<a href="/OurTeam" className="text-light">
								Our Team
							</a>
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
							1634 N Federal Hwy,
							<br />
							Fort Lauderdale, FL 33305
						</a>
					</p>
				</div>

				{/* Contact */}
				<div className="col-md-4">
					<h5>Call Us</h5>
					<p>
						<a
							href="tel:+15612345678"
							className="text-decoration-none text-light"
						>
							<i className="fa-solid fa-phone me-2"></i>(561) 234-5678
						</a>
					</p>

					<h5>Email</h5>
					<p>
						<a
							href="mailto:info@nailsspa.com"
							className="text-decoration-none text-light"
						>
							<i className="fa-solid fa-envelope me-2"></i>info@nailsspa.com
						</a>
					</p>
				</div>
			</div>
		</div>
	</footer>
);