import {findElements, createBind} from '../utils'
import content from '../content'
import {setExistingElement} from './'

class AppMenu extends HTMLElement {}
window.customElements.define('app-menu', AppMenu)

const Menu = {
  getElements: ({dom}) => {
    const elements = findElements(dom, ['[data-wm-component="menu"]'])
    elements.length && setExistingElement('Menu')
  },
  convert: ({dom, bind: domBind}) => {
    const elements = findElements(dom, ['[data-wm-component="menu"]'])

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
      menuElement.dataset.bind = createBind({domBind, elBind: `menu-${index}`})
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
      // domBind && content.setBind(domBind, {id: 'item-0'})
      const parentNode = element.parentElement
      parentNode.replaceChild(menuElement, element)
    })
  }
}

export default Menu