# Memoria box using direct pin

to build this firwmare you must have qmk cli (included in the nix dev shell)
run the following from root of the repository:

```
qmk setup
ln -s "$(pwd)/keyboard/memoria_box/" "$(qmk env QMK_FIRMWARE)/keyboards/"
```

then compile/flash using:
```
qmk compile -kb memoria_box -km default
qmk flash -kb memoria_box -km default
```
