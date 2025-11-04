import axios from "axios";
const API_URL = "http://localhost:3001/api/admin"; // Base Admin API URL

// Function to fetch KPI metrics
const getKpiMetrics = async (token) => {
  // Send the JWT via the 'x-access-token' header
  const response = await axios.get(`${API_URL}/kpis`, {
    headers: {
      "x-access-token": token,
    },
  });
  return response.data;
};

const AdminService = {
  getKpiMetrics,
};

export default AdminService;
