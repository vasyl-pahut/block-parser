import Text from './text'
import Image from './image'
import Menu from './menu'
import Button from './button'
import Collection from './collection'
import CollectionItem from './collection-item'

let existingElements = []

export const setExistingElement = (element) => existingElements.push(element)

export const getExistingElements = () => existingElements

export const clearElements = () => (existingElements.length = 0)

export {existingElements}

export const Elements = {
  Collection,
  Text,
  Image,
  Menu,
  Button,
  CollectionItem,
}
