import {findElements} from '../utils'
import content from '../content'
import {setExistingElement, getExistingElements} from './'

class AppCollection extends HTMLElement {}
window.customElements.define('app-collection', AppCollection)

const Collection = {
  getElements: ({dom}) => {
    const elements = findElements(dom, ['[data-wm-component="collection"]'])
    elements.length && setExistingElement('Collection')
  },
  convert: ({dom}) => {
    const elements = findElements(dom, ['[data-wm-component="collection"]'])

    elements.forEach((element, index) => {
      const collectionElement = new AppCollection()
      if (element.className) {
        collectionElement.className = element.className
      }
      if (element.nodeName.toLowerCase() !== 'div') {
        collectionElement.dataset.TagName = element.nodeName.toLowerCase()
      }

      collectionElement.dataset.bind = `collection-${index}`
      collectionElement.dataset.Item = `CollectionItem({components: {${getExistingElements().join(', ')}}})cls#}`
      content.set(`collection-${index}`, [])
      // itemsDom.set(`collection-${index}`, element.children[0])
      const parentNode = element.parentElement
      parentNode.replaceChild(collectionElement, element)
    })
  }
}

export default Collection