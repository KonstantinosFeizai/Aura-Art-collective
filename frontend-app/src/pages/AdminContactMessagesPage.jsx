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

  // Modal State:
  const [modalMessage, setModalMessage] = useState(null); // For viewing full message
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // For confirmation dialogue

  const LIMIT = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // Fetch messages logic
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

  // MODAL/CONFIRMATION HANDLERS
  const openModal = (message) => setModalMessage(message);
  const closeModal = () => setModalMessage(null);

  const confirmDelete = (messageId) => {
    setConfirmDeleteId(messageId);
  };
  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleDeleteConfirmed = async () => {
    const messageId = confirmDeleteId;
    if (!messageId) return;

    setDeletingId(messageId);
    setConfirmDeleteId(null);
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

      // If the message being deleted was open in the full view modal, close it
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
        <div className="text-lg text-gray-600">
          <svg
            className="animate-spin h-5 w-5 mr-3 inline-block text-indigo-500"
            viewBox="0 0 24 24"
          >
            ...
          </svg>
          Loading messages...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-600">
          No messages found.
        </div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- Main Render ---
  return (
    <div className="container mx-auto py-8 sm:py-10 px-4 max-w-7xl">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b pb-3">
        Contact Messages ({totalMessages})
      </h1>

      {/* 1. TABLE VIEW (Desktop/Tablet) - Hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto bg-white shadow-2xl rounded-xl border border-gray-200">
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
                  {formatDate(msg.createdAt)}
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => openModal(msg)}
                    className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium mr-2 text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => confirmDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {deletingId === msg.id ? "Del..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. CARD VIEW (Mobile) - Hidden on SM+ screens */}
      <div className="sm:hidden space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-5 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {msg.subject}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDate(msg.createdAt)}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold">From:</span> {msg.name}
              </p>
              <p className="truncate text-indigo-600" title={msg.email}>
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {msg.email}
              </p>
            </div>

            <p className="mt-3 text-sm text-gray-600 italic line-clamp-2">
              {msg.message}
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => openModal(msg)}
                className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
              >
                View Full
              </button>
              <button
                onClick={() => confirmDelete(msg.id)}
                disabled={deletingId === msg.id}
                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {deletingId === msg.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination component */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50 px-6 py-3 rounded-xl shadow-inner border border-gray-200">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {modalMessage && (
        <FullMessageModal message={modalMessage} onClose={closeModal} />
      )}
      {confirmDeleteId && (
        <ConfirmationModal
          messageId={confirmDeleteId}
          onConfirm={handleDeleteConfirmed}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};
// --- END OF AdminContactMessagesPage COMPONENT ---

// --- Full Message Modal (Renamed from MessageModal) ---
const FullMessageModal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-4xl mx-auto transform transition-all relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 text-3xl transition"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
            Message Details (ID: {message.id})
          </h2>

          <div className="mb-4 space-y-2 text-sm text-gray-700">
            <p className="flex flex-wrap items-center">
              <strong className="w-20">From:</strong>{" "}
              <span className="font-semibold text-gray-900 break-words flex-1">
                {message.name}
              </span>
            </p>
            <p className="flex flex-wrap items-center">
              <strong className="w-20">Email:</strong>{" "}
              <span className="text-indigo-600 break-words flex-1">
                {message.email}
              </span>
            </p>
            <p className="flex flex-wrap items-center">
              <strong className="w-20">Received:</strong>{" "}
              <span className="text-gray-900 break-words flex-1">
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              Subject: {message.subject}
            </h3>

            <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg max-h-[60vh] overflow-y-auto">
              <p className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t text-right">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Confirmation Modal (New Component to replace window.confirm) ---
const ConfirmationModal = ({ messageId, onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.375c-.864 1.488.084 3.375 1.765 3.375h14.736c1.681 0 2.629-1.887 1.765-3.375l-7.388-12.793a1.5 1.5 0 00-2.67 0l-7.388 12.793z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h.007"
            />
          </svg>
          <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
            Confirm Deletion
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete message ID:{" "}
            <span className="font-bold text-red-600">{messageId}</span>? This
            action cannot be undone.
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(messageId)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessagesPage;
