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
    return this.get('get-cameras')
  }

  setCamera(camera) {
    return this.get('set-camera', { camera: camera })
  }

  getCurrentScene() {
    return this.get('get-current-scene')
  }

  getCurrentColorSpace() {
    return this.get('get-current-color-space')
  }

  setCurrentColorSpace(color_space) {
    return this.get('set-current-color-space', { color_space: color_space })
  }

  getRenderers() {
    return this.get('get-renderers')
  }

  getBlenderVersion() {
    return this.get('get-blender-version')
  }

  getExtensions(is_video) {
    return this.get('get-extensions', { is_video: is_video })
  }

  takeRenderScreenshot(
    renderer,
    extension,
    output_path = '',
    use_colorspace = false
  ) {
    return this.get('take-render-screenshot', {
      renderer: renderer,
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }

  takeViewportScreenshot(output_path, extension, use_colorspace = false) {
    return this.get('take-viewport-screenshot', {
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
    return this.get('take-render-animation', {
      renderer: renderer,
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }

  takeViewportAnimation(output_path, extension, use_colorspace = false) {
    return this.get('take-viewport-animation', {
      output_path: output_path,
      extension: extension,
      use_colorspace: use_colorspace
    })
  }
}

export default DCCClient
