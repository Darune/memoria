{ config, pkgs, lib, ... }: let
  autostart = ''
    #!${pkgs.bash}/bin/bash
    # End all lines with '&' to not halt startup script execution

    ${pkgs.chromium}/bin/chromium-browser --ignore-gpu-blocklist --ignore-gpu-blacklist --overlay-scrollbars --noerrdialogs --disable-notifications --disable-infobars --start-fullscreen --start-maximized --app="https://memories.juedan.net"
  '';

  inherit (pkgs) writeScript;
in{

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

  services.xserver = {
    enable = true;
    layout = "us"; # keyboard layout
    libinput.enable = true;

    # Let lightdm handle autologin
    displayManager.lightdm = {
      enable = true;
      # autoLogin = {
      #   timeout = 0;
      # };
    };

    # Start openbox after autologin
    windowManager.openbox.enable = true;
    displayManager = {
      defaultSession = "none+openbox";
      autoLogin = {
        user = "memoria";
        enable = true;
      };
    };
  };

  systemd.services."display-manager".after = [
    "network-online.target"
    "systemd-resolved.service"
  ];

  # Overlay to set custom autostart script for openbox
  nixpkgs.overlays = with pkgs; [
    (_self: super: {
      openbox = super.openbox.overrideAttrs (_oldAttrs: rec {
        postFixup = ''
          ln -sf /etc/openbox/autostart $out/etc/xdg/openbox/autostart
        '';
      });
    })
  ];

  # By defining the script source outside of the overlay, we don't have to
  # rebuild the package every time we change the startup script.
  environment.etc."openbox/autostart".source = writeScript "autostart" autostart;
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