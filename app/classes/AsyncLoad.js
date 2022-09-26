import Component from 'classes/Component'

export default class AsyncLoad extends Component {
  constructor ({ element }) {
    super({ element })
    this.createObserver()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.element.src) {
            this.element.src = this.element.getAttribute('data-src')
            this.element.onload = _ => {
              this.element.classList.add('loaded') // give the class loaded to handle in css in /base
            }
          }
        }
      })
    })

    this.observer.observe(this.element)
  }
}
