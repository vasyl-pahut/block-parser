import {findElements, createBind} from '../utils'
import content from '../content'
import {setExistingElement} from './'

class AppButton extends HTMLElement {}
window.customElements.define('app-button', AppButton)

const Button = {
  convert: ({dom, bind: domBind}) => {
    const elements = findElements(dom, ['button', 'a']).filter(element => !element.childElementCount)

    elements.length && setExistingElement('Button')

    elements.forEach((element, index) => {
      const buttonElement = new AppButton()
      if (element.className) {
        buttonElement.className = element.className
      }
      buttonElement.dataset.bind = createBind({domBind, elBind: `button-${index}`})
      content.setBind(`${domBind ? domBind + '.' : ''}button-${index}`, {
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

export default Button