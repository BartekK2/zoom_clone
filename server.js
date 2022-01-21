const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.0.124:3000", "https://zoom-clone22.herokuapp.com", "https://zoom-clone2-5hwucw2jy-bartekk2.vercel.app", "https://zoom-clone2-bartekk2.vercel.app"],
    }
})

io.on("connection", (socket) => {
    console.log("uzytkownik dolaczyl", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data.room);
        socket.room = data.room;
        socket.userID = data.userID;
        console.log("dolaczyl", data.room)
        io.in(data.room).allSockets().then(users => {
            let usersArray = Array.from(users);
            socket.to(data.room).emit("all users", { "users": usersArray })
        });

    })

    socket.on("disconnect", () => {
        console.log("uzytkownik sie rozlaczyl", socket.id);
        socket.to(socket.room).emit("user disconnected", { "id": socket.id });
        // io.in(socket.room).allSockets().then(users => {
        //     let usersArray = Array.from(users);
        //     socket.to(socket.room).emit("all users", { "users": usersArray })
        // });
    })

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });
})
server.listen(3001, "0.0.0.0");
