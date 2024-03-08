const fs = require("fs");
const io = require("socket.io-client");
const socket = io("ws://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");

    // Listen to errors 
    socket.on("exception", (errorData) => {
        console.error("WebSocket exception received:", errorData);
    });

    // Path to the file
    const filePath = "./files/photo-1566836610593-62a64888a216.jpeg";

    // Read file into buffer
    const buffer = fs.readFileSync(filePath);

    // Convert buffer to ArrayBuffer
    const arrayBuffer = new Uint8Array(buffer).buffer;

    // Join a room
    socket.emit("join", { SenderId: 1, GroupId: 1 });

    // Send ArrayBuffer through WebSocket
    socket.emit("message", {
        Content: "File uploading...",
        SenderId: 1,
        ReceiverId: 2,
        GroupId: 1,
        Type: "image",
        File: arrayBuffer,
    });
});