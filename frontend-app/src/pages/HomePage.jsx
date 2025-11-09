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
    image: "/photos/castle.png", // <--- UPDATE THIS PATH
    linkText: "View Prints",
    linkTo: "/shop?category=prints",
  },
  {
    id: 2,
    title: "Abstract Collection",
    description:
      "Bold colors and dynamic shapes redefine your space. Find your perfect statement piece.",
    image: "/photos/ShadowDragon.png", // <--- UPDATE THIS PATH
    linkText: "Explore Abstracts",
    linkTo: "/shop?category=abstract",
  },
  {
    id: 3,
    title: "Artisan Crafts",
    description:
      "From hand-poured ceramics to sculpted wood—discover unique home accents.",
    image: "/photos/about.jpg", // <--- UPDATE THIS PATH
    linkText: "Shop Crafts",
    linkTo: "/shop?category=crafts",
  },
  {
    id: 4,
    title: "Artisan Crafts",
    description:
      "From hand-poured ceramics to sculpted wood—discover unique home accents.",
    image: "/photos/blog1.jpg", // <--- UPDATE THIS PATH
    linkText: "Shop Crafts",
    linkTo: "/shop?category=crafts",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Responsive heights and text sizes */}
      <section
        className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url(photos/Aurabackground.jpg)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative text-center p-4 sm:p-6 md:p-8 max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4 md:mb-6 animate-fadeIn">
            Welcome to Aura Art Collective
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light mb-6 sm:mb-8 px-4">
            Where independent creators connect with art lovers worldwide.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-yellow-400 text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
          >
            Start Exploring Art
          </Link>
        </div>
      </section>

      {/* Explore Library Section - Responsive grid and spacing */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive title section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-xl sm:max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Explore the Library
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              A visual collection of our most recent works - each piece crafted
              with intention, emotion, and style.
            </p>
          </div>

          {/* Responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {featuredSections.slice(0, 4).map((section, index) => (
              <Link
                key={section.id}
                to={section.linkTo}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.03]"
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm sm:text-base opacity-90">
                      {section.linkText}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
