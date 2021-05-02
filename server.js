const {Server} = require('net');

const server = new Server();
server.on("connection",(socket)=>{
	console.log(`new connection from: ${socket.remoteAddress} : ${socket.remotePort} `);
});

server.listen({port: 8000, host:'0.0.0.0'}, ()=>{
    console.log("listening on port 8000");
});
