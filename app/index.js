import each from 'lodash/each'

import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'

import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'

class App {
  constructor () {
    this.createContent()

    this.createNavigation()
    this.createPreloader()
    this.createPages()

    this.addEventListeners()
    this.addLinkListener()

    this.update()
  }

  /**
   * Create Navigation transition
   */
  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  /**
   * Call Preloader class
   */
  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  /**
   * Create the content from current Page
   */
  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  /**
   * Create the class for the current page
   */
  createPages () {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  /**
   * Destroy preloader and show page when content loaded
   */
  onPreloaded () {
    this.preloader.destroy()

    // Listen the resize
    this.onResize()

    this.page.show()
  }

  /**
   * Check the path name
   */
  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  /**
   * Fetch html from other page and put in place of current content
   * @param {} url
   */
  async onChange ({ url, push = true }) {
    // Animate out the current Page
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      // Html from the fetched page put in a created div
      const html = await request.text()
      const div = document.createElement('div')

      if (push) {
        window.history.pushState({}, '', url)
      }

      div.innerHTML = html

      const divContent = div.querySelector('.content')
      // data-template attribute from the fetched page
      this.template = divContent.getAttribute('data-template')

      // Send the template in the navigation class onChange method
      this.navigation.onChange(this.template)

      // Replace data-attribute and html content from the current page with the the fetched page
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      // Create the class for the new current page (the fetched page)
      this.page = this.pages[this.template]
      this.page.create()

      // Listen the resize
      this.onResize()

      // Animate in the new current page (the fetched page)
      this.page.show()

      // Refresh the link list for the new page
      this.addLinkListener()
    } else {
      console.log('Error')
    }
  }

  /**
   * Resize
   */
  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  /**
   * Update on request animation frame
   */
  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /**
   * Listeners
   */
  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }

  /**
   * Change Page with Ajax
   */
  addLinkListener () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      // Use onclick to not have to remove eventListener
      link.onclick = event => {
        event.preventDefault()

        const { href } = link
        this.onChange({ url: href })
      }
    })
  }
}

new App()
