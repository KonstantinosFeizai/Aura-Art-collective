import React, { useState } from "react";

// URL for the new backend endpoint you will create
const CONTACT_API_URL = "http://localhost:3001/api/contact"; // adjust port if different

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      // First try to parse the response as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, handle it gracefully
        console.error("Failed to parse response:", parseError);
        data = { message: "Server response was not in the expected format" };
      }

      if (response.ok) {
        setFormState({ name: "", email: "", subject: "", message: "" });
        setStatus("success");
      } else {
        setStatus({
          type: "error",
          message: data?.message || "Failed to send message.",
        });
        console.error("Contact Form Submission Error:", data);
      }
    } catch (error) {
      console.error("Network or system error:", error);
      setStatus({
        type: "error",
        message: "Network error. Please try again later.",
      });
    }
  };

  const isSending = status === "loading";

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
                disabled={isSending}
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
                disabled={isSending}
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
                disabled={isSending}
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
                disabled={isSending}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>

            {status && status !== "loading" && (
              <p
                className={`mt-2 text-center text-sm ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status === "success"
                  ? "Message sent successfully! We will be in touch soon."
                  : status.message}
              </p>
            )}
          </form>
        </div>

        {/* Contact Info Sidebar */}
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
              {/* Social Media Icons (using Lucide React for better integration) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook text-indigo-500 hover:text-indigo-700"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram text-indigo-500 hover:text-indigo-700"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter text-indigo-500 hover:text-indigo-700"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
