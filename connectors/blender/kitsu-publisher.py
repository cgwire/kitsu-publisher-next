import dccutils_server

bl_info = {
    "name": "Kitsu Publisher",
    "author": "CGWire",
    "description": "Blender plugin for the desktop publisher for Kitsu",
    "warning": "",
    "wiki_url": "https://github.com/cgwire/kitsu-publisher-next/",
    "blender": (2, 80, 0),
    "version": (0, 1, 0),
    "category": "Import-Export",
}

def register():
    dccutils_server.server_start_threading()

def unregister():
    pass # add a stop for the server


# This allows you to run the script directly from Blender's Text editor
# to test the add-on without having to install it.
if __name__ == "__main__":
    register()


