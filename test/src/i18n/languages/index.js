const LANG = process.env.LANG
let lang = {}

try {
  LANG && (lang = require('./' + LANG + '.js').default)
}
catch (err) {

}

export default lang
