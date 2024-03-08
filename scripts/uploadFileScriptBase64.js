const fs = require("fs");
const path = require("path");
const io = require("socket.io-client");
const socket = io("ws://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");

    // Listen to errors 
    socket.on("exception", (errorData) => {
        console.error("WebSocket exception received:", errorData);
    });

    // Path to your file
    const filePath = path.join(__dirname, "./files/photo-1566836610593-62a64888a216.jpeg");

    // File name
    const fileName = path.basename(filePath);

    // Read file and convert to Base64
    const fileContent = fs.readFileSync(filePath);
    const fileBase64 = fileContent.toString('base64');

    // Join a room
    socket.emit("join", { SenderId: 1, GroupId: 1 });

    // Emit event with Base64-encoded file
    socket.emit("message", {
        Content: "Uploading file...",
        SenderId: 1,
        GroupId: 1,
        Type: "image",
        File: fileBase64,
        FileName: fileName
    });
});
