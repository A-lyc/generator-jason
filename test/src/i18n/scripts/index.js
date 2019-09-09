const LANG = process.env.LANG
let lang = null

try {
  LANG && require('./' + LANG + '.js')
}
catch (err) {

}
