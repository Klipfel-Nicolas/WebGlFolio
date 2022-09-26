import Component from 'classes/Component'

import GSAP from 'gsap'
import each from 'lodash/each'

import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor () {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img')
      }
    })

    // Use utils/text.js to split element en put in span to animate
    split({
      element: this.elements.title,
      expression: '<br>'
    })
    // Wrap span in 2 elements to overflow hidden in scss <span><span></span></span>
    split({
      element: this.elements.title,
      expression: '<br>'
    })
    this.elements.titleSpans = this.elements.title.querySelectorAll('span span')

    // Variable used to increment nbr of element loaded
    this.length = 0

    this.createLoader()
  }

  /**
   * create loader
   */
  createLoader () {
    each(this.elements.images, element => {
      element.onload = () => this.onAssetLoaded(element)
      element.src = element.getAttribute('data-src')
    })
  }

  /**
   * update percent assets loaded
   * @param {element} image
   */
  onAssetLoaded (image) {
    this.length += 1

    const percent = this.length / this.elements.images.length

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  /**
   * All asset loaded
   */
  onLoaded () {
    return new Promise(resolve => {
      this.animateOut = GSAP.timeline({
        delay: 2
      })

      // Animate out text
      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1, // To wait .1s before animate the next line
        y: '100%'
      })

      // Animate out percent
      this.animateOut.to(this.elements.numberText, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1, // To wait .1s before animate the next line
        y: '100%'
      }, '-=1.4')

      // Animate out the Preloader page
      this.animateOut.to(this.element, {
        duration: 1.5,
        ease: 'expo.out',
        scaleY: 0,
        transformOrigin: '100% 100%'
      }, '-=1')

      this.animateOut.call(() => {
        this.emit('completed')
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
