import {getExistingElements} from './custom-elements'

export default ({blockName, code}) => `import classNames from 'classnames'
import {getComponents} from '../../../api/helpers'
import css from './css/main.scss'

class ${blockName} extends React.Component {
  static propTypes = {
    content: PropTypes.object,
    publish: PropTypes.bool,
    save: PropTypes.func
  }

  render() {
    const {content, save, publish} = this.props
    const [${getExistingElements().join(', ')}] = getComponents([${getExistingElements().map(el => `'${el}'`).join(', ')}])({content, save, publish})
    return (
      ${code}
    )
  }
}

export default ${blockName}
`