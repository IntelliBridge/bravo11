source "virtualbox-ovf" "intellinauts-corepkg" {
  source_path = "./output-intellinauts-base/IntelliNauts_Base.ova"
  checksum = "none"
  vm_name = "IntelliNauts_CorePkg"
  communicator = "ssh"
  ssh_username = "root"
  ssh_password = "password"
  shutdown_command = "poweroff"
  guest_additions_mode = "disable"
  format = "ova"
  keep_registered = true
}

build {
  name = "intellinauts_corepkg"
  sources = ["sources.virtualbox-ovf.intellinauts-corepkg"]
  provisioner "shell" {
    inline = [
      "sed -e 's/#\\(http.*\\/v[0-9\\.]\\+\\/community\\)/\\1/' -i /etc/apk/repositories",
      "apk add --no-cache virtualbox-guest-additions",
      "apk add --no-cache docker docker-compose",
      "apk add --no-cache parted mandoc",
      "rc-update add docker boot",
      "service docker start"
    ]
  }
}