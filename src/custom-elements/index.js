import Text from './text'
import Image from './image'
import Menu from './menu'
import Button from './button'
import Collection from './collection'
import Slider from './slider'
import Map from './map'
import CollectionItem from './collection-item'

let existingElements = []

export const setExistingElement = (element) =>
  !existingElements.includes(element) && existingElements.push(element)

export const getExistingElements = () => existingElements

export const clearElements = () => (existingElements.length = 0)

export {existingElements}

export const Elements = {
  Collection,
  Slider,
  Text,
  Image,
  Menu,
  Button,
  Map,
  CollectionItem,
}
