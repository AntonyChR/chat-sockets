import sys
import socket as Socket
import threading as th

def send_data(socket):
	while True:
		msg = input(">")
		socket.send(msg.encode("utf-8"))
		if msg == "END": break
	socket.close()
		
def recv_data(socket):
	print("se inicio este hilo")
	while True:
		msg = socket.recv(1024).decode()
		print(msg)

def main():
	_, host, port = sys.argv

	socket = Socket.socket(Socket.AF_INET, Socket.SOCK_STREAM)
	socket.connect((host, int(port)))
	print("Connected")
	socket.send((input("username: ").encode("utf-8")))
	
	th_send = th.Thread(target=send_data, args = (socket,))
	th_recv = th.Thread(target=recv_data, args = (socket,))

	th_send.start()
	th_recv.start()

	th_send.join()
	th_recv.join()

if __name__ == '__main__':
	main()