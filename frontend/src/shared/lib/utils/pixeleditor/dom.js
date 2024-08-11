/* DOM helper functions */

export const $ = (selector, scope = document) => scope.querySelector(selector)
export const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector)
]

// resolves offsetLeft/Top to the root of the document
export const getLeft = el =>
  (el.offsetParent ? getLeft(el.offsetParent) - el.offsetParent.scrollLeft : 0) + el.offsetLeft
export const getTop = el =>
  (el.offsetParent ? getTop(el.offsetParent) - el.offsetParent.scrollTop : 0) + el.offsetTop
export const getOffset = el => ({
  left: getLeft(el),
  top: getTop(el)
})

// helper for generating BEM classes
export const BEM = name => ({
  b: name,
  e: e => `${name}__${e}`,
  m: m => `${name}--${m}`
})

// DOM generation
export const _ = (tag, attrs, ...children) => {
  // extract class names from `tag.class.otherclass`
  const classes = tag.split('.')
  const el = document.createElement(classes[0])
  el.classList.add(...classes.slice(1))

  // if attrs object is not provided, assume `attrs` is a child
  if (attrs) {
    if (typeof attrs === 'string' || attrs instanceof Node) {
      children.unshift(attrs)
    } else {
      Object.entries(attrs).forEach(([a, v]) => el.setAttribute(a, v))
    }
  }

  // add children
  el.append(...children)
  return el
}
