# Pdf2web Public App

- provide UI for generated images carousel including URL areas
- input will URL for Files Storage where are the images and JSON files

## Installation

```
    <div id="root"></div>
    <script  src="/path/to/script.js"></script>
    <script>
      window.addEventListener("pdf2webPublic.loaded", function () {
        window.pdf2webPublic({
          manifest_url: "http://localhost:3000/manifests/23.json",
        });
      });
    </script>

```
