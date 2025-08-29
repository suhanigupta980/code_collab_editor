import{io} from "socket.io-client";
export const initSocket = async()=>{
      console.log("Connecting to:", process.env.REACT_APP_BACKEND_URL); // ⬅️ Add this

    const option ={
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports : ["websocket"],
    };
    return io(process.env.REACT_APP_BACKEND_URL,option);
};