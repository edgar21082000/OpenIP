import React from "react";
import { useNavigate } from "react-router-dom";

const DummyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8001/create_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create room");
      }
      const data = await response.json();
      if (data.room_id) {
        navigate(`/room/${data.room_id}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>Collaborative Text Editor</h1>
      <button onClick={handleCreateRoom} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Create Room
      </button>
    </div>
  );
};

export default DummyPage;
