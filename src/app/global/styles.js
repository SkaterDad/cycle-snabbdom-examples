export const fadeInOutStyle = {
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  delayed: {
    opacity: 1,
  },
  remove: {
    opacity: 0,
  },
  destroy: {
    opacity: 0,
  },
}

export const fadeOutStyle = {
  opacity: 1,
  transition: 'opacity 0.5s ease-in-out',
  remove: {
    opacity: 0,
  },
  destroy: {
    opacity: 0,
  },
}

export const fadeInStyle = {
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  delayed: {
    opacity: 1,
  },
}

export const exitAbsolutely = {
  opacity: '0',
  delayed: {opacity: '1'},
  remove: {opacity: '0', position: 'absolute'},
}
