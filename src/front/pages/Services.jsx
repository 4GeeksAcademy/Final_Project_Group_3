import React from "react";

import hero1 from "../assets/img/nails5.jpg";
import hero2 from "../assets/img/pedicures.jpg";
import manicuresImg from "../assets/img/nails6.jpg";
import pedicuresImg from "../assets/img/pedicures.jpg";
import dipsImg from "../assets/img/dip.webp";
import acrylicImg from "../assets/img/acrylic.jpg";

function SectionHeading({ id, children }) {
    return (
        <div id={id} className="container pt-5">
            <h3 className="section-heading">{children}</h3>
        </div>
    );
}

function ServiceCard({ icon, title, desc, price, bookingUrl }) {
    return (
        <div className="col">
            <div className="card service-card hover-lift h-100 card-compact">
                <div className="card-body d-flex flex-column text-center">
                    <div className="icon-bubble mx-auto mb-2">
                        <i className={`fa-solid ${icon}`} />
                    </div>

                    {/* Title */}
                    <h5 className="card-title mt-1">{title}</h5>

                    {/* Description */}
                    <p className="card-text small text-muted mb-3">{desc}</p>

                    {/* Price pill */}
                    <span className="price-pill align-self-center mb-3">{price}</span>

                    <div className="flex-grow-1" />
                    {/* Book button */}
                    {bookingUrl ? (
                        <a
                            href={bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-gold w-100 shadow-sm"
                        >
                            Book Now
                        </a>
                    ) : (
                        <button className="btn btn-gold w-100" disabled>
                            Book Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const MANICURES = [
    {
        icon: "fa-hand-sparkles",
        title: "Basic Manicure",
        desc:
            "Nail shaping, cuticle care and polish of your choice. A clean, classic look in 30 minutes.",
        price: "$20.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-droplet",
        title: "Gel Manicure",
        desc:
            "Long-lasting color with high-gloss finish. Cures under LED light for a chip-resistant shine.",
        price: "$40.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-paintbrush",
        title: "French Manicure",
        desc:
            "Timeless clear base with crisp white tips. Perfectly precise and polished in 50 minutes.",
        price: "$50.00",
        bookingUrl: "https://google.com",
    },
];

const PEDICURES = [
    {
        icon: "fa-shoe-prints",
        title: "Basic Pedicure",
        desc:
            "Warm foot soak, nail trimming, gentle exfoliation and polish. A relaxing 45-minute treat.",
        price: "$30.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-spa",
        title: "Spa Pedicure",
        desc:
            "Includes sugar scrub, mud mask and soothing massage. Softens and refreshes tired feet.",
        price: "$40.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-gem",
        title: "Deluxe Pedicure",
        desc:
            "Callus removal, paraffin dip and extended massage. The ultimate indulgence in 75 minutes.",
        price: "$60.00",
        bookingUrl: "https://google.com",
    },
];

const DIPS = [
    {
        icon: "fa-tint",
        title: "Classic Dip",
        desc:
            "Durable, chip-resistant powder finish. No UV light needed—lasting wear in 40 minutes.",
        price: "$40.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-adjust",
        title: "Multichrome Dip",
        desc:
            "Shimmering, color-shifting effect that changes in every light. Eye-catching and unique.",
        price: "$50.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-star",
        title: "Glitter Dip",
        desc:
            "High-sparkle finish—perfect for special occasions or a bit of everyday glam.",
        price: "$50.00",
        bookingUrl: "https://google.com",
    },
];

const ACRYLICS = [
    {
        icon: "fa-square-plus",
        title: "Full Set Acrylics",
        desc:
            "Custom length and shape built with premium acrylic—durable and beautiful.",
        price: "$35.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-fill-drip",
        title: "Acrylic Fill",
        desc:
            "Maintenance for your existing acrylics—fills out regrowth and smooths all edges.",
        price: "$25.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-palette",
        title: "Acrylic Nail Art",
        desc:
            "Hand-painted designs, gems or 3D accents—let your nails be your canvas.",
        price: "$50.00 - $70.00",
        bookingUrl: "https://google.com",
    },
];

const ADDONS = [
    {
        icon: "fa-hand-holding-droplet",
        title: "Paraffin Wax Treatment",
        desc:
            "Deeply moisturizes skin, soothes joints, and leaves hands or feet silky smooth.",
        price: "+$15.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-cut",
        title: "Cuticle Care",
        desc:
            "Nourishing oils and expert trim to keep your cuticles healthy and neat.",
        price: "+$5.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-spa",
        title: "Sugar Scrub Exfoliation",
        desc:
            "Gentle exfoliation to remove dead skin cells and restore a radiant glow.",
        price: "+$25.00",
        bookingUrl: "https://google.com",
    },
    {
        icon: "fa-gem",
        title: "Gel Top Coat Add-On",
        desc:
            "Ultra-shiny, chip-resistant finish you can layer over any polish.",
        price: "+$15.00",
        bookingUrl: "https://google.com",
    },
];

export function Services() {
    return (
        <>
            <header className="position-relative hero-ratio">
                <img src={hero1} alt="nails hero" className="w-100 h-100 hero-img position-absolute top-0 start-0" />
                <div className="hero-overlay d-flex flex-column align-items-center justify-content-center text-center">
                    <h1 className="display-5 text-white text-shadow mb-2">Nails</h1>
                    <p className="text-white-50 mb-3 text-shadow">
                        Enjoy Our Assortment of Nail Services
                    </p>
                    <div className="d-flex gap-2 flex-wrap justify-content-center">
                        <a href="#Manicures" className="btn btn-gold">Manicures</a>
                        <a href="#Pedicures" className="btn btn-gold">Pedicures</a>
                        <a href="#Dips" className="btn btn-gold">Dips</a>
                        <a href="#Acrylics" className="btn btn-gold">Acrylics</a>
                    </div>
                </div>

                <img
                    src={hero2}
                    alt="nails hero 2"
                    className="w-100 h-100 hero-img position-absolute top-0 start-0"
                    style={{ opacity: 0.0, pointerEvents: 'none' }}
                />
            </header>

            {/* MANICURES */}
            <section id="Manicures" className="py-5">
                <div className="container">
                    <div className="row align-items-center">

                        {/* Left: Image (on mobile this goes first) */}
                        <div className="col-md-6 order-1 order-md-1">
                            <img
                                src={manicuresImg}
                                alt="Manicures"
                                className="img-fluid rounded shadow mb-4 mb-md-0"
                            />
                        </div>

                        {/* Right: Service Cards */}
                        <div className="col-md-6 order-2 order-md-2">
                            <h3 className="mb-4">Manicures</h3>
                            <div className="row row-cols-1 row-cols-sm-3 g-4">
                                {MANICURES.map((c) => (
                                    <ServiceCard key={c.title} {...c} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* PEDICURES */}
            <section id="Pedicures" className="py-5 bg-light">
                <div className="container">
                    <div className="split-grid">
                        {/* Left: card group */}
                        <div className="split-grid__content">
                            <h3 className="mb-4">Pedicures</h3>

                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {PEDICURES.map(c => (
                                    <ServiceCard key={c.title} {...c} />
                                ))}
                            </div>
                        </div>

                        <figure className="split-grid__figure">
                            <img src={pedicuresImg} alt="Pedicures" className="img-fluid rounded shadow service-figure" />
                        </figure>
                    </div>
                </div>
            </section>

            {/* DIPS */}
            <section id="Dips" className="py-5">
                <div className="container">
                    <div className="split-grid split-grid--reverse">

                        <figure className="split-grid__figure">
                            <img src={dipsImg} alt="Dip Powder" className="img-fluid rounded shadow service-figure w-75" />
                        </figure>

                        {/* Right: card group */}
                        <div className="split-grid__content">
                            <h3 className="mb-4">Dip Powder</h3>

                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {DIPS.map(c => (
                                    <ServiceCard key={c.title} {...c} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACRYLICS */}
            <section id="Acrylics" className="py-5 bg-light">
                <div className="container">
                    <div className="split-grid">
                        {/* Left: card group */}
                        <div className="split-grid__content">
                            <h3 className="mb-4">Acrylics</h3>

                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {ACRYLICS.map(c => (
                                    <ServiceCard key={c.title} {...c} />
                                ))}
                            </div>
                        </div>

                        {/* Right: image */}
                        <figure className="split-grid__figure">
                            <img src={acrylicImg} alt="Acrylics" className="img-fluid rounded shadow service-figure" />
                        </figure>
                    </div>
                </div>
            </section>

            {/* ADD-ONS */}
            <SectionHeading id="AddOns">Add-Ons</SectionHeading>
            <section className="py-5">
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-4 g-4">
                        {ADDONS.map((c) => (
                            <ServiceCard key={c.title} {...c} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
