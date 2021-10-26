import uvicorn
import threading

from dccutils.blender import BlenderContext as Context
is_blender = True
context = Context()

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"Hello": "FastAPI"}

@app.get("/list_cameras")
def list_cameras():
    return context.list_cameras()

@app.get("/set_camera")
def set_camera(camera:str):
    return context.set_camera(camera)

@app.get("/get_current_scene")
def get_current_scene():
    return context.get_current_scene()

@app.get("/get_current_color_space")
def get_current_color_space():
    return context.get_current_color_space()

@app.get("/set_current_color_space")
def set_current_color_space(color_space:str):
    return context.set_current_color_space(color_space)

@app.get("/get_available_renderers")
def get_available_renderer():
    return context.get_available_renderers()

if is_blender:
    @app.get("/get_blender_version")
    def get_blender_version():
        return context.get_blender_version()

@app.get("/list_extensions")
def list_extensions(is_video : bool=False):
    return context.list_extensions(is_video)

@app.get("/take_viewport_screenshot")
def take_viewport_screenshot(output_path:str, extension:str):
    context.push_state()
    try:
        output_path = context.take_viewport_screenshot(output_path, extension)
    except:
        output_path = None
    finally:
        context.pop_state()
    return output_path

@app.get("/take_render_screenshot")
def take_render_screenshot(renderer:str, output_path:str, extension:str, use_colorspace: bool=False):
    context.push_state()
    output_path = None
    try:
        output_path = context.take_render_screenshot(renderer, output_path, extension, use_colorspace)
    except:
        output_path = None
    finally:
        context.pop_state()
    return output_path

@app.get("/take_viewport_animation")
def take_viewport_animation(output_path:str, container:str):
    context.push_state()
    try:
        output_path = context.take_viewport_animation(output_path, container)
    except:
        output_path = None
    finally:
        context.pop_state()
    return output_path

@app.get("/take_render_animation")
def take_render_animation(renderer:str, output_path:str, container:str, use_colorspace: bool=False):
    context.push_state()
    try:
        output_path = context.take_render_animation(renderer, output_path, container, use_colorspace)
    except:
        output_path = None
    finally:
        context.pop_state()
    return output_path


def server_start():
    uvicorn.run(app, host="127.0.0.1", port=8089)

def server_start_threading(): # TODO : create a server stop
    t = threading.Thread(target=server_start)
    t.daemon = True
    t.start()
