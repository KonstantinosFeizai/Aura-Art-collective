import React, { useState } from "react";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    // Simulate API call to send email/contact form data
    setTimeout(() => {
      // In a real application, you would replace this with a fetch() call to your backend
      console.log("Contact form submitted:", formState);

      // Clear form and show success message
      setFormState({ name: "", email: "", subject: "", message: "" });
      setStatus("Message sent successfully! We will be in touch soon.");
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 md:p-12 max-w-5xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Get In Touch
        </h1>
        <p className="text-xl text-indigo-600 font-light">
          We're here to help answer your questions about art, orders, or
          collaborations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form (2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formState.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="4"
                value={formState.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Send Message
            </button>
            {status && (
              <p
                className={`mt-2 text-center text-sm ${
                  status.includes("success")
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>

        {/* Contact Info Sidebar (1/3 width on large screens) */}
        <div className="lg:col-span-1 bg-indigo-50 p-8 rounded-xl shadow-lg border-l-4 border-indigo-300">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            Contact Information
          </h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="font-semibold text-gray-800">Email Support:</p>
              <p>support@auraartcollective.com</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                Phone (Mon-Fri, 9am-5pm EST):
              </p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                Headquarters Address:
              </p>
              <p>100 Art Gallery Ln, Suite 200</p>
              <p>Creative City, CA 90210</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold text-indigo-700 mb-2">Social Media</h3>
            <div className="flex space-x-4">
              {/* Placeholder for social media icons */}
              <span className="text-indigo-500 hover:text-indigo-700">F</span>
              <span className="text-indigo-500 hover:text-indigo-700">I</span>
              <span className="text-indigo-500 hover:text-indigo-700">T</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
