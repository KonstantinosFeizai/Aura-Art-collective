import React from "react";
import { Link } from "react-router-dom";
const AboutPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-12 max-w-6xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          The Story of Aura Art Collective
        </h1>
        <p className="text-xl text-indigo-600 font-light">
          Where art, innovation, and community converge.
        </p>
      </header>

      {/* Main Content Sections */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="lg:order-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Mission: Empowering Creators
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Aura Art Collective was born from the idea that true artistic value
            lies in its authenticity and the story behind it. Our mission is to
            provide a premier platform for independent artists to showcase,
            sell, and thrive, connecting them directly with a global audience of
            dedicated art lovers. We believe in fair compensation and creative
            freedom for every member of our collective.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We curate unique, soul-stirring pieces that capture the *Aura*—the
            essential spirit—of the artist. From digital masterpieces to
            tangible sculptures, our collection is diverse, vibrant, and
            constantly evolving.
          </p>
        </div>
        <div className="lg:order-1">
          {/* Placeholder Image for visual appeal */}
          <img
            src="https://placehold.co/600x400/2F367A/ffffff?text=Our+Vision"
            alt="Abstract art studio with artist working"
            className="w-full h-auto rounded-xl shadow-2xl object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400";
            }}
          />
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Why Choose the Collective?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Authenticity
            </h3>
            <p className="text-gray-500">
              Every piece is original and directly sourced from the artist. You
              purchase a story, not just a product.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sustainability
            </h3>
            <p className="text-gray-500">
              We prioritize eco-friendly materials and ethical production
              processes across our entire supply chain.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Innovation
            </h3>
            <p className="text-gray-500">
              We embrace new mediums, including AI-assisted and digital art,
              pushing the boundaries of creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-50 p-8 rounded-xl shadow-inner text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-3">
          Join the Aura Movement
        </h2>
        <p className="text-indigo-800 mb-6">
          Ready to explore unique art or become part of our growing family of
          creators?
        </p>
        <Link
          to="/shop"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          Discover Our Collection
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
