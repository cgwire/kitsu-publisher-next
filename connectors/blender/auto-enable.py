import addon_utils
import bpy

list_addons_enabled = [
    addon.module for addon in bpy.context.preferences.addons
]
if not "kitsu-publisher" in list_addons_enabled:
    addon_utils.enable("kitsu-publisher", default_set=True)
    bpy.ops.wm.save_userpref()

bpy.ops.wm.quit_blender()
