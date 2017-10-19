import {Observable} from 'rxjs/Rx'
import Clipboard from 'clipboard'
import {
  Elements, getExistingElements, clearElements
} from './custom-elements'
import {
  $blockNameInput, $textarea, $button, $codeOutput, $copyBtn
} from './dom-elements'
import content from './content'
import BlockTemplate from './block-template'


const appTags = /(app-text)|(app-image)|(app-button)/igm
const closingTags = /(><\/Text>)|(><\/Image>)|(><\/Button>)/igm

const replaceTags = (match) => {
  const tag = match.split('-')[1]
  return tag.charAt(0).toUpperCase() + tag.substr(1).toLowerCase()
}

const cleanCode = () => {
  $codeOutput.innerHTML = ''
  content.clear()
  clearElements()
}

const createCode = (code) => {
  const blockName = $blockNameInput.value || 'Block'
  const fullCode = BlockTemplate({blockName, code})

  $codeOutput.innerText = fullCode
  new Clipboard($copyBtn, {text: () => fullCode})
}

const getJsx = (virtualDom) => {
  const text = virtualDom.innerHTML
    .replace(appTags, replaceTags)
    .replace(closingTags, () => '/>')
    .replace(/data-bind/igm, () => 'bind')
    .replace(/class="/igm, () => 'className=')
    .replace(/cls#}"/gm, () => '}')
    .replace(/\n/gm, () => '\n\t\t\t')
    .replace(/\t/gm, () => '  ')

  createCode(text)
}


const start$ = Observable.fromEvent($button, 'click')
  .map(event => $textarea.value)

const initializeVirtualDom = (value) => {
  const div = document.createElement('div')
  div.innerHTML = value
  cleanCode()
  return div
}

const convertElements = (dom) =>
  Object.values(Elements).forEach(element => element.convert(dom))

const convertClasses = (dom) =>
  dom.querySelectorAll('*').forEach((element) => {
    if (element.className) {
      const classes = element.className
        .split(' ')
        .map(className => className.includes('-') ? `css['${className}']` : `css.${className}`)
        .join(', ')
  
      element.className = classes.split(' ').length > 1
        ? `{classNames(${classes})cls#}`
        : `{${classes}cls#}`
    }
  })

const startConverting$ = start$
  .map(initializeVirtualDom)
  .do(convertElements)
  .do(convertClasses)
  .subscribe(getJsx)
