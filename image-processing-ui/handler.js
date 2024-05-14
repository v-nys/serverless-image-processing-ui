'use strict'

module.exports = async (event, context) => {
  return context
    .headers({"Content-Type": "text/html"})
    .status(200)
    .succeed("<h1>Kijk!</h1><p>HTML!</p>")
}
