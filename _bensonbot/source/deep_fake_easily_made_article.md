---
title: "Deep Fake, Easily Made"
---
In this article, I discuss how to make a deep fake easily

Refacer is an open source library that allows easy replacement of faces in a video. In this article, I will detail how to use it in order to do exactly that.

Prerequisites
A laptop/desktop device (I suppose even a tablet could work)
A Github Account
You will also need to prepare the files you will need in the refacing process -

Source Video: the original video that you wish to clone; for this tutorial, we’ll use a scene from the “The Harder They Fall.” For the initial test run, I would suggest you use a short video that is a minute-long or even shorter.

Target Face Images: Images of the faces you intend to manipulate. These could be screenshots from the video or other sources. For this tutorial, my target face was that of Cherokee Bill played by LaKeith Stanfield.

Replacement Faces Images: Images of the faces that will replace the original faces in the target video. Please make sure you have the consent to use these pictures / faces from the person. For this tutorial I used my own face.

Refacing
To create the deep fake, we will use the refacer repository available on Github here. Before using the app make sure you have read the disclaimer at the end of this project or on the GitHub repository. You can access the Refacer using a Google colab notebook but since that did not work for me, this tutorial will guide you through the longer route - running the project locally.

Setup
I will assume that you are working on linux or any other unix-based system (as is the Godly thing to do as a developer).

Navigate to the directory you want to store the project in (I recommend creating a new folder altogether)
Download this file inswapper_128.onnx and place it inside the folder you just created.
In the terminal, navigate to the folder you just created
Clone the Rafacer repository from GitHub using the below command: git clone https://github.com/xaviviro/refacer.git
Navigate to the refacer directory by using the command cd refacer if you are on linux/mac or chdir refacer if you are on windows
Open the requirements.txt file and replace gradio==3.33.1 with gradio==3.36.1 and save & close
Install packages: pip install -r requirements.txt
Run the app: python app.py
Finally, open your web browser and navigate to the following address: http://127.0.0.1:7680
The Refacer Interface
On the specified port, you should see an interface that looks like the one below:

Reface User Interface on the Web

The main sections are:

Original Video Upload: Upload the source video to this section.
Target Faces Placement: Place the faces in the video that you want to replace; up to five faces are supported.
Replacement Faces Placement: Position the faces that will replace the corresponding faces uploaded to section (2).
Output File Display: The resulting file will be displayed here.
Upload the required files
Upload the respective files to their designated sections and click “Reface” (The big orange button at the bottom of the page). This action initiates a process that will “reface” all frames in the video using the provided faces. Please note that this process may take some time.

Refacer Interface with uploaded media

You can check the terminal to see progress being made. I would also recommend that if you have a light-weight device, you could close all other running apps and leave the device for refacing.

Accessing your video
Your output/refaced video will be in the /out folder. For the full path, please check your terminal. You can also view the refaced video on the browser.

Sharing
Please be sure to share your refaced video like I did here and if you can, tag me!

Till next time comrades, may the force be with you!
