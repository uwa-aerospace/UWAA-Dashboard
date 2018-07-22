import serial

serial = serial.Serial('COM4', 9600, timeout=5)

for i in range(10):
    serial.write(str.encode('Hello;'))
    print('Sent Message %s' % i)
    serial.flush()

print(serial.read_until(';'))

print('Received')

serial.close()