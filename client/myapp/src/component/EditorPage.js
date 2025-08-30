// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "./socket";
// import ACTIONS from "./actions";
// // import logo from "./assets/logo(3).png";

// import {
//   useNavigate,
//   useLocation,
//   Navigate,
//   useParams,
// } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// // Judge0 Language IDs
// const LANGUAGES = [
//   { name: "Python 3", id: 71, label: "python3" },
//   { name: "Java", id: 62, label: "java" },
//   { name: "C++", id: 54, label: "cpp" },
//   { name: "JavaScript (Node.js)", id: 63, label: "nodejs" },
//   { name: "C", id: 50, label: "c" },
//   // Add other languages here with their Judge0 IDs
// ];

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
//   const [code, setCode] = useState("");

//   const Location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       socketRef.current = await initSocket();
//       socketRef.current.on("connect_error", (err) => handleErrors(err));
//       socketRef.current.on("connect_failed", (err) => handleErrors(err));

//       const handleErrors = (err) => {
//         console.log("Error", err);
//         toast.error("Socket connection failed, Try again later");
//         navigate("/");
//       };

//       socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       });

//       socketRef.current.on(
//         ACTIONS.JOINED,
//         ({ clients, username, socketId }) => {
//           if (username !== Location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           if (code) {
//              socketRef.current.emit(ACTIONS.SYNC_CODE, {
//                 code: code,
//                 socketId,
//              });
//           }
//         }
//       );

//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) => {
//           return prev.filter((client) => client.socketId !== socketId);
//         });
//       });
      
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//           if (code !== null) {
//               setCode(code);
//           }
//       });
//     };
//     init();

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//       socketRef.current.off(ACTIONS.OUTPUT_UPDATE);

//     };
//   }, [ Location.state?.username, navigate, roomId]);

//   if (!Location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`Room ID is copied`);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     if (!isCompileWindowOpen) {
//       setIsCompileWindowOpen(true);
//     }
    
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: code,
//         languageId: selectedLanguage.id, // Use the Judge0 language ID
//       });
      
//       // Judge0 returns stdout for output and stderr for errors.
//       // if (response.data.output) {
//       //   setOutput(response.data.output);
//       // } else if (response.data.error) {
//       //   setOutput(response.data.error);
//       // } else {
//       //   setOutput("No output from compiler.");
//       // }
//       if (response.data.output) {
//   setOutput(
//     typeof response.data.output === "object"
//       ? response.data.output.text
//       : response.data.output
//   );
// } else if (response.data.error) {
//   setOutput(
//     typeof response.data.error === "object"
//       ? response.data.error.text
//       : response.data.error
//   );
// } else {
//   setOutput("No output from compiler.");
// }

//       await axios.post("http://localhost:5000/compile", {
//       code  ,
//       languageId: selectedLanguage.id,
//       roomId,     });
      
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An unknown error occurred.");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/anim logo.jpg"
//             alt="Logo"
//             className="img-fluid mx-auto"
//             style={{ maxWidth: "150px", marginTop: "45px" }}
//           />
//           {/* <img
//   src="/images/anim logo.jpg"
//   alt="Logo"
//   className="img-fluid mx-auto"
//   style={{ maxWidth: "150px", marginTop: "45px" }}
// /> */}

//           <hr style={{ marginTop: "-3rem" }} />
//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>
//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end">
//             <select
//               className="form-select w-auto"
//               value={selectedLanguage.id}
//               onChange={(e) => {
//                 const lang = LANGUAGES.find(l => l.id === parseInt(e.target.value));
//                 setSelectedLanguage(lang);
//               }}
//             >
//               {LANGUAGES.map((lang) => (
//                 <option key={lang.id} value={lang.id}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//          <Editor
//   socketRef={socketRef}
//   roomId={roomId}
//   onCodeChange={(code) => setCode(code)}
//   onOutputChange={(output) => {
//     // when local output is produced, send to server
//     socketRef.current.emit(ACTIONS.OUTPUT_UPDATE, { roomId, output });
//   }}
// />

//         </div>
//       </div>

