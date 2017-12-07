export const findElements = (component, selectors) => selectors.reduce((acc, selector) => {
  return [...acc, ...Array.from(component.querySelectorAll(selector))]
}, [])


export const createBind = ({domBind, elBind}) =>
  domBind.length ? `{\`${domBind.replace(/\[0\]/gm, () => '[${index}]')}.${elBind}\`}` : elBind