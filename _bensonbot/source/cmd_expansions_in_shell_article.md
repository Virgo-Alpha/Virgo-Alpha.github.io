---
title: "What exactly happens when you type ls -l *.c and hit Enter in a shell"
---
In this article, I discuss What exactly happens when you type ls -l *.c and hit Enter in a shell

To the uninitiated, the command ls -l *.c seems like a short-hand to listing all c files in the directory in long format. However, what most don’t know is how the Linux shell interprets this command. In this article, I will take you on a step by step process of what happens when you type ls -l *.c on your terminal.

The basics are:

The command is entered and if it’s length is non-null, then it is kept in history(memory)
Parsing
Checking for special characters like pipes
Checking if built-in commands are asked for
Handling pipes if present
Executing system commands & libraries by forking a child and execvp
Printing current directory name and asking for next input.
Step 1: The command is entered and if it’s length is non-null, then it is kept in history(memory)

The command is entered into the terminal and if it is not null (empty), then memory is allocated for it’s storage. It is also stored as part of the log’s history in case you want to see what command was entered at a certain time. An example of a null command would be when you just click enter on the terminal. If this happens, then steps 2 to 6 will be skipped and the terminal will go straight to step 7.

Step 2: Parsing

To parse means to segment a sentence into its constituent parts and describe their syntactic roles. In computing, parse is used in strings, texts and commands. This is the stage at which the computer will differentiate ls from -l and both of them from *.c.

Step 3: Checking for special characters like pipes

It is at this stage that pipes and other special characters are checked. Pipes are a form of redirection of the output of one process to another process instead of the terminal window (STDOUT) for further processing. Thus, by piping, the output of one process becomes the input of another process. It is mostly used to combine operations in UNIX/LINUX systems. This is done by the piping character ‘|’.

Pipes are unidirectional and data flows from left to write.

Step 4: Checking if built-in commands are asked for

Built in commands are stored in a library to reduce repetition when you want to perform a task. This can be done locally through shell scripting with the use of a .sh file. A command like ls is inbuilt. When read it is expanded to list files. The — sign before l is a syntax for the arguments of a command. It is expanded to mean long form. The *.c is expanded to mean all files in the current directory that end with a .c extension.

Step 5: Handling pipes if present

Become a member
As stated earlier, a pipe is a connection between two processes such that the standard output from one process becomes the standard input of the other process. They are mostly handled using the pipe() system call. A few notes about pipes is:

They are unidirectional

The pipe can be used by the creating process, as well as all its child processes, for reading and writing. One process can write to this “virtual file” or pipe and another related process can read from it.
If a process tries to read before something is written to the pipe, the process is suspended until something is written.
The pipe system call finds the first two available positions in the process’s open file table and allocates them for the read and write ends of the pipe.
Press enter or click to view image in full size

The process works on a FIFO (First In First out Model). Size of read and write don’t have to match. One can write 512 bytes but in a pipe data is read byte-by-byte.

Step 6: Executing system commands & libraries by forking a child and execvp.

System commands and libraries are executed using system calls. System calls are a way for programs to interact with the Operating System. A computer program makes a system call when it makes a request to the operating system’s kernel. System call provides the services of the operating system to the user programs via Application Program Interface(API). It provides an interface between a process and operating system to allow user-level processes to request services of the operating system. System calls are the only entry points into the kernel system. All programs needing resources must use system calls. Some of the services provided by system calls are:

Process creation and management
Main memory management
File access, Directory and File system management
Handling device I/O (Input/output)
Protection
Networking
The fork() system call is used to create a new process called a child process that runs concurrently with the process that made it (parent process). After a new child process is created, both processes will execute the next instruction following the fork() system call. A child process uses the same pc(program counter), same CPU registers, same open files which are used in the parent process.

One can use the execvp () call to differentiate the processes run by the parent and child processes.

Step 7: Printing current directory name and asking for next input

Stages one to six ensure that the command entered is executed and kept in history. The last step is the display of the current directory name and a prompt for the next command(usually $).

Authored by:
Benson Mugure, Sumeiya Juma.