//       <button
//         className="btn btn-primary position-fixed bottom-0 end-0 m-3"
//         onClick={toggleCompileWindow}
//         style={{ zIndex: 1050 }}
//       >
//         {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
//       </button>

//       <div
//         className={`bg-dark text-light p-3 ${
//           isCompileWindowOpen ? "d-block" : "d-none"
//         }`}
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: isCompileWindowOpen ? "30vh" : "0",
//           transition: "height 0.3s ease-in-out",
//           overflowY: "auto",
//           zIndex: 1040,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="m-0">Compiler Output ({selectedLanguage.name})</h5>
//           <div>
//             <button
//               className="btn btn-success me-2"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>
//             <button className="btn btn-secondary" onClick={toggleCompileWindow}>
//               Close
//             </button>
//           </div>
//         </div>
//         <pre className="bg-secondary p-3 rounded">
//           {output || "Output will appear here after compilation"}
//         </pre>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;
// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "./socket";
// import ACTIONS from "./actions";
// import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// // Judge0 Language IDs
// const LANGUAGES = [
//   { name: "Python 3", id: 71, label: "python3" },
//   { name: "Java", id: 62, label: "java" },
//   { name: "C++", id: 54, label: "cpp" },
//   { name: "JavaScript (Node.js)", id: 63, label: "nodejs" },
//   { name: "C", id: 50, label: "c" },
// ];

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
//   const [code, setCode] = useState("");

//   const Location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       socketRef.current = await initSocket();
//       socketRef.current.on("connect_error", (err) => handleErrors(err));
//       socketRef.current.on("connect_failed", (err) => handleErrors(err));

//       const handleErrors = (err) => {
//         console.log("Error", err);
//         toast.error("Socket connection failed, Try again later");
//         navigate("/");
//       };

//       socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       });

//       socketRef.current.on(
//         ACTIONS.JOINED,
//         ({ clients, username, socketId }) => {
//           if (username !== Location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           if (code) {
//             socketRef.current.emit(ACTIONS.SYNC_CODE, {
//               code: code,
//               socketId,
//             });
//           }
//         }
//       );

//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) => {
//           return prev.filter((client) => client.socketId !== socketId);
//         });
//       });

//       // 👂 Listener for incoming code updates from other users
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           setCode(code);
//         }
//       });
      
//       // 👂 Listener for incoming output updates
//       socketRef.current.on(ACTIONS.OUTPUT_UPDATE, ({ output }) => {
//         if (output) {
//             setOutput(output.text);
//         }
//       });
//     };
//     init();

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//       socketRef.current.off(ACTIONS.OUTPUT_UPDATE);
//     };
//   }, [Location.state?.username, navigate, roomId, code]);

//   if (!Location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`Room ID is copied`);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     if (!isCompileWindowOpen) {
//       setIsCompileWindowOpen(true);
//     }
    
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: code,
//         languageId: selectedLanguage.id,
//         roomId: roomId, // Pass the roomId to the server
//       });
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An unknown error occurred.");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/anim logo.jpg"
//             alt="Logo"
//             className="img-fluid mx-auto"
//             style={{ maxWidth: "150px", marginTop: "45px" }}
//           />
//           <hr style={{ marginTop: "-3rem" }} />
//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>
//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end">
//             <select
//               className="form-select w-auto"
//               value={selectedLanguage.id}
//               onChange={(e) => {
//                 const lang = LANGUAGES.find(l => l.id === parseInt(e.target.value));
//                 setSelectedLanguage(lang);
//               }}
//             >
//               {LANGUAGES.map((lang) => (
//                 <option key={lang.id} value={lang.id}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => setCode(code)}
//           />
//         </div>
//       </div>

//       <button
//         className="btn btn-primary position-fixed bottom-0 end-0 m-3"
//         onClick={toggleCompileWindow}
//         style={{ zIndex: 1050 }}
//       >
//         {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
//       </button>

