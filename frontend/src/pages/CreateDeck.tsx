import { AlignHorizontalRight } from "@mui/icons-material";
import React, { FC } from "react";
import { useNavigate } from "react-router";

export const CreateDeck: FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ width: "100vw", height: "100vh", padding: "3", marginLeft: 10 }}
    >
      <h1>CreateDeck</h1>
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </div>
  );
};
