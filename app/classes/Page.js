import GSAP from 'gsap'
import normalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import each from 'lodash/each'
import map from 'lodash/map'

import Title from 'animations/Title'
import Label from 'animations/Label'
import Paragraph from 'animations/Paragraph'
import Highlight from '../animations/Highlight'

import { ColorsManager } from 'classes/Colors'
import AsyncLoad from './AsyncLoad'

export default class Page {
  constructor ({
    element,
    elements,
    id
  }) {
    this.selector = element
    this.selectorChildren = {
      ...elements,

      animationsHighlights: '[data-animations="highlight"]',
      animationsTitles: '[data-animations="title"]',
      animationsParagraphs: '[data-animations="paragraph"]',
      animationsLabels: '[data-animations="label"]',

      preloaders: '[data-src]'
    }
    this.id = id
    this.transformPrefix = Prefix('transform')

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  /**
   * Select the elements from the page
   */
  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })

    this.createAnimations()
    this.createPreloader()
  }

  /**
   * Create titles Animations
   */
  createAnimations () {
    this.animations = []

    // Highlights
    this.animationsHighlights = map(this.elements.animationsHighlights, (element) => {
      return new Highlight({
        element
      })
    })

    // Titles
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({
        element
      })
    })

    this.animations.push(...this.animationsTitles)

    // Paragraphs
    this.animationsParagraphs = map(this.elements.animationsParagraphs, (element) => {
      return new Paragraph({
        element
      })
    })

    this.animations.push(...this.animationsParagraphs)

    // Labels
    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({
        element
      })
    })

    this.animations.push(...this.animationsLabels)
  }

  /**
   * Load Img with async load
   * Lazy load
   */
  createPreloader () {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element })
    })
  }

  /**
   * Animate in the page
   */
  show () {
    return new Promise(resolve => {
      // Change background and colors of the page with data-background and data-color fro pug
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')
      })

      this.animationIn = GSAP.timeline()

      this.animationIn.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

      this.animationIn.call(() => {
        // Call the event listener scroll only at the end of animation
        this.addEventListeners()

        resolve()
      })
    })
  }

  /**
   * Animate Out the page
   */
  hide () {
    return new Promise(resolve => {
      // Call the destroy to remove listener scroll before the animation Out
      this.destroy()

      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  /**
   * On scroll
   * @param {} event
   */
  onMouseWheel (event) {
    const { pixelY } = normalizeWheel(event)

    this.scroll.target += pixelY
  }

  /**
   * on Resize Event
   */
  onResize () {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }
    each(this.animations, animation => animation.onResize())
  }

  update () {
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target) // to avoid scroll more than the content height

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1) // interpolate = lerp

    // Sometimes js don't handle the 0, to avoid problems set it
    if (this.scroll.current < 0.01) this.scroll.current = 0

    if (this.elements.wrapper) {
      // Apply the scroll by translate de wrapper content from the page
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  // Listeners
  addEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }

  // Destroy
  destroy () {
    this.removeEventListeners()
  }
}
