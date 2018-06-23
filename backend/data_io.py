import datetime, time, threading, queue
import serial

class DataManager():
    """
    Acts as an interface between the Flask backend and the I/O with the Arduino.
    """
    def __init__(self, *args, **kwargs):
        self.arduino = ArduinoIO(kwargs['COM_PORT'], kwargs['BAUD_RATE'], kwargs['IO_TIMEOUT'])
        self.writer = DataWriter()
        self.delta_data = {'raw_data': []}

    def get_data_delta(self):
        self.delta_data['raw_data'] = []
        while not self.arduino.process_queue.empty():
            value = self.arduino.process_queue.get()
            #process shit
            self.writer.write_queue.put(value)
            self.delta_data['raw_data'].append(value)
            self.arduino.process_queue.task_done()
        return self.delta_data

    def send_message(self, message):
        #process message for arduino
        self.arduino.message_queue.put(message)
        self.writer.write_queue.put(message)

class ArduinoIO():
    """
    Makes use of the pySerial library to open a specific port on the machine and read the data come through that port.
    It then puts this data in its processing queue, from where a different processing thread takes the data from.
    """
    def __init__(self, port_name, baud_rate, timeout, in_q, out_q):
        self.port_name = port_name
        self.baud_rate = baud_rate
        self.timeout = timeout
        self.time_dif = time.time()
        self.serial = serial.Serial(port_name, baud_rate, timeout=timeout)
        self.process_queue = in_q
        self.message_queue = out_q
        self.running = False
        self.line = ""
        self.process_thread = threading.Thread(target=self.perform_data_io)
        self.process_thread.setDaemon(True)

    def start_reading(self):
        self.running = True
        self.process_thread.start()

    def stop_reading(self):
        self.serial.close()
        self.running = False

    def perform_data_io(self):
        """
        Reads what is currently available on the serial port and sends it to a queue to be processed by a different thread
        """
        while self.running:
            while not self.message_queue.empty():
                message = self.message_queue.get()
                self.serial.write(str.encode(message))
                self.message_queue.task_done()

            data_waiting = self.serial.in_waiting  # find num of bytes currently waiting in hardware
            if data_waiting > 0:
                self.line = self.serial.readline()
                self.process_queue.put(self.line)
                self.line = ""


class DataWriter():
    """
    Uses a thread to take data from a queue object and write to an output file on disk.
    """
    def __init__(self, **kwargs):
        self.write_thread = threading.Thread(target=self.write_data)
        self.write_thread.setDaemon(True)
        self.write_queue = kwargs['write_queue']
        self.file_name = self.get_file_name()
        self.file_output = open('flightdata/{0}.txt'.format(self.file_name), 'w+')
        self.running = False

    def get_file_name(self):
        return datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

    def start_thread(self):
        self.running = True
        self.write_thread.start()

    def stop_thread(self):
        self.file_output.close()
        self.running = False

    def write_data(self):
        while self.running:
            if not self.write_queue.empty():
                try:
                    line = self.write_queue.get()
                    self.file_output.write(line)
                    self.write_queue.task_done()
                    self.file_output.flush()
                except Exception:
                    pass
                    #print('Error writing data to file.')
