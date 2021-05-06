const {Socket} = require('net');

const input = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const error = (message)=>{
    console.log(message);
    process.exit(1);
}

const connect = (host, port)=>{
    console.log(`Connecting to ${host}:${port}`);
    const socket = new Socket();

    socket.connect({host, port});
    socket.setEncoding("utf-8");

    socket.on("connect", ()=>{
	console.log("Connected");

	input.question("Enter Username: ", (username)=>{
	    socket.write(username);
	    console.log("Write the message and press enter to send. send END to close the connection");

	})
	input.on("line", (msg) =>{
		socket.write(msg);
		if(msg === "END"){
	            socket.end();
		    console.log("Disconnected");
	    	    process.exit(0);
		}
    	});

    	socket.on("data", (data)=>{
            console.log(data);
    	});

    });
    
    socket.on("error", (err)=>{
	error(err.message);
    });

}
//---------------------------------------------------
const main = () =>{
    if (process.argv.length != 4 ){
	error(`Usage: node ${__filename} host port`);
    }

    let [, , host, port] = process.argv;
    port = !isNaN(port) ? Number(port): error(`Invalid port: ${port}`);
    port = Number(port);

    connect(host, port);
}

if (require.main === module){
    main();
}
