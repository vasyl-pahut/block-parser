import _ from 'lodash/fp'
import {findElements, createBind} from '../utils'
import content from '../content'
import {setExistingElement} from './'

class AppIcon extends HTMLElement {}
window.customElements.define('app-icon', AppIcon)

const Icon = {
  getElements: ({dom}) => {
    const elements = findElements(dom, ['[data-wm-component="icon"]'])
    elements.length && setExistingElement('Icon')
  },
  convert: ({dom, bind: domBind}) => {
    const elements = findElements(dom, ['[data-wm-component="icon"]'])

    elements.forEach((element, index) => {
      const iconElement = new AppIcon()
      const useElement = _.head(findElements(element, ['use']))
      const href = _.pipe(
        _.get('attributes'),
        _.find((attribute) => attribute.name === 'xlink:href'),
        _.get('value')
      )(useElement)
      const symbol = dom.querySelector(href)
      const svg = symbol.outerHTML
        .replace(/^<symbol id="\w+"/, '<svg xmlns=\'http://www.w3.org/2000/svg\'')
        .replace(/symbol>$/, 'svg>')

      iconElement.dataset.bind = createBind({domBind, elBind: `icon-${index}`})
      content.setBind(`${domBind ? domBind + '.' : ''}icon-${index}`, {
        id: '12748',
        svg,
      })
      // domBind && content.setBind(domBind, {id: 'item-0'})
      const parentNode = element.parentElement
      parentNode.replaceChild(iconElement, element)
    })
  }
}

export default Icon