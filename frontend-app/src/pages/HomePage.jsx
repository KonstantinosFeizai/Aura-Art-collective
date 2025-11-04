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
    <div className="mix-h-sceen">
      {/* 1. HERO SECTION: Full-Width Banner */}
      <section
        className="relative h-[20vh] md:h-[40vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url(photos/Aurabackground.jpg)", // <--- USE YOUR MAIN HERO IMAGE HERE
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

      {/* 2. EXPLORE THE LIBRARY SECTION (New Design) */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container  mx-auto px-4">
          {/* Centered Title and Description */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Explore the Library
            </h2>
            <p className="text-lg text-gray-600">
              A visual collection of our most recent works - each piece crafted
              with intention, emotion, and style.
            </p>
          </div>

          {/* Image Grid */}
          <div className="flex justify-center grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 justify-items-center">
            {/* We will map over the first four items (or all items if less than four) */}
            {featuredSections.slice(0, 4).map((section, index) => (
              <Link
                key={section.id}
                to={section.linkTo}
                // The styles match the card structure: rounded corners, fixed aspect ratio
                className="w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.03]"
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
