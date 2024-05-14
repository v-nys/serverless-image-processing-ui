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
      <form id="uploadForm" action="#" method="POST">
        <input id="fileInput" type="file" name="file" />
        <input type="hidden" id="base64Input" name="base64Input" required />
      </form>
    </section>
    <script>
      const dropZone = document.getElementById("dropZone");
      const fileInput = document.getElementById("fileInput");
      const uploadForm = document.getElementById("uploadForm");
      const base64Input = document.getElementById("base64Input");

      const convertRepresentation = async (file) => {
        console.debug(file);
        // Promise staat toe submit uit te stellen tot omzetting is gebeurd
        return new Promise(function(resolve) {
          const reader = new FileReader();
          // callback voor wanneer data omgezet is
          // moet dit registreren voor omzetting
          reader.onload = function(event) {
            const base64String = event.target.result.split(',')[1];
            base64Input.value = base64String;
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

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
          await convertRepresentation(file);
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
        console.debug(file);
        fileInput.files = e.dataTransfer.files;
        file = fileInput.files[0];
        if (file) {
          await convertRepresentation(file);
          uploadForm.submit();
        }
        else {
            console.log("Not recognized as a file...");
        }
      });
    </script>
  </body>
</html>`)
    }
    else {
        // nu: hoe kan ik hier de image processing functie oproepen?
        // moet file omzetten naar base64 voorstelling
        // kan dan gewoon fetch gebruiken over alle filters?
        // en eens ik base 64 van antwoord heb...
        // maar lijkt er niet op dat ik de eigenlijke file content kan krijgen
        // niet onlogisch, gaat terug om binaire data
        // kan ik omzetten naar base64 voor verzenden?
        return context
            .headers({ "Content-Type": "text/html" })
            .status(200)
            .succeed("<h1>Kijk!</h1><p>HTML!</p>")
    }
}
