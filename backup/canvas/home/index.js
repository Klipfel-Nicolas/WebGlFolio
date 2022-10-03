//Index Home
import { Plane, Transform } from 'ogl'
import map from 'lodash/map'
import GSAP from 'gsap'

import Media from './Media'

export default class {
  constructor ({ gl, scene, sizes }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.group = new Transform()

    this.galleryElement = document.querySelector('.home__gallery')
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image')

    // Mouse for draggable
    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.scrollCurrent = {
      x: 0,
      y: 0
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.createGeometry()
    this.createGallery()

    this.group.setParent(this.scene)
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGallery () {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }

  /**
   * Events
   */
  onResize (event) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect()

    this.sizes = event.sizes

    this.gallerySizes = {
      height: this.galleryBounds.height / window.innerHeight * this.sizes.height,
      width: this.galleryBounds.width / window.innerWidth * this.sizes.width
    }

    this.scroll.x = this.x.target = 0
    this.scroll.y = this.y.target = 0

    map(this.medias, (media) => media.onResize(event, this.scroll))
  }

  onTouchDown ({ x, y }) {
    this.speed.target = 1

    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove ({ x, y }) {
    const xDistance = x.start - x.end
    const yDistance = y.start - y.end

    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp ({ x, y }) {
    this.speed.target = 0
  }

  onWheel ({ pixelX, pixelY }) {
    this.x.target += pixelX
    this.y.target += pixelY
  }

  /**
   * Update
   */
  update () {
    if (!this.galleryBounds) return
    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

    // Give the scroll direction on x axis
    if (this.scroll.x < this.x.current) {
      this.x.direction = 'right'
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'left'
    }
    // Give the scroll direction on the y axis
    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top'
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom'
    }

    this.scroll.x = this.x.current
    this.scroll.y = this.y.current

    /**
     * Infinite Scroll
     */
    map(this.medias, (media, index) => {
      const scaleX = media.mesh.scale.x / 2

      // X Axis
      // Check if the image is out of the screen on X axis
      if (this.x.direction === 'left') {
        // Take the left of the image to see if all the img is out of screen
        const leftX = media.mesh.position.x + scaleX

        if (leftX < -this.sizes.width / 2) {
          media.extra.x += this.gallerySizes.width

          // Random rotation for img
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      } else if (this.x.direction === 'right') {
        // // Take the right of the image to see if all the img is out of screen
        const rightX = media.mesh.position.x - scaleX

        if (rightX > this.sizes.width / 2) {
          media.extra.x -= this.gallerySizes.width

          // Random rotation for img
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      }

      // Y Axis
      const scaleY = media.mesh.scale.y / 2

      // Check if the image is out of the screen Y axis
      if (this.y.direction === 'top') {
        const topY = media.mesh.position.y + scaleY

        if (topY < -this.sizes.height / 2) {
          media.extra.y += this.gallerySizes.height

          // Random rotation for img
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      } else if (this.y.direction === 'bottom') {
        const bottomY = media.mesh.position.y - scaleY

        if (bottomY > this.sizes.height / 2) {
          media.extra.y -= this.gallerySizes.height

          // Random rotation for img
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      }

      media.update(this.scroll)
    })
  }

  /**
   * Destroy
   */
  destroy () {
    this.scene.removeChild(this.group)
  }
}
