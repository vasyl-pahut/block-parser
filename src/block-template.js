import _ from 'lodash/fp'
import {getExistingElements} from './custom-elements'

const renderCode = ({code, rest}) => {
  if (!_.isEmpty(rest)) {
    return `${_.reduce((text, element) => {
      return `${text}
      const CollectionItem = ({components: {${getExistingElements().join(', ')}}}) => ({index, children, className}) => (
        ${element}
      )
      
      CollectionItem.propTypes = {
        index: PropTypes.number.isRequired,
        className: PropTypes.string,
        children: PropTypes.node,
      }

      CollectionItem.defaultProps = {
        className: '',
        children: null,
      }
      `
    }, '', rest)}`
  }
  return ''
}

const hasImage = () => getExistingElements().includes('Image')

const getElements = () =>
  getExistingElements().map(el =>
    el === 'Image' ? '{component: \'Image\', enhancers: [withResources]}' : `'${el}'`).join(', ')

export default ({blockName, code, rest}) => `import classNames from 'classnames'
import $editor from 'weblium/editor'
import css from './style.css'

const {enhancers: {withComponents}${hasImage() ? ', connectHelpers: {withResources}' : ''}} = $editor

${renderCode({code, rest})}

const ${blockName} = ({components: {${getExistingElements().join(', ')}}}) => (
  ${code}
)

${blockName}.propTypes = {
  components: PropTypes.object.isRequired,
}

export default withComponents(${getElements()})(${blockName})
`