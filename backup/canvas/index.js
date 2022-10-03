//Index Canvas

import { Camera, Renderer, Transform } from 'ogl'

import About from './About'
import Home from './Home'

export default class Canvas {
  constructor ({ template }) {
    this.template = template

    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()
    this.onChange(this.template)
  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true
    })

    this.gl = this.renderer.gl

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()
  }

  createHome () {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destroyHome () {
    if (!this.home) return
    this.home.destroy()
    this.home = null
  }

  createAbout () {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destroyAbout () {
    if (!this.about) return
    this.about.destroy()
    this.about = null
  }

  /**
   * Events
   */
  onChange (template) {
    if (template === 'home') {
      this.createHome()
    } else {
      this.destroyHome()
    }

    if (template === 'about') {
      this.createAbout()
    } else {
      this.destroyAbout()
    }
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight
    })

    // Magic number for the view
    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.sizes = {
      height,
      width
    }

    this.sizes = {
      height,
      width
    }

    const values = {
      sizes: this.sizes
    }

    if (this.about) {
      this.about.onResize(values)
    }

    /* if (this.collections) {
      this.collections.onResize(values)
    }

    if (this.detail) {
      this.detail.onResize(values)
    } */

    if (this.home) {
      this.home.onResize(values)
    }
  }

  onTouchDown (e) {
    this.isDown = true

    this.x.start = e.touches ? e.touches[0].clientX : e.clientX
    this.y.start = e.touches ? e.touches[0].clientY : e.clientY

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchDown(values)
    }

    /* if (this.collections) {
      this.collections.onTouchDown(values)
    }

    if (this.detail) {
      this.detail.onTouchDown(values)
    } */

    if (this.home) {
      this.home.onTouchDown(values)
    }
  }

  onTouchMove (e) {
    if (!this.isDown) return

    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchMove(values)
    }

    /* if (this.collections) {
      this.collections.onTouchMove(values)
    }

    if (this.detail) {
      this.detail.onTouchMove(values)
    } */

    if (this.home) {
      this.home.onTouchMove(values)
    }
  }

  onTouchUp (e) {
    this.isDown = false

    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchUp(values)
    }

    /* if (this.collections) {
      this.collections.onTouchUp(values)
    }

    if (this.detail) {
      this.detail.onTouchUp(values)
    } */

    if (this.home) {
      this.home.onTouchUp(values)
    }
  }

  onWheel (e) {
    if (this.home) {
      this.home.onWheel(e)
    }

    /* if (this.collections) {
      this.collections.onWheel(e)
    } */
  }

  /**
   * Loop
   */
  update () {
    if (this.home) {
      this.home.update()
    }

    if (this.about) {
      this.about.update()
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }
}
