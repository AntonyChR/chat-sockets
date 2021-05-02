const {Server} = require('net');

const END    = "END";
const host   = "localhost";

const connections = new Map();


const error = (errorMsg) =>{
    console.error(errorMsg);
    process.exit(1); 
}

const sendMessage=(msg, origin) => {
    //enviar mensaje a todos menos al emisor
    for(const socket of connections.keys()){
	if(socket != origin){
		socket.write(msg);
	}
    }
};
const listen = (port) =>{
    const server = new Server();
    server.on("connection",(socket)=>{
    	const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    	console.log(`New connection from: ${remoteSocket}`);
    	socket.setEncoding("utf-8");

    	socket.on("data", (msg)=>{
	    if (!connections.has(socket)){
		console.log(`Username ${msg} set for connection ${remoteSocket}`);
		connections.set(socket, msg);
	    } else if (msg === END){
		connections.delete(socket);
		socket.end();
	    } else {
		//enviar mensaje al resto de clientes
		const fullMessage = `[${connections.get(socket)}]: ${msg}`;
       		console.log(`${remoteSocket}->${fullMessage}`);
		sendMessage(fullMessage, socket);
	    }
    	});

	socket.on("error", (err)=>err.message)
    });

    server.listen({port, host}, ()=>{
   	console.log(`Listening on port ${port}`);
    });

    server.on("error", (err)=>error(err.message));
}

// -----------------------------------------------------------------------
const main = ()=>{
    if (process.argv.length != 3){
	error(`Usage: node ${__filename} port`);
    } 
    let port = process.argv[2];
    if (isNaN(port)){
	error(`Invalid port: ${port}`)
    }
    port = Number(port);

    listen(port);
}

if (require.main == module){
	main();
}

