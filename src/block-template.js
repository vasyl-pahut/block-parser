import _ from 'lodash/fp'
import {getExistingElements} from './custom-elements'

const renderCode = ({code, rest}) => {
  if (!_.isEmpty(rest)) {
    return `{
      ${_.reduce((text, element) => {
        return `${text}
        const collectionItem = ({index, children, className}) => (
          ${element}
        )
        
        collectionItem.propTypes = {
          index: PropTypes.number.isRequired,
          className: PropTypes.string,
          children: PropTypes.node,
        }

        collectionItem.defaultProps = {
          className: '',
          children: null,
        }
        `
      }, '', rest)}

      return (
        ${code}
      )
    }`
  }
  return `(
    ${code}
  )`
}

export default ({blockName, code, rest}) => `import classNames from 'classnames'
import $editor from 'weblium/editor'
import css from './style.css'

const {enhancers: {withComponents}} = $editor

const ${blockName} = ({components: {${getExistingElements().map(el => `${el}`).join(', ')}}}) => ${renderCode({code, rest})}

${blockName}.propTypes = {
  components: PropTypes.object.isRequired,
}

export default withComponents(${getExistingElements().map(el => `'${el}'`).join(', ')})(${blockName})
`