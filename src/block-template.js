import _ from 'lodash/fp'
import {getExistingElements} from './custom-elements'
import content from './content'

const renderCode = ({code, rest}) => {
  if (!_.isEmpty(rest)) {
    return `${_.reduce((text, element) => {
      return `${text}
      collectionItem = ({index, children, className}) => {
        const {components: {${getExistingElements().join(', ')}}} = this.props
        return (
          ${element}
        )
      }`
    }, '', rest)}`
  }
  return ''
}

const getElements = () => getExistingElements().map(el => `'${el}'`).join(', ')

export default ({blockName, code, rest}) => `import $editor from 'weblium/editor'
import css from './style.css'

class ${blockName} extends React.Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
  }

  ${renderCode({code, rest})}

  render() {
    const {components: {${getExistingElements().join(', ')}}} = this.props
    return (
      ${code}
    )
  }
}

${blockName}.components = _.pick([${getElements()}])($editor.components)

${blockName}.defaultContent = ${JSON.stringify(content.getAll(), undefined, 2)}

export default ${blockName}
`