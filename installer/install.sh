#!/bin/bash

# Changed date: 2016-12-01
# Author: Emil Larsson
# Email: emil.larzzon@outlook.com
# Description: Install and configure, not reconfigure.
#
# NOTE: If you run this twice /etc/crontab will be dubbled
#
# wget http://web1.spi.net/speedpi-v1.gz
# tar -zxvf speedpi-v1.tar.gz && chmod 755 install.sh && ./install.sh

echo "Enter desired hostname: "
read vpnconf
echo "Enter desired location ID: "
read locationid

# Change hostname
echo "Changing hostname to: $vpnconf"
sed -i "s/ubuntu/$vpnconf/g" /etc/hosts
sed -i "s/ubuntu/$vpnconf/g" /etc/hostname

# Change location ID
echo "Changing location ID to: $locationid"
sed -i "s/speciallocationid/$locationid/g" /opt/speedpi/pinger.py
sed -i "s/speciallocationid/$locationid/g" /opt/speedpi/speedtest-csv


# OpenVPN
apt update
apt install -y dos2unix
apt install -y openvpn

dos2unix -k -o temp_openvpn
mv /etc/default/openvpn /etc/default/openvpn.bak
mv /opt/temp_openvpn /etc/default/openvpn
systemctl daemon-reload

mv $vpnconf.ovpn /etc/openvpn/$vpnconf.conf


# Filebeat
### wget https://beats-nightlies.s3.amazonaws.com/jenkins/filebeat/999-c48b6f28108b7d3ed9d560500732db9a9d48ba14/filebeat-linux-arm
mv filebeat/filebeat.service /lib/systemd/system/
systemctl enable filebeat
chmod 755 /opt/filebeat/filebeat-linux-arm

# Speedpi
chmod 755 /opt/speedpi/pinger.py
chmod 755 /opt/speedpi/run_pingtest.sh
chmod 755 /opt/speedpi/run_speedtest.sh
chmod 755 /opt/speedpi/speedtest-csv

# Crontab
cronfile=/etc/crontab

if [[ 'grep "MARK FOR IF" $cronfile' ]];then
	echo "Cron settings already exists!"
else
	echo "New installation. Add cron settings"
	dos2unix -k -o crontab
	cat crontab >> /etc/crontab
fi


# Install speedtest-cli
apt install -y speedtest-cli



# Cleanup
rm -f crontab
rm -f install.sh

