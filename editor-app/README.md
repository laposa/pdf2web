# PDF2Web Editor

Backend editing interface for the PDF2Web application.

## Embedding

```
    <div id="root"></div>

    <script src="/path/to/script.js"></script>

    <script>
      window.addEventListener("pdf2web.loaded", function () {
        window.pdf2web({
          api_url: "http://localhost:3000",
          api_token: "",
          publication_id: 23, // optional parameter
        });
      });

```
