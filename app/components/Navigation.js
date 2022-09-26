import GSAP from 'gsap'

import Component from 'classes/Component'

import { COLOR_WHITE, COLOR_BRIGHT_GREY } from 'utils/colors'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    if (template === 'about') {
      GSAP.to(this.element, {
        color: COLOR_BRIGHT_GREY,
        duration: 1.5
      })

      // Link visible (collections)
      GSAP.to(this.elements.items[0], {
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75
      })

      // Link invisible (about)
      GSAP.to(this.elements.items[1], {
        autoAlpha: 0,
        duration: 0.75
      })
    } else {
      GSAP.to(this.element, {
        color: COLOR_WHITE,
        duration: 1.5
      })

      // Link visible (about)
      GSAP.to(this.elements.items[1], {
        autoAlpha: 1,
        duration: 0.75,
        delay: 0.75
      })

      // Link invisible (collections)
      GSAP.to(this.elements.items[0], {
        autoAlpha: 0,
        duration: 0.75
      })
    }
  }
}
