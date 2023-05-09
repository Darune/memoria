{ config, pkgs, lib, ... }: {

  hardware.bluetooth.enable = true;
  sound.enable = true;
  hardware.pulseaudio.enable = true;
  services.dbus.enable = true;
  time.timeZone = "Europe/Paris";

  # Select internationalisation properties.
  i18n.defaultLocale = "en_US.UTF-8";

  i18n.extraLocaleSettings = {
    LC_ADDRESS = "fr_FR.UTF-8";
    LC_IDENTIFICATION = "fr_FR.UTF-8";
    LC_MEASUREMENT = "fr_FR.UTF-8";
    LC_MONETARY = "fr_FR.UTF-8";
    LC_NAME = "fr_FR.UTF-8";
    LC_NUMERIC = "fr_FR.UTF-8";
    LC_PAPER = "fr_FR.UTF-8";
    LC_TELEPHONE = "fr_FR.UTF-8";
    LC_TIME = "fr_FR.UTF-8";
  };

  # boot = {
  #   kernelPackages = pkgs.linuxPackages_rpi4;
  #   tmpOnTmpfs = true;
  #   initrd.availableKernelModules = [ "usbhid" "usb_storage" ];
  #   # ttyAMA0 is the serial console broken out to the GPIO
  #   kernelParams = [
  #       "8250.nr_uarts=1"
  #       "console=ttyAMA0,115200"
  #       "console=tty1"
  #       # A lot GUI programs need this, nearly all wayland applications
  #       "cma=1M"
  #   ];
  # };

  hardware.enableRedistributableFirmware = true;

  networking = {
    hostName = "memoria"; # Define your hostname.
    networkmanager = {
      enable = true;
    };
  };
  # permission on hid raw
  # KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0660", GROUP="users", TAG+="uaccess", TAG+="udev-acl"
  services.udev.extraRules = ''
    KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0660", TAG+="uaccess", TAG+="udev-acl"
    ACTION=="add", SUBSYSTEM=="drm", KERNEL=="card0", TAG+="systemd"
  '';
  users.users.memoria = {
    isNormalUser = true;
    description = "memoria";
    extraGroups = [ "networkmanager" "wheel" "video" "docker" "tty" "dialout" ];
    shell = pkgs.zsh;
    openssh.authorizedKeys.keys = [ "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHVCe+2trrsnm2YBmldR5HkAiaDVGBJf2RYy9MkW/+WY julien@symaps.io"];
  };

  users.users.root.openssh.authorizedKeys.keys = [ "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHVCe+2trrsnm2YBmldR5HkAiaDVGBJf2RYy9MkW/+WY julien@symaps.io" ];
  security.sudo.wheelNeedsPassword = false;
  programs.zsh.enable = true;
  nixpkgs.config.allowUnfree = true;

  environment.systemPackages = with pkgs; [
    firefox
    chromium
  ];

  services.openssh = {
    enable = true;
    settings.permitRootLogin = "without-password";
  };

  services.cage = {
    enable = true;
    program = "${pkgs.chromium}/bin/chromium-browser --enable-features=UseOzonePlatform --ozone-platform=wayland --ignore-certificate-errors --ignore-gpu-blocklist --ignore-gpu-blacklist --overlay-scrollbars --noerrdialogs --disable-notifications --disable-infobars --start-fullscreen --start-maximized --app=\"https://memories.juedan.net\"";
    user = "memoria";
  };

  systemd.services."cage-tty1" = {
    serviceConfig.Restart = "always";
    environment = {
      WLR_LIBINPUT_NO_DEVICES = "1";
      NO_AT_BRIDGE = "1";
      COG_URL = "https://duckduckgo.com"; # used if no url is specified
    } // lib.optionalAttrs (config.environment.variables ? GDK_PIXBUF_MODULE_FILE) {
      GDK_PIXBUF_MODULE_FILE = config.environment.variables.GDK_PIXBUF_MODULE_FILE;
    };
  };
  # http://memories.juedan.net\"
  # systemd.enableEmergencyMode = false;
  # systemd.services."serial-getty@ttyS0".enable = false;
  # systemd.services."serial-getty@hvc0".enable = false;
  # systemd.services."getty@tty1".enable = false;
  # systemd.services."autovt@".enable = false;

  # services.udisks2.enable = false;
  # documentation.enable = false;
  # powerManagement.enable = false;

  hardware.opengl.enable = true;
  hardware.raspberry-pi."4".fkms-3d.enable = true;

  sdImage.compressImage = false;
  system.stateVersion = "23.05";
  nix.settings.trusted-users = [ "root" "memoria" ];
}