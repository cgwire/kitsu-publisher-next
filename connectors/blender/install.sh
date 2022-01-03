#!/bin/bash

set -e

Help()
{
   # Display Help
   echo "Script to install Blender plugin for the Kitsu Publisher."
   echo
   echo "Usage: install.sh [options]"
   echo "options:"
   echo "-h or --help"
   echo "   Print this help."
   echo "--system"
   echo "   Install the plugin for a system installation."
   echo "--snap"
   echo "   Install the plugin for a snap installation."
   echo "--unpacked-directory=PATH"
   echo "   Install the plugin for an unpacked directory installation. You need to specify the path to this directory."
}

Install_Pip()
{
    echo "Installation of pip."
    $PYTHON_EXECUTABLE -m ensurepip --upgrade
    echo "Pip installed."
}

Do_Install()
{
    echo "Installation of the plugin."
    $PYTHON_EXECUTABLE -m pip install $SCRIPT_PATH -t ~/.config/blender/$BLENDER_VERSION/scripts/addons/modules -U
    cp -f $SCRIPT_PATH/kitsu-publisher.py ~/.config/blender/$BLENDER_VERSION/scripts/addons/
    echo "Plugin for blender installed in ~/.config/blender/$BLENDER_VERSION/scripts/addons/"
    echo "Enabling the plugin in Blender."
    $BLENDER_EXECUTABLE -b -P $SCRIPT_PATH/auto-enable.py
    echo "Plugin enabled."
    exit 0
}

SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

case $1 in
    --system)
        # Blender needs to be installed via the package manager and python3-pip too
        # Deactivate your virtualenv if you have one activated.
        if ! command -v blender &> /dev/null; then
            echo "Blender could not be found as a system package."
            exit
        fi
        BLENDER_EXECUTABLE=blender
        BLENDER_VERSION=$(blender -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit
        fi
        PYTHON_EXECUTABLE=python3
        Do_Install
    ;;

    --snap)
        BLENDER_SNAP_LOCATION=/snap/blender/current
        BLENDER_EXECUTABLE=$BLENDER_SNAP_LOCATION/blender
        if [[ ! -f $BLENDER_EXECUTABLE ]]; then
            echo "Blender could not be found as a snap package at $BLENDER_SNAP_LOCATION."
            exit
        fi
        BLENDER_VERSION=$($BLENDER_EXECUTABLE -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit
        fi
        PYTHON_EXECUTABLE=$(ls $BLENDER_SNAP_LOCATION/$BLENDER_VERSION/python/bin/python*)
        Install_Pip
        Do_Install
    ;;

    --unpacked-directory=*)
        UNPACKED_DIRECTORY="${i#*=}"
        BLENDER_EXECUTABLE=$UNPACKED_DIRECTORY/blender
        if [[ ! -f $BLENDER_EXECUTABLE ]]; then
            echo "Blender could not be found as a unpacked directory at $UNPACKED_DIRECTORY."
            exit
        fi
        BLENDER_VERSION=$($BLENDER_EXECUTABLE -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit
        fi
        PYTHON_EXECUTABLE=$(ls $UNPACKED_DIRECTORY/$BLENDER_VERSION/python/bin/python*)
        Install_Pip
        Do_Install
    ;;

    -h|--help)
    Help
    exit 0
    ;;

    *)
    echo "You need to specify a target (-h for help)."
    exit
    ;;
esac

# To run blender with the server launched :
# blender yourproject.blend --python $SCRIPT_PATH/test.py
