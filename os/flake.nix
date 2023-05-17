{
  description = "System Configuration";

  inputs = {
    nixos.url = "github:nixos/nixpkgs/nixos-unstable";
    nixos-hardware.url = "github:nixos/nixos-hardware";
  };

  outputs = { self, ... } @inputs: with inputs; {
    nixosConfigurations.pi = nixos.lib.nixosSystem {
      system = "aarch64-linux";
      modules = [
        # ({...} : {
        #   boot = {
        #     extraModulePackages = [ ];
        #     initrd = {
        #       availableKernelModules = [ "xhci_pci" "usbhid" ];
        #       kernelModules = [ ];
        #     };
        #     kernelPackages = pkgs.linuxPackages_rpi4;
        #     loader = {
        #       raspberryPi = {
        #         enable = true;
        #         uboot.enable = true;
        #         version = 4;
        #         firmwareConfig = ''
        #           arm_freq=1200
        #           dtparam=audio=on
        #         '';
        #       };
        #       grub.enable = false;
        #     };
        #     tmpOnTmpfs = false;
        #   };
        # })
        ({ pkgs, ... }: {
            nixpkgs.overlays = [ (final: super: {
              makeModulesClosure = x:
                super.makeModulesClosure (x // { allowMissing = true; });
            })];
          })
        ({modulesPath, ...}: {
          imports = ["${modulesPath}/installer/sd-card/sd-image-aarch64.nix"];
        })
        nixos-hardware.nixosModules.raspberry-pi-4
        ./configuration_x11.nix
      ];
    };
  };
}