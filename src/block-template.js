import {getExistingElements} from './custom-elements'

export default ({blockName, code}) => `import classNames from 'classnames'
import $editor from 'weblium/editor'
import css from './style.css'

const {enhancers: {withComponents}} = $editor

const ${blockName} = ({components: {${getExistingElements().map(el => `${el}`).join(', ')}}}) => (
  ${code}
)

${blockName}.propTypes = {
  components: PropTypes.object.isRequired,
}

export default withComponents(${getExistingElements().map(el => `'${el}'`).join(', ')})(${blockName})
`