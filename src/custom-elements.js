import content from './content'

class AppText extends HTMLElement {}
window.customElements.define('app-text', AppText)
class AppImage extends HTMLElement {}
window.customElements.define('app-image', AppImage)
class AppButton extends HTMLElement {}
window.customElements.define('app-button', AppButton)

let existingElements = []

export const getExistingElements = () => existingElements

export const clearElements = () => (existingElements.length = 0)

const findElements = (component, tags) => tags.reduce((acc, tag) => {
  return [...acc, ...Array.from(component.getElementsByTagName(tag))]
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
      const elements = findElements(dom, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small'])

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
      const elements = findElements(dom, ['img'])
      
      elements.length && existingElements.push('Image')
      
      elements.forEach((element, index) => {
        const imageElement = new AppImage()
        if (element.className) {
          imageElement.className = element.className
        }
        imageElement.dataset.bind = `image-${index}`
        content.set(`image-${index}`, {
          src: element.src,
          alt: element.alt
        })
        const parentNode = element.parentElement
        parentNode.replaceChild(imageElement, element)
      })
    }
  },
  Button: {
    convert: (dom) => {
      const elements = findElements(dom, ['button', 'a'])

      elements.length && existingElements.push('Button')

      elements.forEach((element, index) => {
        const buttonElement = new AppButton()
        if (element.className) {
          buttonElement.className = element.className
        }
        buttonElement.dataset.bind = `button-${index}`
        content.set(`button-${index}`, {
          link: element.href || '',
          textValue: element.innerText
        })
        const parentNode = element.parentElement
        parentNode.replaceChild(buttonElement, element)
      })
    }
  }
}
