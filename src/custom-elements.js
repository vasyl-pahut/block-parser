import content from './content'

class AppText extends HTMLElement {}
window.customElements.define('app-text', AppText)
class AppImage extends HTMLElement {}
window.customElements.define('app-image', AppImage)
class AppButton extends HTMLElement {}
window.customElements.define('app-button', AppButton)
class AppMenu extends HTMLElement {}
window.customElements.define('app-menu', AppMenu)

let existingElements = []

export const getExistingElements = () => existingElements

export const clearElements = () => (existingElements.length = 0)

const findElements = (component, selectors) => selectors.reduce((acc, selector) => {
  return [...acc, ...Array.from(component.querySelectorAll(selector))]
}, [])

const covertClasses = (classNames) => {
  const classes = classNames
    .split(' ')
    .map(className => className.includes('-') ? `css['${className}']` : `css.${className}`)
    .join(', ')
  return classes.length > 1 ? `classNames(${classes})` : classes
}

export const Elements = {
  Text: {
    convert: (dom) => {
      const elements = findElements(dom, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small', 'strong', 'quote'])

      elements.length && existingElements.push('Text')

      elements.forEach((element, index) => {
        const textElement = new AppText()
        textElement.dataset.bind = `text-${index}`
        content.set(`text-${index}`,
          element.innerText
            .trim()
            .replace(/\n+|\t+/igm, () => ' ')
            .replace(/ {2,}/igm, () => ' ')
        )
        element.innerHTML = ''
        element.appendChild(textElement)    
      })
    }
  },
  Image: {
    convert: (dom) => {
      const elements = findElements(dom, ['picture'])
      
      elements.length && existingElements.push('Image')
      
      elements.forEach((element, index) => {
        const imageElement = new AppImage()
        if (element.className) {
          imageElement.dataset.pictureClassName = element.className
        }
        if (findElements(element, ['img'])[0].className) {
          imageElement.dataset.imgClassName = findElements(element, ['img'])[0].className
        }
        imageElement.dataset.bind = `image-${index}`
        const placeholder = 'https://www.vms.ro/wp-content/uploads/2015/04/mobius-placeholder-2.png'
        content.set(`image-${index}`, {
          src: placeholder,
          alt: findElements(element, ['img'])[0].alt
        })
        const parentNode = element.parentElement
        parentNode.replaceChild(imageElement, element)
      })
    }
  },
  Menu: {
    convert: (dom) => {
      const elements = findElements(dom, ['[data-wm-component="menu"]'])

      elements.length && existingElements.push('Menu')

      elements.forEach((element, index) => {
        const menuElement = new AppMenu()
        if (element.className) {
          menuElement.className = element.className
        }
        if (findElements(element, ['li'])[0].className) {
          menuElement.dataset.itemClassName = findElements(element, ['li'])[0].className
        }
        if (findElements(element, ['a'])[0].className) {
          menuElement.dataset.linkClassName = findElements(element, ['a'])[0].className
        }
        menuElement.dataset.bind = `menu-${index}`
        content.set(
          `menu-${index}`,
          findElements(element, ['a']).map((link, id) =>
            ({
              id,
              metadata: {
                displayName: link.innerText.trim(),
                clickAction: {
                  action: 'page',
                  target: '_self',
                  actions: {
                    page: '',
                    link: '',
                    block: ''
                  }
                }
              }
            })
          )
        )
        const parentNode = element.parentElement
        parentNode.replaceChild(menuElement, element)
      })
    }
  },
  Button: {
    convert: (dom) => {
      const elements = findElements(dom, ['button', 'a']).filter(element => !element.childElementCount)

      elements.length && existingElements.push('Button')

      elements.forEach((element, index) => {
        const buttonElement = new AppButton()
        if (element.className) {
          buttonElement.className = element.className
        }
        buttonElement.dataset.bind = `button-${index}`
        content.set(`button-${index}`, {
          actionConfig: {
            action: 'link',
            actions: {
              link: {type: '', innerPage: '', url: ''}
            },
          },
          textValue: element.innerText
        })
        const parentNode = element.parentElement
        parentNode.replaceChild(buttonElement, element)
      })
    }
  }
}
