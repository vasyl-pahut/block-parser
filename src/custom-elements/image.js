import {findElements, createBind} from '../utils'
import content from '../content'
import {setExistingElement} from './'

class AppImage extends HTMLElement {}
window.customElements.define('app-image', AppImage)

const Image = {
  convert: ({dom, bind: domBind}) => {
    const elements = findElements(dom, ['picture'])
    
    elements.length && setExistingElement('Image')
    
    elements.forEach((element, index) => {
      const imageElement = new AppImage()
      if (element.className) {
        imageElement.dataset.pictureClassName = element.className
      }
      if (findElements(element, ['img'])[0].className) {
        imageElement.dataset.imgClassName = findElements(element, ['img'])[0].className
      }
      imageElement.dataset.bind = createBind({domBind, elBind: `image-${index}`})
      const placeholder = 'https://www.vms.ro/wp-content/uploads/2015/04/mobius-placeholder-2.png'
      content.setBind(`${domBind ? domBind + '.' : ''}image-${index}`, {
        src: placeholder,
        alt: findElements(element, ['img'])[0].alt
      })
      const parentNode = element.parentElement
      parentNode.replaceChild(imageElement, element)
    })
  }
}

export default Image