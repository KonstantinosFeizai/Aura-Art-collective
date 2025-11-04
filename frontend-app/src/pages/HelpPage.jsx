import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    id: 1,
    question: "How long does shipping take?",
    answer:
      "Shipping times vary based on the item type (physical vs. digital) and the artist's location. Typically, physical art takes 7-14 business days. Digital art is available for immediate download after purchase.",
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for all physical items, provided they are returned in their original condition. Customized or commissioned pieces are non-refundable. Please see our full policies for details.",
  },
  {
    id: 3,
    question: "How do I become an artist on the collective?",
    answer:
      "We welcome new talent! Navigate to our Registration page and select the 'Artist' option. You will be prompted to submit a portfolio for review by our curation team.",
  },
  {
    id: 4,
    question: "Is the art original and authentic?",
    answer:
      "Absolutely. We guarantee the authenticity of every piece sold. All artists are verified, and we facilitate direct transactions between you and the creator.",
  },
];

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="container mx-auto p-4 md:p-12 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Aura Art Collective Help Center
        </h1>
        <p className="text-xl text-indigo-600 font-light">
          Your quick guide to orders, accounts, and policies.
        </p>
      </header>

      {/* FAQ Section */}
      <section className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200">
              <button
                className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="font-semibold text-lg text-gray-700 hover:text-indigo-600 transition-colors">
                  {faq.question}
                </span>
                <span className="text-xl text-indigo-500">
                  {openFaq === faq.id ? "−" : "+"}
                </span>
              </button>
              {openFaq === faq.id && (
                <div className="pb-4 pr-6 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Support CTA */}
      <section className="mt-12 text-center bg-indigo-50 p-10 rounded-xl shadow-inner">
        <h3 className="text-3xl font-bold text-indigo-700 mb-4">
          Still need assistance?
        </h3>
        <p className="text-indigo-800 mb-6">
          If you can't find the answer here, our support team is ready to help.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          Contact Our Team
        </Link>
      </section>
    </div>
  );
};

export default HelpPage;
