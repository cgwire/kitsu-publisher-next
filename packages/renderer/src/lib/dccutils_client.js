import apisauce from 'apisauce'

class DCCClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.api = apisauce.create({ baseURL: this.baseURL })
    this.context == 'BLENDER'
  }

  get(url, params = {}) {
    return this.api.get(url, params)
  }

  getCameras() {
    return this.get('get_cameras')
  }

  setCamera(camera) {
    return this.get('set_camera', { camera: camera })
  }

  getCurrentScene() {
    return this.get('get_current_scene')
  }

  getCurrentColorSpace() {
    return this.get('get_current_color_space')
  }

  setCurrentColorSpace(color_space) {
    return this.get('set_current_color_space', { color_space: color_space })
  }

  getRenderers() {
    return this.get('get_renderers')
  }

  getBlenderVersion() {
    return this.get('get_blender_version')
  }

  getExtensions(is_video) {
    return this.get('get_extensions', { is_video: is_video })
  }

  takeRenderScreenshot(
    renderer,
    extension,
    output_path = '',
    use_colorspace = false
  ) {
    return this.get('take_render_screenshot', {
      renderer: renderer,
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }

  takeViewportScreenshot(output_path, extension, use_colorspace = false) {
    return this.get('take_viewport_screenshot', {
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }

  takeRenderAnimation(
    renderer,
    extension,
    output_path = '',
    use_colorspace = false
  ) {
    return this.get('take_render_animation', {
      renderer: renderer,
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }

  takeViewportAnimation(output_path, extension, use_colorspace = false) {
    return this.get('take_viewport_animation', {
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }
}

export default DCCClient