//       <div
//         className={`bg-dark text-light p-3 ${
//           isCompileWindowOpen ? "d-block" : "d-none"
//         }`}
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: isCompileWindowOpen ? "30vh" : "0",
//           transition: "height 0.3s ease-in-out",
//           overflowY: "auto",
//           zIndex: 1040,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="m-0">Compiler Output ({selectedLanguage.name})</h5>
//           <div>
//             <button
//               className="btn btn-success me-2"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>
//             <button className="btn btn-secondary" onClick={toggleCompileWindow}>
//               Close
//             </button>
//           </div>
//         </div>
//         <pre className="bg-secondary p-3 rounded">
//           {output || "Output will appear here after compilation"}
//         </pre>
//       </div>
//     </div>
//   );
// 
// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "./socket";
// import ACTIONS from "./actions";
// import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// // Judge0 Language IDs
// const LANGUAGES = [
//   { name: "Python 3", id: 71, label: "python3" },
//   { name: "Java", id: 62, label: "java" },
//   { name: "C++", id: 54, label: "cpp" },
//   { name: "JavaScript (Node.js)", id: 63, label: "nodejs" },
//   { name: "C", id: 50, label: "c" },
// ];

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
//   const [code, setCode] = useState("");

//   const Location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       socketRef.current = await initSocket();
//       socketRef.current.on("connect_error", (err) => handleErrors(err));
//       socketRef.current.on("connect_failed", (err) => handleErrors(err));

//       const handleErrors = (err) => {
//         console.log("Error", err);
//         toast.error("Socket connection failed, Try again later");
//         navigate("/");
//       };

//       socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       });

//       socketRef.current.on(
//         ACTIONS.JOINED,
//         ({ clients, username, socketId }) => {
//           if (username !== Location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           if (code) {
//             socketRef.current.emit(ACTIONS.SYNC_CODE, {
//               code: code,
//               socketId,
//             });
//           }
//         }
//       );

//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) => {
//           return prev.filter((client) => client.socketId !== socketId);
//         });
//       });

//       // 👂 Listener for incoming code updates from other users
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           setCode(code);
//         }
//       });
      
//       // 👂 Listener for incoming output updates
//       socketRef.current.on(ACTIONS.OUTPUT_UPDATE, ({ output }) => {
//         if (output) {
//             setOutput(output.text);
//         }
//       });
//     };
//     init();

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//       socketRef.current.off(ACTIONS.OUTPUT_UPDATE);
//     };
//   }, [Location.state?.username, navigate, roomId, code]);

//   if (!Location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`Room ID is copied`);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     if (!isCompileWindowOpen) {
//       setIsCompileWindowOpen(true);
//     }
    
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: code,
//         languageId: selectedLanguage.id,
//         roomId: roomId, // Pass the roomId to the server
//       });
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An unknown error occurred.");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/anim logo.jpg"
//             alt="Logo"
//             className="img-fluid mx-auto"
//             style={{ maxWidth: "150px", marginTop: "45px" }}
//           />
//           <hr style={{ marginTop: "-3rem" }} />
//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>
//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end">
//             <select
//               className="form-select w-auto"
//               value={selectedLanguage.id}
//               onChange={(e) => {
//                 const lang = LANGUAGES.find(l => l.id === parseInt(e.target.value));
//                 setSelectedLanguage(lang);
//               }}
//             >
//               {LANGUAGES.map((lang) => (
//                 <option key={lang.id} value={lang.id}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => setCode(code)}
//           />
//         </div>
//       </div>

//       <button
//         className="btn btn-primary position-fixed bottom-0 end-0 m-3"
//         onClick={toggleCompileWindow}
//         style={{ zIndex: 1050 }}
//       >
//         {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
//       </button>

//       <div
//         className={`bg-dark text-light p-3 ${
//           isCompileWindowOpen ? "d-block" : "d-none"
//         }`}
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: isCompileWindowOpen ? "30vh" : "0",
//           transition: "height 0.3s ease-in-out",
//           overflowY: "auto",
//           zIndex: 1040,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="m-0">Compiler Output ({selectedLanguage.name})</h5>
//           <div>
//             <button
//               className="btn btn-success me-2"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>
//             <button className="btn btn-secondary" onClick={toggleCompileWindow}>
//               Close
//             </button>
//           </div>
//         </div>
//         <pre className="bg-secondary p-3 rounded">
//           {output || "Output will appear here after compilation"}
//         </pre>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;
import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "./socket";
import ACTIONS from "./actions";
// import logo from "./assets/logo(3).png";

