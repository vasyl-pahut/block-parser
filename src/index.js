import _ from 'lodash/fp'
import {Observable} from 'rxjs/Rx'
import Clipboard from 'clipboard'
import {
  Elements, getExistingElements, clearElements
} from './custom-elements'
import {
  $blockNameInput, $textarea, $button, $codeOutput, $copyCodeBtn, $copyContentBtn
} from './dom-elements'
import {findElements} from './utils'
import content from './content'
import BlockTemplate from './block-template'

const appTags = /(app-text)|(app-image)|(app-button)|(app-menu)|(app-collection)|(app-slider)|(app-map)|(app-icon)/igm
const closingTags = /(><\/Text>)|(><\/Image>)|(><\/Button>)|(><\/Menu>)|(><\/Collection>)|(><\/Slider>)|(><\/Map>)|(><\/Icon>)/igm

const replaceTags = (match) => {
  const tag = match.split('-')[1]
  return tag.charAt(0).toUpperCase() + tag.substr(1).toLowerCase()
}

const cleanCode = () => {
  $codeOutput.innerHTML = ''
  content.clear()
  clearElements()
}

const createCode = ({main, ...rest}) => {
  const blockName = $blockNameInput.value || 'Block'
  const fullCode = BlockTemplate({blockName, code: main, rest})

  $codeOutput.innerText = fullCode
  console.log('content: ', {content: content.getAll()})
  new Clipboard($copyCodeBtn, {text: () => fullCode})
  new Clipboard($copyContentBtn, {text: () => JSON.stringify(content.getAll(), undefined, 2)})

}

const getJsx = (doms) => {
  const newDoms = _.flow(
    _.pickBy(({render}) => render),
    _.mapValues(({dom}) =>
      dom.innerHTML
        .replace(appTags, replaceTags)
        .replace(closingTags, ' />')
        .replace(/data-bind/igm, 'bind')
        .replace(/bind="{`/gm, 'bind={`')
        .replace(/`}"/gm, '`}')
        .replace(/data-picture-class-name="/igm, 'pictureClassName=')
        .replace(/data-img-class-name="/igm, 'imgClassName=')
        .replace(/data-item-class-name="/igm, 'itemClassName=')
        .replace(/data-link-class-name="/igm, 'linkClassName=')
        .replace(/data--tag-name/igm, 'TagName')
        .replace(/data--item="/igm, 'Item={')
        .replace(/<app-children-placeholder>/gm, '')
        .replace(/<\/app-children-placeholder>/gm, '\n\t')
        .replace(/class="/igm, 'className=')
        .replace(/css.className/gm, 'className')
        .replace(/cls#}"/igm, '}')
        .replace(/xmlns:xlink/igm, 'xmlnsLink')
        .replace(/xlink:href/igm, 'xlinkHref')
        .replace(/{children}/igm, '\n\t\t\t{children}')
        .replace(/\n/gm, '\n\t\t\t')
        .replace(/\t/gm, '  ')
  ))(doms)

  console.log('get jsx', {
    doms,
    newDoms,
  })

  createCode(newDoms)
}


const start$ = Observable.fromEvent($button, 'click')
  .map(event => $textarea.value)

// magic
const initializeVirtualDom = (value) => {
  const div = document.createElement('div')
  div.innerHTML = value

  const els = findElements(div, ['[data-wm-component="collection"]', '[data-wm-component="slider"]'])
  const newDoms = els.reduce((allDoms, element, index) => {
    const component = _.pipe(
      _.find((attribute) => attribute.name === 'data-wm-component'),
      _.get('value')
    )(element.attributes)
    const componentName = `${component}-${index}`
    const elementChildren = _.flow(
      _.entries,
      _.reduce((children, [i, child]) => {
        const itemKey = `col-${index}-item-${i}`
        const childWrapper = document.createElement('div')
        childWrapper.appendChild(child)
        return {
          ...children,
          [itemKey]: {
            render: Number(i) === 0,
            bind: `${componentName}[${i}]`,
            dom: childWrapper,
          }
        }
      }, {})
    )([...element.children])
    return {...allDoms, ...elementChildren}
  }, {main: {bind: '', dom: div, render: true}})

  cleanCode()
  return newDoms
}

const storeExistingElements = (doms) =>
  _.forEach(({dom, bind}) =>
    Object.values(Elements).forEach(element => element.getElements({dom})))(doms)

const convertElements = (doms) =>
  _.forEach(({dom, bind}) => Object.values(Elements).forEach(element => element.convert({dom, bind})))(doms)
  

const classesAttributes = [
  'class',
  'data-img-class-name',
  'data-picture-class-name',
  'data-item-class-name',
  'data-link-class-name',
]
const convertClasses = (doms) =>
  _.forEach(({dom}) =>
    dom.querySelectorAll('*').forEach((element) => {
      classesAttributes.forEach((attribute) => {
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
  )(doms)
  

const startConverting$ = start$
  .map(initializeVirtualDom)
  .do(storeExistingElements)
  .do(convertElements)
  .do(convertClasses)
  .subscribe(getJsx)
