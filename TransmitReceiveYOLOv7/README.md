# TransmitReceiveYOLOv7

This project is a YOLOv7 image transmitter and receiver for object detection. The setup is divided between two devices: a transmitter device which handles the camera and a receiver device which processes the data.

## Dependencies

This project requires Python 3.9 or higher and the following Python libraries installed:

- [PyTorch](https://pytorch.org/) (1.8.1+cu111)
- [opencv-python](https://pypi.org/project/opencv-python/)
- [numpy](https://numpy.org/)

You can install these dependencies with pip:

```bash
pip install torch==1.8.1+cu111 opencv-python numpy
```

Please visit the official PyTorch website to find the appropriate torchvision version and the installation command for your specific system (including CPU-only, CUDA, and other variants).

## Transmitter Setup

Follow these instructions on the device which will handle the camera.

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/FeroxShark/TransmitReceiveYOLOv7.git
    cd TransmitReceiveYOLOv7
    ```

2. Install necessary Python dependencies for the transmitter:

    ```bash
    pip install -r transmitter_requirements.txt
    ```

3. Run the transmitter script:

    ```bash
    python transmitter.py
    ```

## Receiver

This is the receiver part of the TransmitReceiveYOLOv7 project, which receives images from a transmitter and performs object detection with YOLOv7.
Follow these instructions on the device which will process the data.

Depending on your system, install PyTorch:

If your system has a compatible GPU, install PyTorch with GPU support by following the instructions on the PyTorch website (https://pytorch.org/get-started/locally/). Make sure to install the correct versions, in this project we use PyTorch 1.8.1 and the corresponding torchvision version.

If your system doesn't have a compatible GPU, you can install PyTorch with CPU support instead. Visit the official PyTorch website (https://pytorch.org/get-started/locally/) and follow the instructions for CPU-only systems.

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/FeroxShark/TransmitReceiveYOLOv7.git
    cd TransmitReceiveYOLOv7
    ```

2. Clone the YOLOv7 repository and navigate to its directory:

    ```bash
    git clone https://github.com/WongKinYiu/yolov7.git
    cd yolov7
    ```

3. Install necessary Python dependencies:

    ```bash
    pip3 install -r requirements.txt
    pip3 install onnx onnxsim onnxruntime
    ```

4. Depending on your system, install PyTorch:

   - If your system has a compatible GPU, install PyTorch with GPU support by following the instructions on [the PyTorch website](https://pytorch.org/get-started/locally/).
   
   - If your system doesn't have a compatible GPU, you can install PyTorch with CPU support instead:

        ```bash
        pip install torch==1.8.1+cu111 -f https://download.pytorch.org/whl/cpu/torch_stable.html
        ```
   Note: Replace the PyTorch, torchvision, and torchaudio versions with the versions you are actually using in your project.

5. Download the weights for YOLOv7:

    - yolov7.weights: [[Download Link]](https://github.com/WongKinYiu/yolov7/releases/download/v0.1/yolov7.weights)
    - yolov7.pt: [[Download Link]](https://github.com/WongKinYiu/yolov7/releases/download/v0.1/yolov7.pt)
    - yolo7.yaml: [[Download Link]](https://github.com/WongKinYiu/yolov7/blob/main/cfg/deploy/yolov7.yaml)
    - coco.yaml: [[Download Link]](https://github.com/WongKinYiu/yolov7/blob/main/data/coco.yaml)
    
    After you have downloaded these files, place them in the `yolov7` directory.

6. Navigate back to the `TransmitReceiveYOLOv7` directory:

    ```bash
    cd ..
    ```

7. Install any other necessary dependencies for the receiver:

    ```bash
    pip install -r receiver_requirements.txt
    ```

8. Run the receiver script:

    ```bash
    python receiver.py
    ```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
