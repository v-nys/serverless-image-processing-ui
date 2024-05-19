'use strict'

module.exports = async (event, context) => {
    console.debug(event);
    console.debug(event.body);
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
        <input id="fileInput" type="file" name="file" required />
      </form>
    </section>
    <script>
      const dropZone = document.getElementById("dropZone");
      const fileInput = document.getElementById("fileInput");
      const uploadForm = document.getElementById("uploadForm");

      dropZone.addEventListener("click", function () {
        console.log("clicked in the drop zone");
        fileInput.click();
      });

      fileInput.addEventListener("click", function(event) {
        // verhindert dubbel vuren
        event.stopPropagation();
      });

      fileInput.addEventListener("change", async function () {
        console.log("changed file input");
        const file = fileInput.files[0];
        if (file) {
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

      dropZone.addEventListener("drop", async function (e) {
        console.log("dropped an image");
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove("dragover");

        let file = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files;
        file = fileInput.files[0];
        if (file) {
          uploadForm.submit();
        }
        else {
            console.warn("Enkel drag and drop van echte files is voorzien. Browserafbeeldingen omzetten naar files is technisch wel mogelijk.");
        }
      });
    </script>
  </body>
</html>`)
    }
    else {
        const inputBase64String = event.files[0].buffer.toString('base64');
        const filteredResult = await fetch('http://10.62.0.1:8080/function/image-processing', {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            // zou dit hier uiteraard niet hard coden
            // kan het uit secret of uit request data halen
            "authorization": "Bearer my-secret-pw",
          },
          body: inputBase64String
        });
        // .text() oproepen gaat niet, gebruikt buffers met beperkte grootte
        // console.debug(await filteredResult.text());
        // arrayBuffer levert de zuivere bytevoorstelling
        // dus die moeten we eerst decoderen als tekst om de base64 string te krijgen
        const arrayBuffer = await filteredResult.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // de output in base 64, die zouden we dus kunnen chainen met extra image processing functies
        const outputBase64String = buffer.toString('utf8');
        // en dan moeten we de base64 string omzetten naar bytes
        // dit is niet overbodig: base64 is iets anders dan UTF8
        const decodedBuffer = Buffer.from(outputBase64String, 'base64');
        return context
            .headers({ "Content-Type": "application/octet-stream" })
            .status(200)
            .succeed(decodedBuffer);
    }
}
