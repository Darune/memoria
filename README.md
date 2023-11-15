# memoria

This is the source code for the memoria box,
an interactive and playfull editing station. 

This project takes a list of videos, and sound
take random number of subpart of each video and chain them together
the use is then prompted to add some filters on top of this random film editing.

here is how it looked in the end:
![image](https://github.com/Darune/memoria/blob/main/memoria-box.jpg)

# Repository

This project is separated in multiple folders: 

- memories-gen: The web application that is displayed (contains an api and a frontend to generate, select, edit, view, archive short films)
- 3d mockups : the editing box contains 6 buttons, those buttons allow navigation on the interface but also allow  filme filters selection
- os: The operating system (for a raspberry pi 4) that will host all the part together, start a web browser to localhost
- keyboard: A QMK custom keyboard firmware to be flashed on a promicro to handle the input by the user
