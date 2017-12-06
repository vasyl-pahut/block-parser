import {findElements} from '../utils'

import content from '../content'
import Text from './text'
import Image from './image'
import Menu from './menu'
import Button from './button'

let existingElements = []

export const setExistingElement = (element) => existingElements.push(element)

export const getExistingElements = () => existingElements

export const clearElements = () => (existingElements.length = 0)

export {existingElements}

export const Elements = {
  Text,
  Image,
  Menu,
  Button,
}
