source "virtualbox-iso" "intellinauts-base" {
  vm_name = "IntelliNauts_Base"
  guest_os_type = "Other_Linux"
  guest_additions_mode = "disable"
  cpus = "2"
  memory = "4096"
  iso_url = "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-virt-3.19.1-x86_64.iso"
  iso_checksum = "sha256:366317d854d77fc5db3b2fd774f5e1e5db0a7ac210614fd39ddb555b09dbb344"
  ssh_username = "root"
  ssh_password = "password"
  nic_type = "virtio"
  shutdown_command = "poweroff"
  vboxmanage = [
    [ "modifyvm", "{{.Name}}", "--natpf1", "guest_ssh,tcp,,2022,,22" ]
  ]
  boot_command = [
    # login as root
    "root<enter><wait>",
    # Acquire an IP address in order to be able to issue HTTP requests
    "ifconfig eth0 up && udhcpc -i eth0<enter><wait5>",
    # "wget http://{{ .HTTPIP }}:{{ .HTTPPort }}/alpine-install-options.txt<enter><wait>",
    "cat > alpine-install-options.txt <<EOF<enter>",
    "KEYMAPOPTS=\"us us\"<enter>",
    "HOSTNAMEOPTS=\"-n intellinauts\"<enter>",
    "INTERFACESOPTS=\"auto lo<enter>",
    "iface lo inet loopback<enter>",
    "<enter>",
    "auto eth0<enter>",
    "iface eth0 inet dhcp<enter>",
    "\"<enter>",
    "TIMEZONEOPTS=\"-z UTC\"<enter>",
    "PROXYOPTS=\"none\"<enter>",
    "APKREPOSOPTS=\"-1\"<enter>",
    "SSHDOPTS=\"-c openssh\"<enter>",
    "NTPOPTS=\"-c openntpd\"<enter>",
    "DISKOPTS=\"-L -m sys /dev/sda\"<enter>",
    "EOF<enter><wait5>",
    "cat alpine-install-options.txt<enter><wait5>",
    "setup-alpine -f alpine-install-options.txt<enter><wait5>",
    # Set root user password
    "password<enter><wait>",
    "password<enter><wait5>",
    # Skip additional user creation
    "<wait>no<enter><wait10>",
    # Yes to erase disk prompt, and wait for partitioning to complete
    "<wait>y<enter><wait60>",
    # Reboot so that the newly installed volume gets mounted
    "reboot<enter><wait20>",
    # Not sure why we need to stop ssh
    #    "rc-service sshd stop<enter>",
    # Login after reboot
    "root<enter><wait>",
    "password<enter><wait5>",
    # Allow root user to ssh in
    "echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config<enter>",
    # Reboot
    "reboot<enter>"
  ]
  http_directory = "packer-inputs"

  format = "ova"
  keep_registered = true
}

build {
  name = "intellinauts_base"
  sources = ["sources.virtualbox-iso.intellinauts-base"]
}