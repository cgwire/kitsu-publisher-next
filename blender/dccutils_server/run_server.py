import os
import threading
import traceback
import tempfile
import datetime

from dccutils.blender import BlenderContext as Context

is_blender = True
context = Context()

from fastapi import FastAPI, HTTPException
import uvicorn

app = FastAPI()


@app.get("/")
def home():
    return {"Hello": "FastAPI"}


@app.get("/get_cameras")
def get_cameras():
    return [camera[0] for camera in context.list_cameras()]


@app.get("/set_camera")
def set_camera(camera: str):
    return context.set_camera(camera)


@app.get("/get_current_scene")
def get_current_scene():
    return context.get_current_scene()


@app.get("/get_current_color_space")
def get_current_color_space():
    return context.get_current_color_space()


@app.get("/set_current_color_space")
def set_current_color_space(color_space: str):
    return context.set_current_color_space(color_space)


@app.get("/get_renderers")
def get_renderers():
    return context.get_available_renderers()


if is_blender:

    @app.get("/get_blender_version")
    def get_blender_version():
        return context.get_blender_version()


@app.get("/get_extensions")
def get_extensions(is_video: bool = False):
    return context.list_extensions(is_video)


@app.get("/take_viewport_screenshot")
def take_viewport_screenshot(extension: str, output_path: str = ""):
    if not output_path:
        extension_str = ""
        for extension_list in context.list_extensions(False):
            if extension_list[1] == extension:
                extension_str = extension_list[0]
                break
        output_path = os.path.join(
            tempfile.gettempdir(),
            "blender-%s%s"
            % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), extension_str),
        )
    context.push_state()
    try:
        context.take_viewport_screenshot(output_path, extension)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


@app.get("/take_render_screenshot")
def take_render_screenshot(
    renderer: str, extension: str, output_path: str = "", use_colorspace: bool = False
):
    if not output_path:
        extension_str = ""
        for extension_list in context.list_extensions(False):
            if extension_list[1] == extension:
                extension_str = extension_list[0]
                break
        output_path = os.path.join(
            tempfile.gettempdir(),
            "blender-%s%s"
            % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), extension_str),
        )
    context.push_state()
    try:
        context.take_render_screenshot(renderer, output_path, extension, use_colorspace)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


@app.get("/take_viewport_animation")
def take_viewport_animation(output_path: str, extension: str):
    if not output_path:
        extension_str = ""
        for extension_list in context.list_extensions(False):
            if extension_list[1] == extension:
                extension_str = extension_list[0]
                break
        output_path = os.path.join(
            tempfile.gettempdir(),
            "blender-%s%s"
            % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), extension_str),
        )
    context.push_state()
    try:
        context.take_viewport_animation(output_path, extension)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


@app.get("/take_render_animation")
def take_render_animation(
    renderer: str, extension: str, output_path: str = "", use_colorspace: bool = False
):
    if not output_path:
        extension_str = ""
        for extension_list in context.list_extensions(True):
            if extension_list[1] == extension:
                extension_str = extension_list[0]
                break
        output_path = os.path.join(
            tempfile.gettempdir(),
            "blender-%s%s"
            % (datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S"), extension_str),
        )
    context.push_state()
    try:
        context.take_render_animation(renderer, output_path, extension, use_colorspace)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


def server_start():
    uvicorn.run(app, host="127.0.0.1", port=8089)


def server_start_threading():  # TODO : create a server stop
    thread = threading.Thread(target=server_start)
    thread.daemon = True
    thread.start()
    return thread
