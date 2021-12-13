#!/bin/bash
UNPACKED_DIRECTORY=false
SNAP=false
SYSTEM_PACKAGE=true
for i in "$@"; do
    case $i in
        -s=*|--snap=*|-s|--snap)
        if [[ "$i" = "-s" || "$i" == "--snap" ]]; then
            SNAP=true
            SYSTEM_PACKAGE=false
        else 
            SNAP="${i#*=}"
            SYSTEM_PACKAGE=false
        fi
        shift # past argument=value
        ;;

        -d=*|--unpacked-directory=*)
        UNPACKED_DIRECTORY="${i#*=}"
        SNAP=false
        SYSTEM_PACKAGE=false
        shift # past argument=value
        ;;
    *)
      # unknown option
      ;;
  esac
done

echo "SNAP               = ${SNAP}"
echo "UNPACKED_DIRECTORY = ${UNPACKED_DIRECTORY}"
echo "SYSTEM_PACKAGE     = ${SYSTEM_PACKAGE}"
if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 $1
fi

SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

if [[ "$SYSTEM_PACKAGE" = true ]]; then
    # Blender needs to be installed via the package manager and python3-pip too
    # Deactivate your virtualenv if you have one activated.
    if ! command -v blender &> /dev/null; then
        echo "Blender could not be found as a system package"
        exit
    fi

    BLENDER_VERSION=$(blender -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
    PYTHON_EXECUTABLE=python3
elif [[ "$SNAP" = true ]]; then
    BLENDER_SNAP_LOCATION=/snap/blender/current
    if [[ ! -f $BLENDER_SNAP_LOCATION/blender ]]; then
        echo "Blender could not be found as a snap package"
        exit
    fi
    BLENDER_VERSION=$($BLENDER_SNAP_LOCATION/blender -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
    PYTHON_EXECUTABLE=$(ls $BLENDER_SNAP_LOCATION/$BLENDER_VERSION/python/bin/python*)
    $PYTHON_EXECUTABLE -m ensurepip --upgrade
elif [[ "$UNPACKED_DIRECTORY" != false ]]; then
    if [[] ! -f $UNPACKED_DIRECTORY/blender ]]; then
        echo "Blender could not be found as a unpacked directory"
        exit
    fi
    BLENDER_VERSION=$($UNPACKED_DIRECTORY/blender -v | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1-2)
    PYTHON_EXECUTABLE=$(ls $UNPACKED_DIRECTORY/$BLENDER_VERSION/python/bin/python*)
    $PYTHON_EXECUTABLE -m ensurepip --upgrade
fi

$PYTHON_EXECUTABLE -m pip install $SCRIPT_PATH -t ~/.config/blender/$BLENDER_VERSION/scripts/modules --upgrade --force

# To run blender with the server launched :
# blender yourproject.blend --python $SCRIPT_PATH/test.py
