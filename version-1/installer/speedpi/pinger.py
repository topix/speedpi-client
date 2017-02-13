import os
import subprocess
import re
import datetime
from time import strftime


##################################
# Host to ping
hostname = "8.8.8.8"
# File
filename = "ping_data.csv"
# Result
result = "0000-00-01 00:00:00.000"
# Location ID
location_id = "speciallocationid"
##################################

def createFile():
    try:
        file = open(filename, 'a')

        file.close()
    except:
        print("error world is ending")
createFile()

def timeStamper():
    # Write ze funktionalitet
    timestamp = datetime.datetime.now()
    milisecond = str(round(timestamp.microsecond/1000))
    date = str(strftime("%Y-%m-%d"))
    hms = str(strftime("%H:%M:%S."))
    hmsf = hms + milisecond

    result = date + " " + hmsf
    return result
	
def getserial():
  # Extract serial from cpuinfo file
  cpuserial = "0000000000000000"
  try:
    f = open('/proc/cpuinfo','r')
    for line in f:
      if line[0:6]=='Serial':
        cpuserial = line[10:26]
    f.close()
  except:
    cpuserial = "ERROR000000000"

  return cpuserial


# Timer start
timestart = timeStamper()

# Ping the server
ping = subprocess.Popen(["ping", "-c 4", hostname], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# Save the answer into a variable
out = ping.communicate()
# Parse the ping output
newoutput = str(out)
out1 = newoutput.split("mdev = ", 1)[1]
out2 = out1.split("/")
out3 = str(out2)
out4 = re.sub('[^0-9,.]', '', out3)
out5 = out4.split(",")
# Save list into variables
min = out5[0]
avg = out5[1]
max = out5[2]
mdev = out5[3]

# Timer stop
timestop = timeStamper()

serial = getserial()



# Print end result to CSVs
sep = ";"
with open(filename, "a") as file:
    # timestart, timestop, host, min, max, avg, mdev
    file.write(timestart + sep + timestop + sep + hostname + sep + min + sep + max + sep + avg + sep + mdev + sep + serial + sep + location_id)
    file.write("\n")

    file.close()



"""
response = os.system("ping -c 1 " + hostname)

#and then check the response...
if response == 0:
  print (hostname, 'is up!')
else:
  print (hostname, 'is down!')

print(response)
"""