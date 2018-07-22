from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import queue
from data_io import *

from_ardu_q = queue.Queue(0)
to_ardu_q = queue.Queue(0)
to_file_q = queue.Queue(0)

'''data = {'1': {'name': "A", 'y_value': 0, 'x_value': 0},
        '2': {'name': "B", 'y_value': 2000, 'x_value': 1},
        '3': {'name': "C", 'y_value': 3350, 'x_value': 2},
        '4': {'name': "D", 'y_value': 2500, 'x_value': 3},}'''

sequence_to_str = {'0': 'Rocket Startup', '1': 'Diagnostics', '2': 'Launch', '3': 'Recovery', '4': 'Recovery', '5': 'Recovery',}

command_to_str = {'0': 'Heartbeat', '1': 'Data', '2': 'Status Change', '3': 'Statistics'}

status_to_str = {'0': 'Off', '1': 'On', '2': 'Started Up', '3': 'Start Diag', '4': 'Finish Diag', '5': 'Diag Error',
                 '6': 'Ready', '7': 'Launched', '8': 'Coast', '9': 'Apogee', '10': 'Primary Drouge Deploy',
                 '11': 'Secondary Drouge Deploy', '12': 'Primary Mains Deploy', '13': 'Secondary Mains Deploy', '14': 'Landing',
                 '15': 'Landed'}

data = {}
class index(Resource):
    def get(self):
        data = {}
        while not from_ardu_q.empty():
            value = str(from_ardu_q.get(), 'utf-8').replace('\r', '').replace('\n', '').split(',')
            print(value)
            if len(value) >= 3:
                msg_type = int(value[1])
                data[value[0]] = {}
                data[value[0]]['time'] = str(int(value[0])/1000)
                data[value[0]]['sequence'] = sequence_to_str[value[2]]
                data[value[0]]['status_id'] = int(value[3])
                data[value[0]]['status'] = status_to_str[value[3]]

                if msg_type == 1:
                    data[value[0]]['altitude'] = value[5]
                    data[value[0]]['acceleration'] = value[6]
                    data[value[0]]['velocity'] = value[7]
                    data[value[0]]['pressure'] = value[8]
                    data[value[0]]['temperature'] = value[9]
                    data[value[0]]['latitude'] = value[10]
                    data[value[0]]['longitude'] = value[11]

            to_file_q.put(value)
            from_ardu_q.task_done()
        return data


parser = reqparse.RequestParser()
parser.add_argument('command')

def handle_command(data):
    if len(data) > 0:
        to_ardu_q.put(data)
        to_file_q.put(data)
        print(data)

class send_command(Resource):
    def post(self):
        args = parser.parse_args()
        handle_command(args['command'])

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(index, '/')
api.add_resource(send_command, '/send-command/')

def flaskThread():
    app.run(port=5000, use_reloader=False, threaded=True)

if __name__ == "__main__":
    #dm.arduino.start_reading()
    #dm.writer.start_thread()
    ardu = ArduinoIO('COM6', 9600, 150, from_ardu_q, to_ardu_q)
    ardu.start_reading()

    #writer = DataWriter(write_queue=to_file_q)
    #writer.start_thread()

    app.run(port=5000, use_reloader=False, threaded=True)
