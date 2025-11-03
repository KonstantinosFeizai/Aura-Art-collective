import React from "react";
import { Link } from "react-router-dom";

// --- Dummy Data for Image Sections (Replace with your actual images and descriptions) ---
// Note: These image paths assume you have files like /photos/art1.jpg, /photos/art2.jpg, etc.
const featuredSections = [
  {
    id: 1,
    title: "Limited Edition Prints",
    description:
      "Explore curated artwork that tells a story. Each piece is hand-signed and numbered.",
    image: "/photos/featured-prints.png", // <--- UPDATE THIS PATH
    linkText: "View Prints",
    linkTo: "/shop?category=prints",
  },
  {
    id: 2,
    title: "Abstract Collection",
    description:
      "Bold colors and dynamic shapes redefine your space. Find your perfect statement piece.",
    image: "/photos/featured-abstract.png", // <--- UPDATE THIS PATH
    linkText: "Explore Abstracts",
    linkTo: "/shop?category=abstract",
  },
  {
    id: 3,
    title: "Artisan Crafts",
    description:
      "From hand-poured ceramics to sculpted wood—discover unique home accents.",
    image: "/photos/featured-crafts.png", // <--- UPDATE THIS PATH
    linkText: "Shop Crafts",
    linkTo: "/shop?category=crafts",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION: Full-Width Banner */}
      <section
        className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url(/photos/hero-banner.jpg)", // <--- USE YOUR MAIN HERO IMAGE HERE
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fallback if image fails
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative text-center p-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fadeIn">
            Welcome to Aura Art Collective
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8">
            Where independent creators connect with art lovers worldwide.
          </p>
          <Link
            to="/shop"
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
          >
            Start Exploring Art
          </Link>
        </div>
      </section>

      {/* 2. FEATURED SECTIONS: Image Slides/Sections */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Featured Collections
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredSections.map((section, index) => (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-2xl overflow-hidden group transition-transform duration-500 hover:scale-[1.02] border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
                    // This is where your custom image goes
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <Link
                    to={section.linkTo}
                    className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-150 flex items-center justify-center space-x-1"
                  >
                    <span>{section.linkText}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FINAL CALL-TO-ACTION SECTION */}
      <section className="bg-indigo-700 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find your next masterpiece?
          </h2>
          <p className="text-xl mb-6 opacity-80">
            Browse thousands of unique pieces available for purchase today.
          </p>
          <Link
            to="/shop"
            className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-semibold shadow-2xl hover:bg-gray-200 transition duration-300"
          >
            Shop All Art
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
