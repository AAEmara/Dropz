import { useEffect, useState } from "react";
import axiosInstance from "../services/authService";

export default function useUserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get("/api/accounts/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { user, loading, error };
}
