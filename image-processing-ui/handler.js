'use strict'

module.exports = async (event, context) => {
    console.debug(event);
    if (event.method === 'GET') {
        return context
            .headers({ "Content-Type": "text/html" })
            .status(200)
            .succeed(`<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        body {
          height: 100vh;
          display: flex;

          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .drop-zone {
          border: 2px dashed #ccc;
          padding: 20px;
          width: 80vw;
          height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .drop-zone.dragover {
          background-color: #f0f0f0;
        }
      </style>
  </head>
  <body>
    <section id="dropZone" class="drop-zone">
      <form id="uploadForm" action="#" method="POST" enctype="multipart/form-data">
        <input id="fileInput" type="file" name="file" />
        <input type="submit" value="process image" />
      </form>
    </section>
    <script>
      let dropZone = document.getElementById("dropZone");
      let fileInput = document.getElementById("fileInput");
      let uploadForm = document.getElementById("uploadForm");

      dropZone.addEventListener("click", function () {
        console.log("clicked in the drop zone");
        fileInput.click();
      });

      fileInput.addEventListener("change", function () {
        console.log("changed file input");
        if (fileInput.files.length > 0) {
          uploadForm.submit();
        }
      });

      dropZone.addEventListener("dragover", function (e) {
        event.preventDefault();
        console.log("dragging something over drop zone");
        this.classList.add("dragover");
      });

      dropZone.addEventListener("dragleave", function (e) {
        console.log("leaving drop zone");
        this.classList.remove("dragover");
      });

      dropZone.addEventListener("drop", function (e) {
        console.log("dropped an image");
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove("dragover");

        let file = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files;
        uploadForm.submit();
      }, );
    </script>
  </body>
</html>`)
    }
    else {
        return context
            .headers({ "Content-Type": "text/html" })
            .status(200)
            .succeed("<h1>Kijk!</h1><p>HTML!</p>")
    }
}
