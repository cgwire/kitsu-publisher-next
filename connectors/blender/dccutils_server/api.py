import os
import traceback
import tempfile
import datetime

from fastapi import FastAPI, HTTPException

from dccutils.guess import GuessedContext

context = GuessedContext()

app = FastAPI()


@app.get("/")
def home():
    return {
        "dcc_name": context.get_dcc_name(),
        "dcc_version": context.get_dcc_version(),
        "current_project": context.get_filepath(),
    }


@app.get("/get-cameras")
def get_cameras():
    return context.list_cameras()


@app.get("/set-camera")
def set_camera(camera: str):
    return context.set_camera(camera)


@app.get("/get-renderers")
def get_renderers():
    return context.get_available_renderers()


@app.get("/get-extensions")
def get_extensions(is_video: bool = False):
    return context.list_extensions(is_video)


@app.get("/get-current-color-space")
def get_current_color_space():
    return context.get_current_color_space()


@app.get("/set-current-color-space")
def set_current_color_space(color_space: str):
    return context.set_current_color_space(color_space)


@app.get("/take-viewport-screenshot")
def take_viewport_screenshot(extension: str, output_path: str = ""):
    output_path = generate_output_path(output_path, extension, False)
    context.push_state()
    try:
        context.take_viewport_screenshot(output_path, extension)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


@app.get("/take-render-screenshot")
def take_render_screenshot(
    renderer: str, extension: str, output_path: str = "", use_colorspace: bool = False
):
    output_path = generate_output_path(output_path, extension, False)
    context.push_state()
    try:
        context.take_render_screenshot(renderer, output_path, extension, use_colorspace)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


@app.get("/take-viewport-animation")
def take_viewport_animation(output_path: str, extension: str):
    output_path = generate_output_path(output_path, extension, True)
    context.push_state()
    try:
        context.take_viewport_animation(output_path, extension)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


@app.get("/take-render-animation")
def take_render_animation(
    renderer: str, extension: str, output_path: str = "", use_colorspace: bool = False
):
    output_path = generate_output_path(output_path, extension, True)
    context.push_state()
    try:
        context.take_render_animation(renderer, output_path, extension, use_colorspace)
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    finally:
        context.pop_state()
    return {"file": output_path}


def generate_output_path(output_path="", extension="", is_video=False):
    if not output_path or os.path.isdir(output_path):
        extension_str = ""
        for extension_list in context.list_extensions(is_video):
            if extension_list[1] == extension:
                extension_str = extension_list[0]
                break
        if extension_str == "":
            extension_str = context.list_extensions(is_video)[0][0]
        return os.path.join(
            tempfile.gettempdir() if not output_path else output_path,
            "%s-%s%s"
            % (
                context.get_dcc_name(),
                datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S"),
                extension_str,
            ),
        )
    return output_path
