source "virtualbox-ovf" "intellinauts-devtools" {
  source_path = "./output-intellinauts-corepkg/IntelliNauts_CorePkg.ova"
  # TODO once corepkg is stabilized, add checksum value here
  checksum = "none"
  vm_name = "IntelliNauts_Devtools"
  communicator = "ssh"
  ssh_username = "root"
  ssh_password = "password"
  shutdown_command = "poweroff"
  guest_additions_mode = "disable"
  format = "ova"
  keep_registered = true
}

build {
  name = "intellinauts_devtools"
  sources = ["sources.virtualbox-ovf.intellinauts-devtools"]
  provisioner "shell" {
    inline = [
      "apk add --no-cache tmux vim emacs nano curl bash git jq yq",
    ]
  }
}