sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt update

sudo apt-get install -y \
 dnsmasq hostapd nodejs xinput npm libgconf2-4 gnome-tweak-tool net-tools chromium-browser \
 bluez pulseaudio-module-bluetooth python-gobject python-gobject-2 bluez-tools udev nmap \
 mongodb git openssh-server tmux 

# https://raspberrypi.stackexchange.com/questions/47708/setup-raspberry-pi-3-as-bluetooth-speaker
sudo usermod -a -G lp $(whoami)
sudo nano /etc/bluetooth/audio.conf
  Enable=Source,Sink,Media,Socket
sudo nano /etc/bluetooth/main.conf
  Class = 0x00041C
pulseaudio -D
sudo nano /etc/udev/rules.d/99-input.rules
  SUBSYSTEM="input", GROUP="input", MODE="0660"
  KERNEL=="input[0-9]*", RUN+="/usr/lib/udev/bluetooth"
sudo mkdir /usr/lib/udev
sudo nano /usr/lib/udev/bluetooth

cd ~
git clone https://github.com/oblique/create_ap
cd create_ap
git reset --hard f906559f44afe6397a1775d0d2bc99d1e622b2fd
make install

sudo npm install -g pm2 nw  #--unsafe-perm=true --allow-root
sudo python -m pip install pymongo numpy opencv-python
 

sudo create_ap --mkconfig /etc/create_ap.conf wlx70f11c021d3b enp3s0 dash mypassword
systemctl enable create_ap

## install open-dash
cd ~
git clone https://github.com/physiii/open-dash /
cd open-dash
npm install

## set open-dash to auto start with pm2
pm2 startup nwpm.js
sudo pm2 startup systemd


#install power off script
sudo cp power /etc/acpi/events/
sudo cp power.sh /etc/acpi/
sudo chmod /etc/acpi/power.sh 755 


