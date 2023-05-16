# memory box os

this is a small nixos kiosk image based on x11 as it seems easier to get gpu accelaration over x11 on the pi4 as of today

# build an sd image:

`nix build ".#nixosConfigurations.pi.config.system.build.sdImage"`

# apply an update over the network

`nixos-rebuild switch -j auto --use-remote-sudo --target-host "memoria@<ip>" --flake '.#pi'`
