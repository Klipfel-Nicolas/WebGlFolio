import GSAP from 'gsap'
import each from 'lodash/each'

import Animation from 'classes/Animation'

import { calculate, split } from 'utils/text'

export default class Tilte extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    // Use utils/text.js to split element en put in span to animate
    split({ element: this.element, append: true })
    split({ element: this.element, append: true })

    this.elementLinesSpans = this.element.querySelectorAll('span span')
  }

  animateIn () {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })

    each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(line, {
        y: '100%'
      }, {
        delay: index * 0.2,
        duration: 1.5,
        ease: 'expo.out',
        y: '0%'
      }, 0) // 0 => To avoid waiting end of precedent animation
    })
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    this.elementLines = calculate(this.elementLinesSpans)
  }
}
