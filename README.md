# Installation
## Requirements:
- Must have Python 3.5+
- npm (latest version will do)

## Process
- Once you have Python installed create a virtual environment (you may need to `pip install virtualenv`) using `virtualenv`.
- Once you have an environment set up clone the Github repo into the root of your virtual environment.
- Activate your virtual environment by running `./Scripts/activate` in the root of the env.
- Once activated go into `backend` folder and run `pip install -r requirements.text` which will install all of the backend requirements.
- Then go into `frontend` folder and run `npm install` which looks for the package.json and installs all the dependencies listed.

# Running:

## Frontend:
- To run the frontend simply be in the `frontend` folder and run `npm start` the virtualenv does NOT need to be activated which makes things easier.

## Backend:
- Make sure the virtualenv is ACTIVATED, then run `python main.py` whilst you have an a serial port which is taking data from an Arduino/Xbee to be processed.
- Once that is running you can manually check the data via opening a browser to `localhost:8000/`