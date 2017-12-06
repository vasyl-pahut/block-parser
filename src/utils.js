export const findElements = (component, selectors) => selectors.reduce((acc, selector) => {
  return [...acc, ...Array.from(component.querySelectorAll(selector))]
}, [])
