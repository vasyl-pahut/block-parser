class ChildrenPlaceholder extends HTMLElement {}
window.customElements.define('app-children-placeholder', ChildrenPlaceholder)

const CollectionItem = {
  getElements: () => null,
  convert: ({dom, bind}) => {
    if (bind.includes('collection')) {
      const childrenPlaceholder = new ChildrenPlaceholder()
      childrenPlaceholder.innerText = '{children}'
      dom.children[0].prepend(childrenPlaceholder)
      dom.children[0].classList.add('className')
    }
  }
}

export default CollectionItem