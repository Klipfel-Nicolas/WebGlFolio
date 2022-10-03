import GSAP from 'gsap'
import each from 'lodash/each'

import Animation from 'classes/Animation'

import { calculate, split } from 'utils/text'

export default class Label extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    /* this.elementLinesSpans = split({
      element: this.element,
      append: true
    }) */
  }

  animateIn () {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })

    this.timelineIn.to(this.element, {
      autoAlpha: 1,
      duration: 1
    })

    /* each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(line, {
        autoAlpha: 0,
        y: '100%'
      }, {
        autoAlpha: 1,
        delay: index * 0.1,
        duration: 1.5,
        ease: 'expo.out',
        y: '0%'
      }, 0) // 0 => To avoid waiting end of precedent animation
    }) */
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  /* onResize () {
    this.elementLines = calculate(this.elementLinesSpans)
  } */
}
