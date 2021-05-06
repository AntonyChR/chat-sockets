import sys
import socket as Socket
import threading as th

def error(msg):
    print(msg)
    sys.exit()

def send_data(socket):
    while True:
        msg = input(">")
        socket.send(msg.encode("utf-8"))
        if msg == "END": break
    socket.close()
    
def recv_data(socket):
    while True:
        try:
            msg = socket.recv(1024).decode()
            print(msg)
        except:
            break
    print("Disconnected")
        

def main():
    try:
        _ , host, port = sys.argv
    except ValueError as err:
        error(f"{err} -> Usage: python3 {sys.argv[0]} host port")
    
    try:
        port = int(port)
    except ValueError as err:
        error(f"{err} -> Invalid port, {port} is not a number")
    socket = Socket.socket(Socket.AF_INET, Socket.SOCK_STREAM)
    socket.connect((host, int(port)))
    print("Connected")
    socket.send((input("Username: ").encode("utf-8")))
    
    th_send = th.Thread(target = send_data, args = (socket,))
    th_recv = th.Thread(target = recv_data, args = (socket,))

    th_send.start()
    th_recv.start()

    th_send.join()
    th_recv.join()
    socket.close()
    sys.exit()

if __name__ == '__main__':
    main()
