import apisauce from 'apisauce'

class DCCClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.api = apisauce.create({ baseURL: this.baseURL })
    this.dcc_name = ''
    this.dcc_version = ''
    this.current_project = ''
    this.cameras = []
    this.camera_selected = ''
    this.renderers = []
    this.renderer_selected = ''
    this.video_extensions = []
    this.video_extension_selected = ''
    this.image_extensions = []
    this.image_extension_selected = ''
  }

  get(url, params = {}) {
    return this.api.get(url, params).then((response) => {
      if (response.status === null) {
        return Promise.reject(
          `Response status code is null, the connection have probably been refused.`
        )
      } else if (response.status !== 200) {
        return Promise.reject(
          `Response status code is not 200, it's ${response.status}.`
        )
      } else return Promise.resolve(response.data)
    })
  }

  getInformation() {
    return this.get('/').then((data) => {
      this.dcc_name = data['dcc_name']
      this.dcc_version = data['dcc_version']
      this.current_project = data['current_project']
      return Promise.resolve(data)
    })
  }

  getCameras() {
    return this.get('get-cameras').then((data) => {
      this.cameras = data

      if (this.cameras.length > 0) {
        this.camera_selected = this.cameras[0]
      }
      return Promise.resolve(data)
    })
  }

  setCamera(camera) {
    return this.get('set-camera', { camera: camera }).then(() => {
      this.camera_selected = camera
    })
  }

  setRenderer(renderer) {
    this.renderer_selected = renderer
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
    return this.get('get-renderers').then((data) => {
      this.renderers = data
      if (this.renderers.length > 0) {
        this.renderer_selected =
          this.dcc_name == 'Blender'
            ? 'BLENDER_WORKBENCH'
            : this.renderers[0][1]
      }
      return Promise.resolve(data)
    })
  }

  getExtensions(is_video) {
    return this.get('get-extensions', { is_video: is_video }).then((data) => {
      if (is_video) {
        this.video_extensions = data
        if (this.video_extensions.length > 0) {
          this.video_extension_selected = this.video_extensions[0][1]
        }
      } else {
        this.image_extensions = data
        if (this.image_extensions.length > 0) {
          this.image_extension_selected = this.image_extensions[0][1]
        }
      }
    })
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

class DCCClientManager {
  // TODO : create iterator
  constructor() {
    this.connectedClients = []
  }

  refreshConnectedClients() {
    this.connectedClients = []
    for (let port = 10000; port < 10100; port++) {
      let new_client = new DCCClient(`http://localhost:${port}`)
      new_client
        .getInformation()
        .then(() => {
          new_client.getCameras().then()
          new_client.getRenderers().then()
          new_client.getExtensions(true).then()
          new_client.getExtensions(false).then()
          this.connectedClients.push(new_client)
        })
        .catch(() => {
          // do nothing
        })
    }
  }
}

export { DCCClient, DCCClientManager }
