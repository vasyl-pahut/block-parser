import {findElements, createBind} from '../utils'
import content from '../content'
import {setExistingElement} from './'

class AppMap extends HTMLElement {}
window.customElements.define('app-map', AppMap)

const Map = {
  convert: ({dom, bind: domBind}) => {
    const elements = findElements(dom, ['[data-wm-component="map"]'])

    elements.length && setExistingElement('Map')

    elements.forEach((element, index) => {
      const mapElement = new AppMap()
      if (element.className) {
        mapElement.className = element.className
      }
      mapElement.dataset.bind = createBind({domBind, elBind: `map-${index}`})
      content.setBind(`${domBind ? domBind + '.' : ''}map-${index}`, {
        preset: 'default',
        height: '100%',
        center: {
          lat: 50.4589633,
          lng: 30.5247585,
        },
        zoom: 18,
        activeMarker: '2aceeb6f-623c-41f8-b0d3-6f0f085e8e48',
        disableDefaultUI: true,
        allowZoomOnScroll: false,
        markers: [{
          position: {
            lat: 50.4589633,
            lng: 30.5247585,
          },
          name: 'Best Marker',
          description: 'This is marker description',
          address: 'Kiev Poshtova Ploshcha',
          id: '2aceeb6f-623c-41f8-b0d3-6f0f085e8e48',
        }]
      })
      const parentNode = element.parentElement
      parentNode.replaceChild(mapElement, element)
    })
  }
}

export default Map