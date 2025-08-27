// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*", // For development only
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {};

// // Function to get all connected clients in a room
// const getAllConnectedClients = (roomId) => {
//   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//     (socketId) => {
//       return {
//         socketId,
//         username: userSocketMap[socketId],
//       };
//     }
//   );
// };

// // io.on("connection", (socket) => {
// //   console.log("User connected:", socket.id);

// //   socket.on("join", ({ roomId, username }) => {
// //     userSocketMap[socket.id] = username;
// //     socket.join(roomId);

// //     const clients = getAllConnectedClients(roomId);

// //     // Notify all clients in the room about the new join
// //     clients.forEach(({ socketId }) => {
// //       io.to(socketId).emit("joined", {
// //         clients,
// //         username,
// //         socketId: socket.id,
// //       });
// //     });
// //   });

// //   // Handle disconnect
// //   socket.on("disconnect", () => {
// //     const username = userSocketMap[socket.id];
// //     delete userSocketMap[socket.id];

// //     // Notify other clients in the same room
// //     for (let [roomId] of socket.rooms) {
// //       if (roomId !== socket.id) {
// //         const clients = getAllConnectedClients(roomId);
// //         clients.forEach(({ socketId }) => {
// //           io.to(socketId).emit("disconnected", {
// //             socketId: socket.id,
// //             username,
// //             clients,
// //             socketId: socket.id,
// //           });
// //         });
// //       });
// //         socket.on('disconnecting',()=>{
// //   const rooms=[...socket.rooms];
// //   rooms.forEach((roomId) =>{
// //   socket.in(roomId).emit("disconnected",{
// //   socketId: socket.id,
// //   username: userSocketMap[socket.id],
// // });
// //     });
// //     delete userSocketMap[socket.id];
// //     socket.leave();
// // });
// //   });
// io.on("connection", (socket) => {
//   console.log("⚡ New client connected:", socket.id);

//   // Handle join
//   socket.on("join", ({ roomId, username }) => {
//     socket.join(roomId);
    
//   socket.roomId = roomId
//     socket.username = username; // save username for later
//     const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//       (id) => ({
//         socketId: id,
//         username: io.sockets.sockets.get(id)?.username,
//       })
//     );

//     console.log(`✅ ${username} joined room: ${roomId}`);

//     // Notify all clients in the room
//     io.to(roomId).emit("joined", {
//       clients,
//       username,
//       socketId: socket.id,
//     });
//   });
//   socket.on('code-change',({roomId,code})=>{
//     socket.in(roomId).emit("code-change",{code});
//   });
//   // Handle sync request (optional for new joiners)
//   socket.on("sync-code", ({ socketId, code }) => {
//     io.to(socketId).emit("code-change", { code });
//   });
//   // Handle disconnect (tab close / refresh / leave)
//   socket.on("disconnect", () => {
//     const { username, roomId } = socket; 
//   if (username) {
//     // const { roomId, username } = user;
//     //       delete userSocketMap[socket.id];
//        delete userSocketMap[socket.id];

//     // notify others in the same room
//     io.to(roomId).emit("disconnected", {
//       socketId: socket.id,
//       username,
//        clients: getAllConnectedClients(roomId),
//     })

//     console.log(`❌ ${username} disconnected`);
//   }
// });
// });




// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const ACTIONS = require("./Actions");
// const cors = require("cors");
// const axios = require("axios");
// const server = http.createServer(app);
// require("dotenv").config();

// const languageConfig = {
//   python3: { versionIndex: "3" },
//   java: { versionIndex: "3" },
//   cpp: { versionIndex: "4" },
//   nodejs: { versionIndex: "3" },
//   c: { versionIndex: "4" },
//   ruby: { versionIndex: "3" },
//   go: { versionIndex: "3" },
//   scala: { versionIndex: "3" },
//   bash: { versionIndex: "3" },
//   sql: { versionIndex: "3" },
//   pascal: { versionIndex: "2" },
//   csharp: { versionIndex: "3" },
//   php: { versionIndex: "3" },
//   swift: { versionIndex: "3" },
//   rust: { versionIndex: "3" },
//   r: { versionIndex: "3" },
// };

// // Enable CORS
// app.use(cors());

// // Parse JSON bodies
// app.use(express.json());

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {};
// const getAllConnectedClients = (roomId) => {
//   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//     (socketId) => {
//       return {
//         socketId,
//         username: userSocketMap[socketId],
//       };
//     }
//   );
// };

// io.on("connection", (socket) => {
//   // console.log('Socket connected', socket.id);
//   socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//     userSocketMap[socket.id] = username;
//     socket.join(roomId);
//     const clients = getAllConnectedClients(roomId);
//     // notify that new user join
//     clients.forEach(({ socketId }) => {
//       io.to(socketId).emit(ACTIONS.JOINED, {
//         clients,
//         username,
//         socketId: socket.id,
//       });
//     });
//   });

//   // sync the code
//   socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//     socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//   });
//   // when new user join the room all the code which are there are also shows on that persons editor
//   socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//     io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//   });

//   // leave room
//   socket.on("disconnecting", () => {
//     const rooms = [...socket.rooms];
//     // leave all the room
//     rooms.forEach((roomId) => {
//       socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//         socketId: socket.id,
//         username: userSocketMap[socket.id],
//       });
//     });

//     delete userSocketMap[socket.id];
//     socket.leave();
//   });
// });

// app.post("/compile", async (req, res) => {
//   const { code, language } = req.body;

//   try {
//     const response = await axios.post("https://api.jdoodle.com/v1/execute", {
//       script: code,
//       language: language,
//       versionIndex: languageConfig[language].versionIndex,
//       clientId: process.env.jDoodle_clientId,
//       clientSecret: process.env.jDoodle_clientSecret,
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to compile code" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server is runnint on port ${PORT}`));
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./actions");
const cors = require("cors");
const axios = require("axios");
const server = http.createServer(app);
require("dotenv").config();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.post("/compile", async (req, res) => {
  const { code, languageId,roomId } = req.body;

  if (!code || !languageId) {
    return res.status(400).json({ error: "Code or language ID not provided." });
  }

  try {
    // Step 1: Submit the code to Judge0
    const submissionResponse = await axios.post(
      "https://ce.judge0.com/submissions",
      {
        source_code: code,
        language_id: languageId,
        roomId,
      }
    );

    const { token } = submissionResponse.data;

    // Step 2: Poll for the result using the token
    const pollForResult = async (token) => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const resultResponse = await axios.get(`https://ce.judge0.com/submissions/${token}`);
            const status = resultResponse.data.status;

            if (status.id > 2) { // Status 3 (Accepted) and above means compilation is done
              clearInterval(interval);
              resolve(resultResponse.data);
            }
          } catch (err) {
            clearInterval(interval);
            reject(err);
          }
        }, 1500); // Poll every 500ms
      });
    };

    const result = await pollForResult(token);

    // Step 3: Handle the output
    if (result.status.id === 3) {
      const finalOutput =
        result.stdout || "Execution completed with no output.";

      // 🔥 Emit output to all in room
      if (roomId) {
        io.in(roomId).emit(ACTIONS.OUTPUT_UPDATE, { output: finalOutput });
      }

     return res.json({ output: finalOutput });
    } else {
      const errorOutput =
        result.stderr ||
        result.compile_output ||
        result.status.description;

      if (roomId) {
        io.in(roomId).emit(ACTIONS.OUTPUT_UPDATE, { output: errorOutput });
      }

      res.status(400).json({ error: errorOutput || "Compilation failed." });
    }
  } catch (error) {
    console.error("Judge0 API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "An error occurred while compiling your code.",
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);