// frontend-app/src/pages/AdminContactMessagesPage.jsx:{Update Messages Page with Delete}:frontend-app/src/pages/AdminContactMessagesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import AdminService from "../services/admin.service";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
// Note: Icon imports like lucide-react are avoided as per previous discussion.

const AdminContactMessagesPage = () => {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // State to track deletion status

  const LIMIT = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // SECURITY CHECK: Redirect immediately if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Memoized function to fetch data
  const fetchMessages = useCallback(
    async (page) => {
      setLoading(true);
      setError(null);

      try {
        const data = await AdminService.getContactMessages(
          currentUser.accessToken,
          page,
          LIMIT
        );

        setMessages(data.messages);
        setTotalPages(data.totalPages);
        setTotalMessages(data.totalMessages);
        setCurrentPage(data.currentPage);
      } catch (err) {
        console.error("Message Fetch Error:", err);
        setError(
          "Failed to fetch contact messages. Check permissions and API."
        );
        setMessages([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Handler to delete a message
  const handleDelete = async (messageId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this contact message? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(messageId);
    setError(null);

    try {
      await AdminService.deleteContactMessage(
        currentUser.accessToken,
        messageId
      );

      // Successfully deleted. Refresh the list.
      // If we deleted the last item on the current page, go back one page.
      if (messages.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Otherwise, refresh the current page to update the list
        fetchMessages(currentPage);
      }
    } catch (err) {
      console.error("Message Delete Error:", err);
      setError("Failed to delete the message. Check server logs.");
    } finally {
      setDeletingId(null);
    }
  };

  // Effect to fetch data on page load and page change
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchMessages(currentPage);
    }
  }, [currentPage, isAuthenticated, isAdmin, fetchMessages]);

  // Handlers for pagination (Next/Prev)
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // --- Conditional Rendering ---

  if (loading && deletingId === null)
    return (
      <div className="text-center py-20 text-indigo-600 font-semibold text-xl">
        Loading Contact Messages...
      </div>
    );

  if (error)
    return <div className="text-red-600 text-center py-10">{error}</div>;

  if (messages.length === 0 && !loading)
    return (
      <div className="text-center py-20 text-gray-500 text-xl border rounded-xl bg-gray-50">
        No contact messages found.
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
        <span className="w-8 h-8 mr-3 text-indigo-600">✉️</span>
        Customer Contact Messages
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Viewing {Math.min((currentPage - 1) * LIMIT + 1, totalMessages)} -{" "}
        {Math.min(currentPage * LIMIT, totalMessages)} of {totalMessages} total
        messages.
      </p>

      {/* Messages Table */}
      <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-1/12">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-2/12">
                Name/Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-2/12">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-4/12">
                Message Preview
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-indigo-700 uppercase tracking-wider w-2/12">
                Received
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-indigo-700 uppercase tracking-wider w-1/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {msg.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="font-semibold text-gray-800">{msg.name}</div>
                  <div className="text-xs text-indigo-600 break-words">
                    {msg.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {msg.subject}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 italic">
                  {msg.message.substring(0, 70)}
                  {msg.message.length > 70 ? "..." : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="text-red-600 hover:text-red-900 transition-colors disabled:text-red-300 disabled:cursor-not-allowed"
                  >
                    {deletingId === msg.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <span>&lt;</span>
            <span className="ml-2">Previous</span>
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <span className="mr-2">Next</span>
            <span>&gt;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessagesPage;