import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// Judge0 Language IDs
const LANGUAGES = [
  { name: "Python 3", id: 71, label: "python3" },
  { name: "Java", id: 62, label: "java" },
  { name: "C++", id: 54, label: "cpp" },
  { name: "JavaScript (Node.js)", id: 63, label: "nodejs" },
  { name: "C", id: 50, label: "c" },
  // Add other languages here with their Judge0 IDs
];

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState("");

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          if (code) {
             socketRef.current.emit(ACTIONS.SYNC_CODE, {
                code: code,
                socketId,
             });
          }
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
      
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null) {
              setCode(code);
          }
      });
      socketRef.current.on(ACTIONS.OUTPUT_UPDATE, ({ output }) => {
      setOutput(output);
      if (!isCompileWindowOpen) setIsCompileWindowOpen(true); // auto open output
    });
    };
    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [ Location.state?.username, navigate, roomId]);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  const runCode = async () => {
    setIsCompiling(true);
    if (!isCompileWindowOpen) {
      setIsCompileWindowOpen(true);
    }
    
    try {
      const response = await axios.post("http://localhost:5000/compile", {
        code: code,
        languageId: selectedLanguage.id, // Use the Judge0 language ID
      });
      
      // Judge0 returns stdout for output and stderr for errors.
      if (response.data.output) {
        setOutput(response.data.output);
      } else if (response.data.error) {
        setOutput(response.data.error);
      } else {
        setOutput("No output from compiler.");
      }
      
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput(error.response?.data?.error || "An unknown error occurred.");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        <div className="col-md-2 bg-dark text-light d-flex flex-column">
       <h1    className="mx-auto d-block mb-5 app-heading"
  style={{ color: "#ee1a61ff", textShadow: "0 0 10px #f0686eff",fontSize: "29px",    fontFamily: "'Pacifico', cursive",
          marginBottom: "40px" 

}}>
    Editor Room 

</h1>
          {/* <img
  src="/images/anim logo.jpg"
  alt="Logo"
  className="img-fluid mx-auto"
  style={{ maxWidth: "150px", marginTop: "45px" }}
/> */}

          <hr style={{ marginTop: "-3rem" }} />
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <hr/>
          <hr />
          <div className="mt-auto mb-3">
            <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className="btn btn-danger w-100" onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>

        <div className="col-md-10 text-light d-flex flex-column">
          <div className="bg-dark p-2 d-flex justify-content-end">
            <select
              className="form-select w-auto"
              value={selectedLanguage.id}
              onChange={(e) => {
                const lang = LANGUAGES.find(l => l.id === parseInt(e.target.value));
                setSelectedLanguage(lang);
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <Editor
  socketRef={socketRef}
  roomId={roomId}
  onCodeChange={(newCode) => {
    setCode(newCode); // ✅ only update state
  }}
/>
        </div>
      </div>

      <button
        className="btn btn-primary position-fixed bottom-0 end-0 m-3"
        onClick={toggleCompileWindow}
        style={{ zIndex: 1050 }}
      >
        {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
      </button>

      <div
        className={`bg-dark text-light p-3 ${
          isCompileWindowOpen ? "d-block" : "d-none"
        }`}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: isCompileWindowOpen ? "30vh" : "0",
          transition: "height 0.3s ease-in-out",
          overflowY: "auto",
          zIndex: 1040,
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Compiler Output ({selectedLanguage.name})</h5>
          <div>
            <button
              className="btn btn-success me-2"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
            <button className="btn btn-secondary" onClick={toggleCompileWindow}>
              Close
            </button>
          </div>
        </div>
        <pre className="bg-secondary p-3 rounded">
          {output || "Output will appear here after compilation"}
        </pre>
      </div>
    </div>
  );
}

export default EditorPage; 