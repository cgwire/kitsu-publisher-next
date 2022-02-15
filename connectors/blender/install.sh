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
   echo "   Install the plugin for a system (via a package manager like apt for example) installation (works only on Linux)."
   echo "--snap"
   echo "   Install the plugin for a snap installation (works only on Linux)."
   echo "--dmg"
   echo "   Install the plugin for a dmg installation (works only on macOS)."
   echo "--unpacked-directory=PATH"
   echo "   Install the plugin for an unpacked directory installation. You need to specify the path to this directory."
}

Install_Pip()
{
    echo "Installation of pip."
    "$PYTHON_EXECUTABLE" -m ensurepip --upgrade
    echo "Pip installed."
}

Do_Install()
{
    echo "Installation of the plugin."
    if [[ $OSTYPE == 'darwin'* ]]; then
        BLENDER_ADDONS_PATH=~/Library/Application\ Support/Blender/$BLENDER_VERSION/scripts
    else
        BLENDER_ADDONS_PATH=~/.config/blender/$BLENDER_VERSION/scripts
    fi

    "$PYTHON_EXECUTABLE" -m pip install "$SCRIPT_PATH" -t "$BLENDER_ADDONS_PATH/modules" -U
    cp -f "$SCRIPT_PATH/kitsu-publisher.py" "$BLENDER_ADDONS_PATH"
    echo "Plugin for blender installed in $BLENDER_ADDONS_PATH"
    echo "Enabling the plugin in Blender."
    "$BLENDER_EXECUTABLE" -b -P "$SCRIPT_PATH/auto-enable.py"
    echo "Plugin enabled."
    exit 0
}

SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

case $1 in
    --system)
        # Blender needs to be installed via the package manager and python3-pip too
        # Deactivate your virtualenv if you have one activated.
        if [[ $OSTYPE == 'darwin'* ]]; then
            echo 'Installation of the plugin for a system (via a package manager like apt for example) installation works only on Linux, not macOS.'
            exit 1
        fi
        if ! command -v blender &> /dev/null; then
            echo "Blender could not be found as a system installation."
            exit 1
        fi
        BLENDER_EXECUTABLE=blender
        BLENDER_VERSION=$(blender -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit 1
        fi
        PYTHON_EXECUTABLE=python3
        Do_Install
    ;;

    --snap)
        if [[ $OSTYPE == 'darwin'* ]]; then
            echo 'Installation of the plugin for a snap installation works only on Linux, not macOS.'
            exit 1
        fi
        BLENDER_SNAP_LOCATION=/snap/blender/current
        BLENDER_EXECUTABLE=$BLENDER_SNAP_LOCATION/blender
        if [[ ! -f "$BLENDER_EXECUTABLE" ]]; then
            echo "Blender could not be found as a snap installation at $BLENDER_SNAP_LOCATION."
            exit 1
        fi
        BLENDER_VERSION=$("$BLENDER_EXECUTABLE" -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit 1
        fi
        PYTHON_EXECUTABLE=$(ls $BLENDER_SNAP_LOCATION/$BLENDER_VERSION/python/bin/python*)
        Install_Pip
        Do_Install
    ;;

    --dmg)
        if [[ $OSTYPE != 'darwin'* ]]; then
            echo 'Installation of the plugin for a dmg installation works only on macOS, not Linux.'
            exit 1
        fi
        BLENDER_DMG_LOCATION=/Applications/Blender.app/Contents/MacOS
        BLENDER_EXECUTABLE=$BLENDER_DMG_LOCATION/blender
        if [[ ! -f "$BLENDER_EXECUTABLE" ]]; then
            echo "Blender could not be found as a dmg installation at $BLENDER_DMG_LOCATION."
            exit 1
        fi
        BLENDER_VERSION=$("$BLENDER_EXECUTABLE" -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit 1
        fi
        PYTHON_EXECUTABLE=$(ls $BLENDER_DMG_LOCATION/../Resources/$BLENDER_VERSION/python/bin/python*)
        Install_Pip
        Do_Install
    ;;

    --unpacked-directory=*)
        UNPACKED_DIRECTORY=${1#*=}
        BLENDER_EXECUTABLE=$UNPACKED_DIRECTORY/blender
        if [[ ! -f "$BLENDER_EXECUTABLE" ]]; then
            echo "Blender could not be found as a unpacked directory at $UNPACKED_DIRECTORY."
            exit 1
        fi
        BLENDER_VERSION=$("$BLENDER_EXECUTABLE" -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
        BLENDER_VERSION_SPLIT=(${BLENDER_VERSION//./ })
        if [ ${BLENDER_VERSION_SPLIT[0]} -lt 2 ] || ([ ${BLENDER_VERSION_SPLIT[0]} -eq 2 ] && [ ${BLENDER_VERSION_SPLIT[1]} -lt 80 ]); then
            echo "Blender plugin for the Kitsu Publisher cannot be installed on Blender < 2.80."
            exit 1
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
    exit 1
    ;;
esac

# To run blender with the server launched :
# blender yourproject.blend --python $SCRIPT_PATH/test.py
