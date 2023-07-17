from ultralytics import YOLO
import cv2
import socket
import pickle
import struct
import sys
import logging

# Load a pretrained YOLOv8 model
model = YOLO("yolov8n.pt") 
coco = {
    0: 'person',
    1: 'bicycle',
    2: 'car',
    3: 'motorcycle',
    4: 'airplane',
    5: 'bus',
    6: 'train',
    7: 'truck',
    8: 'boat',
    9: 'traffic light',
    10: 'fire hydrant',
    11: 'stop sign',
    12: 'parking meter',
    13: 'bench',
    14: 'bird',
    15: 'cat',
    16: 'dog',
    17: 'horse',
    18: 'sheep',
    19: 'cow',
    20: 'elephant',
    21: 'bear',
    22: 'zebra',
    23: 'giraffe',
    24: 'backpack',
    25: 'umbrella',
    26: 'handbag',
    27: 'tie',
    28: 'suitcase',
    29: 'frisbee',
    30: 'skis',
    31: 'snowboard',
    32: 'sports ball',
    33: 'kite',
    34: 'baseball bat',
    35: 'baseball glove',
    36: 'skateboard',
    37: 'surfboard',
    38: 'tennis racket',
    39: 'bottle',
    40: 'wine glass',
    41: 'cup',
    42: 'fork',
    43: 'knife',
    44: 'spoon',
    45: 'bowl',
    46: 'banana',
    47: 'apple',
    48: 'sandwich',
    49: 'orange',
    50: 'broccoli',
    51: 'carrot',
    52: 'hot dog',
    53: 'pizza',
    54: 'donut',
    55: 'cake',
    56: 'chair',
    57: 'couch',
    58: 'potted plant',
    59: 'bed',
    60: 'dining table',
    61: 'toilet',
    62: 'tv',
    63: 'laptop',
    64: 'mouse',
    65: 'remote',
    66: 'keyboard',
    67: 'cell phone',
    68: 'microwave',
    69: 'oven',
    70: 'toaster',
    71: 'sink',
    72: 'refrigerator',
    73: 'book',
    74: 'clock',
    75: 'vase',
    76: 'scissors',
    77: 'teddy bear',
    78: 'hair drier',
    79: 'toothbrush'
}


# Set up logging
logging.basicConfig(level=logging.INFO)

# Named constants for better readability
BUFFER_SIZE = 4096
PAYLOAD_SIZE = struct.calcsize("L")
QUIT_CHAR = 'q'
QUIT_KEY = ord(QUIT_CHAR)

def get_local_ip():
    """Function to get the local IP address."""
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except Exception as e:
        logging.error("Error getting local IP address: %s", e)
        sys.exit(1)

def get_port_from_user():
    """Function to get the port from the user."""
    while True:
        try:
            port = int(input("Please enter the port you want to use: "))
            if 1 <= port <= 65535:  # Valid port numbers are between 1 and 65535
                return port
            else:
                logging.error("Port number must be between 1 and 65535.")
        except ValueError:
            logging.error("Invalid port number. Please enter a valid number.")

def create_server_socket(ip, port):
    """Function to create the server socket."""
    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((ip, port))  # Bind to the socket
        server_socket.listen(5)  # Listen for incoming connections
        return server_socket
    except socket.error as e:
        logging.error("Error creating socket: %s", e)
        sys.exit(1)

def accept_connection(server_socket):
    """Function to accept the incoming connection."""
    try:
        client_socket, addr = server_socket.accept()
        return client_socket, addr
    except socket.error as e:
        logging.error("Error accepting connection: %s", e)
        sys.exit(1)

def receive_data(client_socket, size):
    """Function to receive data from the client socket."""
    data = b''  # Store the frame data here
    while len(data) < size:
        try:
            packet = client_socket.recv(size - len(data))  # Only receive the remaining bytes
            if not packet:
                return None
            data += packet
        except socket.error as e:
            logging.error("Error receiving data: %s", e)
            sys.exit(1)
    return data

def main():
    # Get the local IP address and port number
    local_ip = get_local_ip()
    logging.info("Your local IP address is: %s", local_ip)
    port = get_port_from_user()
    receive_size = True

    # Create the server socket
    server_socket = create_server_socket(local_ip, port)
    
    frame_counter = 0  # Initialize frame_counter

    last_results = []  # Initialize last_results

    while True:
        # Accept the incoming connection
        client_socket, addr = accept_connection(server_socket)

        while True:
            if receive_size:
                # Receive the message size
                data = receive_data(client_socket, PAYLOAD_SIZE)
                if data is None:
                    logging.info("Connection closed.")
                    break
                packed_msg_size = data[:PAYLOAD_SIZE]
                data = data[PAYLOAD_SIZE:]
                msg_size = struct.unpack("L", packed_msg_size)[0]
                receive_size = False  # Only receive the size once

            # Receive the frame data
            data = receive_data(client_socket, msg_size)
            if data is None:
                logging.info("Connection closed.")
                break
            frame_data = data[:msg_size]
            data = data[msg_size:]

            # Deserialize the frame
            try:
                frame = pickle.loads(frame_data)
            except pickle.UnpicklingError:
                logging.error("Error unpickling frame data.")
                break

            # Process the frame with YOLOv8
            frame_counter += 1
            if frame_counter % 3 == 0:
                results = model.track(frame, persist=True)
                last_results = results  # store the latest results

            # Only process every third frame
            frame_counter += 1
            if frame_counter % 3 == 0:
                results = model.track(frame, persist=True)
                last_results = results  # store the latest results

            # If no results were produced, continue to the next frame
            if not last_results or last_results[0] is None:
                continue

            # If no boxes were detected, continue to the next frame
            if last_results[0].boxes is None:
                continue

            # If no ids were detected, continue to the next frame
            if last_results[0].boxes.id is None:
                continue

            # For each detection, draw a rectangle on the frame and put a class label on it
            boxes = last_results[0].boxes.xyxy.cpu().numpy().astype(int)
            ids = last_results[0].boxes.id.cpu().numpy().astype(int)
            for box, id in zip(boxes, ids):
                cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
                cv2.putText(
                    frame,
                    f"{coco[id]}",
                    (box[0], box[1]),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 0, 255),
                    2,
                )

            # Display the frame
            cv2.imshow('frame', frame)
            if cv2.waitKey(1) & 0xFF == QUIT_KEY:
                break

        # Close the client socket
        client_socket.close()

    # Close the server socket when no longer needed
    try:
        server_socket.close()
    except Exception as e:
        logging.error("Error closing server socket: %s", e)

    # Close the OpenCV window
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
