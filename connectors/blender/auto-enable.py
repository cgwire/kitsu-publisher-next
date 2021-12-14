import addon_utils
import bpy

addon_utils.enable("kitsu-publisher", default_set=True)
bpy.ops.wm.save_userpref()
bpy.ops.wm.quit_blender()
