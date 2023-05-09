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