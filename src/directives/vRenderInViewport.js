// function isInViewport(element) {
//   const rect = element.getBoundingClientRect()
//   return (
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   )
// }
// function observerInit(el) {
//   let observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         console.log('intersect')
//         observer.unobserve(el)
//       }
//     })
//   })
// }
const lazyLoad = {
  mounted(el) {
    const path = el.src
    el.src = null
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.src = path
          imageObserver.unobserve(el)
        }
      })
    })
    imageObserver.observe(el)
  }
}

export default lazyLoad
