import React from "react";
import { Link } from "react-router-dom";
const ServicesPage = () => {
  const services = [
    {
      title: "Curated Art Marketplace",
      description:
        "Discover unique and original artworks from a global community of independent artists. Our collection spans various mediums, ensuring a piece that speaks to every taste and space.",
      icon: "🛒",
      target: "/products",
    },
    {
      title: "Secure E-commerce & Logistics",
      description:
        "Enjoy secure payment processing, transparent tracking, and reliable international shipping for both physical and digital art purchases. We handle the logistics so you can focus on the art.",
      icon: "📦",
      target: "/cart",
    },
    {
      title: "Artist Profile Management",
      description:
        "We provide artists with personalized dashboards to manage their inventory, track sales performance, and connect directly with their audience, ensuring fair compensation.",
      icon: "🧑‍🎨",
      target: "/register", // Link to a general sign-up or artist portal page
    },
    {
      title: "Commission & Custom Work",
      description:
        "Looking for a bespoke piece? Connect with our artists to commission custom artwork tailored to your specific vision, dimensions, and style requirements.",
      icon: "✨",
      target: "/contact",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-12 max-w-6xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Services We Offer
        </h1>
        <p className="text-xl text-indigo-600 font-light">
          Supporting the journey of art, from creation to collection.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {service.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {service.description}
            </p>
            <Link
              to={service.target}
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition duration-150"
            >
              Learn More &rarr;
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-16 text-center bg-gray-50 p-10 rounded-xl">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Need Help with Something Else?
        </h3>
        <p className="text-gray-600 mb-6">
          If your inquiry doesn't fit the above, please reach out directly to
          our support team.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md"
        >
          Contact Support
        </Link>
      </section>
    </div>
  );
};

export default ServicesPage;
