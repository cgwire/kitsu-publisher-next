#!/bin/bash
# blender needs to be installed and python3/python3-pip too
# sudo apt install blender python3 python3-pip -y
# deactivate your virtualenv if you have one. We have to use system's Python.
BLENDER_VERSION=$(blender -v | cut -d' ' -f2)
SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
pip install $SCRIPT_PATH -t ~/.config/blender/$BLENDER_VERSION/scripts/modules/ --upgrade --force

# To run blender with the server launched :

# blender yourproject.blend --python $SCRIPT_PATH/test.py
