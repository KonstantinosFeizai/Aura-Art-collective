// frontend-app/src/components/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto p-6 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} Aura Art Collective. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-yellow-400">Privacy Policy</a>
        <a href="#" className="hover:text-yellow-400">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;