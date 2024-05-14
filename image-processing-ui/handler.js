'use strict'

module.exports = async (event, context) => {
  console.debug(event);
  if (event.method === 'GET') {
      return context
        .headers({"Content-Type": "text/html"})
        .status(200)
        .succeed(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
            <form id="uploadForm" action="#" method="POST" enctype="multipart/form-data">
              <input id="fileInput" type="file" name="file" />
              <input type="submit" value="process image" />
            </form>
</body>
</html>`)
  }
  else {
      return context
        .headers({"Content-Type": "text/html"})
        .status(200)
        .succeed("<h1>Kijk!</h1><p>HTML!</p>")
  }
}
