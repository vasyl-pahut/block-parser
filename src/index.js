import {Observable} from 'rxjs/Rx'
import Clipboard from 'clipboard'
import {
  Elements, getExistingElements, clearElements
} from './custom-elements'
import {
  $blockNameInput, $textarea, $button, $codeOutput, $copyCodeBtn, $copyContentBtn
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
  console.log('content: ', {content: content.getAll()})
  new Clipboard($copyCodeBtn, {text: () => fullCode})
  new Clipboard($copyContentBtn, {text: () => JSON.stringify(content.getAll(), undefined, 2)})

}

const getJsx = (virtualDom) => {
  const text = virtualDom.innerHTML
    .replace(appTags, replaceTags)
    .replace(closingTags, () => '/>')
    .replace(/data-bind/igm, () => 'bind')
    .replace(/data-picture-class-name="/igm, () => 'pictureClassName=')
    .replace(/data-img-class-name="/igm, () => 'imgClassName=')
    .replace(/class="/igm, () => 'className=')
    .replace(/cls#}"/igm, () => '}')
    .replace(/xmlns:xlink/igm, () => 'xmlnsLink')
    .replace(/xlink:href/igm, () => 'xlinkHref')
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
    ['class', 'data-img-class-name', 'data-picture-class-name'].forEach((attribute) => {
      if (element.attributes[attribute] && element.attributes[attribute].value) {
        const classes = element.attributes[attribute].value
          .split(' ')
          .map(className => className.includes('-') ? `css['${className}']` : `css.${className}`)
          .join(', ')
    
        element.attributes[attribute].value = classes.split(' ').length > 1
          ? `{classNames(${classes})cls#}`
          : `{${classes}cls#}`
      }
    })
  })

const startConverting$ = start$
  .map(initializeVirtualDom)
  .do(convertElements)
  .do(convertClasses)
  .subscribe(getJsx)
