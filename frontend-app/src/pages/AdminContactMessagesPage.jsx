import React, { useState, useEffect, useCallback } from "react";
import AdminService from "../services/admin.service";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// --- START OF AdminContactMessagesPage COMPONENT ---
const AdminContactMessagesPage = () => {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [modalMessage, setModalMessage] = useState(null);

  const LIMIT = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // All hooks (useState/useCallback/useEffect) must run before any early return
  const fetchMessages = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const data = await AdminService.getContactMessages(
          currentUser?.accessToken,
          page,
          LIMIT
        );
        // Expecting { messages, totalPages, totalMessages, currentPage }
        setMessages(data.messages || []);
        setTotalPages(data.totalPages || 1);
        setTotalMessages(data.totalMessages || (data.messages || []).length);
        setCurrentPage(data.currentPage || page);
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

  useEffect(() => {
    // Only attempt fetch if user token available
    if (!currentUser?.accessToken) {
      setLoading(false);
      return;
    }
    fetchMessages(currentPage);
  }, [fetchMessages, currentPage, currentUser]);

  // SECURITY CHECK (after hooks)
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const openModal = (message) => setModalMessage(message);
  const closeModal = () => setModalMessage(null);

  const handleDelete = async (messageId) => {
    if (
      !window.confirm("Are you sure you want to delete this contact message?")
    )
      return;

    setDeletingId(messageId);
    setError(null);
    try {
      await AdminService.deleteContactMessage(
        currentUser.accessToken,
        messageId
      );
      // refresh current page (if last item on page, go back one page)
      const remaining = messages.length - 1;
      if (remaining === 0 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchMessages(currentPage);
      }
      if (modalMessage && modalMessage.id === messageId) closeModal();
    } catch (err) {
      console.error("Message Delete Error:", err);
      setError("Failed to delete the message. Check server logs.");
    } finally {
      setDeletingId(null);
    }
  };

  // Clear and consistent conditional rendering
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-7xl text-center">
        <div className="text-lg text-gray-600">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
        <div className="p-6 bg-white rounded shadow text-gray-600">
          No messages found.
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">
        Contact Messages ({totalMessages})
      </h1>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider min-w-[60px]">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider min-w-[180px]">
                Name/Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider min-w-[200px]">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider min-w-[250px]">
                Message Preview
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider min-w-[120px]">
                Received
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider min-w-[160px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {msg.id}
                </td>
                <td className="px-4 py-4 text-sm">
                  <div className="font-semibold text-gray-800 truncate max-w-[180px]">
                    {msg.name}
                  </div>
                  <div
                    className="text-xs text-indigo-600 truncate max-w-[180px]"
                    title={msg.email}
                  >
                    {msg.email}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className="text-sm text-gray-700 font-medium line-clamp-2 max-w-[200px]"
                    title={msg.subject}
                  >
                    {msg.subject}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className="text-sm text-gray-600 italic line-clamp-2 max-w-[250px]"
                    title={msg.message}
                  >
                    {msg.message}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => openModal(msg)}
                    className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium mr-2"
                  >
                    View Full
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === msg.id ? "Del..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination styling improvements */}
      <div className="mt-6 flex items-center justify-between bg-gray-50 px-6 py-3 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {modalMessage && (
        <MessageModal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
};
// --- END OF AdminContactMessagesPage COMPONENT ---

// 💡 3. MODAL COMPONENT (Can be defined in the same file for simplicity)
const MessageModal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-500 hover:text-gray-900 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
            Message Details
          </h2>

          <div className="mb-4 space-y-1 text-sm text-gray-700">
            <p>
              <strong>From:</strong>{" "}
              <span className="font-semibold">{message.name}</span>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <span className="text-indigo-600 break-words">
                {message.email}
              </span>
            </p>
            <p>
              <strong>Received:</strong>{" "}
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              Subject: {message.subject}
            </h3>

            {/* No fixed height / no inner overflow — allow body to expand */}
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t text-right">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessagesPage;
