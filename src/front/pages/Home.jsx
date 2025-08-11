import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { InlineWidget } from "react-calendly";
import { PopupButton } from "react-calendly";

export const Home = () => {

	const url = "https://calendly.com/asianbryan40/30min";

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<PopupButton
				url="https://book.squareup.com/appointments/i7seipt2tf3nqd/location/LZ8PPFN3NJMYT/services"
				rootElement={document.getElementById("root")}
				text="Book Now"
			/>
			<a href="https://book.squareup.com/appointments/i7seipt2tf3nqd/location/LZ8PPFN3NJMYT/services" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
				Book Now
			</a>
		</div>
	);
};