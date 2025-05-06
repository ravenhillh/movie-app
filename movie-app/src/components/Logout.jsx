import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
