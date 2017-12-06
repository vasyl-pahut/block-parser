import {findElements} from '../utils'
import {setExistingElement} from './'
import content from '../content'

class AppText extends HTMLElement {}
window.customElements.define('app-text', AppText)

const Text = {
  convert: (dom) => {
    const elements = findElements(dom, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small', 'strong', 'quote'])

    elements.length && setExistingElement('Text')

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
}

export default Text
