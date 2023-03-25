import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const validateAuth = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  useEffect(() => {
    if (!token || token === null) {
      navigate("/home");
    }
  }, []);
};
