const BUILD_STORE = { $initialized: false }
module.exports = function(source) {
  let result = String(source || '')
  let mat
  if (BUILD_STORE.$initialized === false) {
    const o = JSON.parse(process?.env?.BUILD_STORE)
    for (const k in o) { BUILD_STORE[k] = o[k] }
    BUILD_STORE.$initialized 
  }
  while (result != null && (mat = /\{\$\$([a-zA-Z0-9_-]+)\$\$\}/g.exec(result))) {
    const prev = result.substring(0, mat.index)
    const next = result.substring(mat.index + mat[0].length, result.length)
    result = `${prev}${BUILD_STORE[mat[1]]}${next}`
  }
  return result;
};