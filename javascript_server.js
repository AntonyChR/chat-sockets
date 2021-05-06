const {Server} = require('net');

const error = (errorMsg) =>{
    console.error(errorMsg);
    process.exit(1); 
}

const connections = new Map();

const listen = (host, port) =>{
    const server = new Server();
    server.on("connection",(socket)=>{
    	const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    	console.log(`New connection from: ${remoteSocket}`);
    	socket.setEncoding("utf-8");

    	socket.on("data", (msg)=>{
	    if (!connections.has(socket)){
			console.log(`Username ${msg} set for connection ${remoteSocket}`);
			connections.set(socket, msg);
	    } else if (msg === "END"){
			connections.delete(socket);
			socket.end();
	    } else {
			const id_msg = `[${connections.get(socket)}]: ${msg}`;
    		console.log(`${remoteSocket}->${id_msg}`);
			sendMessage(id_msg, socket);
	    }
    	});

		socket.on("error", (err)=>err.message)
    });

    server.listen({port, host}, ()=>{
		console.log(`Listening on port ${port}`);
    });

    server.on("error", (err)=>error(err.message));
}

function sendMessage(msg, origin){
    for(const socket of connections.keys()){
		if(socket != origin){
			socket.write(msg);
		}
    }
}

// -----------------------------------------------------------------------
const main = ()=>{
    if (process.argv.length != 4){
	error(`Usage: node ${__filename} host port`);
    } 
    let [, , host, port] = process.argv;
    port = !isNaN(port) ? Number(port): error(`Invalid port: ${port}`);
    listen(host, port);
}

if (require.main == module){
	main();
}

