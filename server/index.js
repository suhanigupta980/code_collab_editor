
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
