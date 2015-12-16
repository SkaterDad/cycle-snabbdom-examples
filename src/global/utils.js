export function checkRequestUrl(res$, url) {
  try {
    return res$.request.url.indexOf(url) === 0
  } catch (e) {
    return false
  }
}
