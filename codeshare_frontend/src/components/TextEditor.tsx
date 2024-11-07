import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/theme/material.css";
import logo from "../assets/openip_logo.png";

const TextEditor: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [username, setUsername] = useState<string>("");
  const [showModal, setShowModal] = useState(true);
  const [userList, setUserList] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("python");
  const [fontSize, setFontSize] = useState(14);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const editorRef = useRef<any>(null);
  const isLocalChange = useRef<boolean>(false);

  useEffect(() => {
    if (!roomId) return;

    const wsUrl = `ws://127.0.0.1:8001/ws/room/${roomId}`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log("WebSocket connection established for room:", roomId);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "text" && text !== data.payload) {
        setText(data.payload);
      } else if (data.type === "user_list") {
        setUserList(data.usernames);
      } else if (data.type === "language" && language !== data.payload) {
        setLanguage(data.payload);
      } else if (data.type === "fontSize" && fontSize !== data.payload) {
        setFontSize(data.payload);
      } else if (data.type === "cursor" && !isLocalChange.current) {
        const { line, ch } = data.payload;
        editorRef.current?.setCursor({ line, ch });
      } else if (data.type === "selection" && !isLocalChange.current) {
        const { anchor, head } = data.payload;
        editorRef.current?.setSelection(anchor, head);
      }
    };

    socket.current.onerror = () => {
      // If there's an error during connection, notify the user
      setErrorMessage("The room does not exist or has been closed.");
    };

    socket.current.onclose = (event) => {
      if (event.code === 403) {
        setErrorMessage("The room does not exist or has been closed.");
      } else {
        console.log("WebSocket connection closed for room:", roomId);
      }
    };

    return () => {
      if (socket.current) {
        socket.current.onclose = null; // prevent triggering onclose callback on manual close
        socket.current.close();
      }
    };
  }, [roomId]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "join", username }));
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getWrapperElement().style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  const handleChange = (editor: any, data: any, value: string) => {
    setText(value);
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "text", payload: value }));
    }
  };

  const handleCursorActivity = (editor: any) => {
    isLocalChange.current = true;
    const cursor = editor.getCursor();
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "cursor", payload: cursor }));
    }
    setTimeout(() => {
      isLocalChange.current = false;
    }, 50);
  };

  // const handleSelectionChange = (editor: any) => {
  //   isLocalChange.current = true;
  //   const selection = editor.listSelections()[0];
  //   if (socket.current && socket.current.readyState === WebSocket.OPEN) {
  //     socket.current.send(JSON.stringify({ type: "selection", payload: selection }));
  //   }
  //   setTimeout(() => {
  //     isLocalChange.current = false;
  //   }, 50);
  // };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "language", payload: newLanguage }));
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontSize = parseInt(e.target.value);
    setFontSize(newFontSize);
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "fontSize", payload: newFontSize }));
    }
  };

  const handleCopyInvitation = () => {
    const invitationLink = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(invitationLink).then(
      () => {
        console.log("Invitation link copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy invitation link:", err);
      }
    );
  };

  const handleCloseTab = () => {
    window.close(); // This attempts to close the current browser tab
  };

  return (
    <div style={{ height: "calc(90vh - 20px)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
        <img src={logo} alt="Logo" style={{ height: "50px" }} />
      </div>
      {errorMessage ? (
        <div
          style={{
            textAlign: "center",
            color: "red",
            padding: "20px",
          }}
        >
          <h2>{errorMessage}</h2>
          <button onClick={handleCloseTab} style={{ padding: "10px 20px", marginTop: "20px" }}>
            Close Tab
          </button>
        </div>
      ) : (
        <>
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2>Please enter your name to join the room</h2>
                <form onSubmit={handleUsernameSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginBottom: "20px", padding: "10px", fontSize: "16px" }}
                  />
                  <button type="submit" style={{ padding: "10px 20px" }}>
                    Join Room
                  </button>
                </form>
              </div>
            </div>
          )}
          {!showModal && (
            <>
              <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ marginRight: "10px", padding: "5px", width: "100px" }}
                >
                  <option value="python">Python</option>
                  <option value="text/x-c++src">C++</option>
                </select>
                <select
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  style={{ marginRight: "10px", padding: "5px", width: "100px" }}
                >
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                  <option value={20}>20px</option>
                </select>
                <button onClick={handleCopyInvitation} style={{ padding: "10px", marginLeft: "10px" }}>
                  Copy Invitation
                </button>
                <div style={{ marginLeft: "20px" }}>
                  <strong>Connected users:</strong> {userList.join(", ")}
                </div>
              </div>
              <CodeMirror
                value={text}
                options={{
                  mode: language,
                  theme: "material",
                  lineNumbers: true,
                  lineWrapping: true,
                }}
                onBeforeChange={handleChange}
                onCursorActivity={handleCursorActivity}
                editorDidMount={(editor) => {
                  editorRef.current = editor;
                  editor.setSize("100%", "calc(90vh - 40px)");
                  editor.getWrapperElement().style.fontSize = `${fontSize}px`;
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TextEditor;
