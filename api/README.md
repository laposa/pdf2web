# Pdf2web API

- accept PDF and convert to images (using PDF.js)

## API spec

POST /convert
request: pdf file as body
response: zip file with images and json file with metadata (further used by the editor / viewer)

Example usage:

```bash
# Define the PDF file path
PDF_FILE_PATH="./example.pdf"

# Define the output ZIP file path
OUTPUT_ZIP_PATH="./output.zip"

# Define the output folder for unzipping
OUTPUT_FOLDER="./output"

# Define the quality parameter (0.01-1) (optional)
QUALITY=0.8

# Send the PDF file to the conversion endpoint and save the ZIP file
curl -X POST -F "file=@${PDF_FILE_PATH}" -F "quality=${QUALITY}" http://localhost:3000/convert -o ${OUTPUT_ZIP_PATH}

# Unzip the ZIP file into the output folder
unzip ${OUTPUT_ZIP_PATH} -d ${OUTPUT_FOLDER}
```

## Conversion manifest

```json
{
  "id": 1,
  "name": "Spring brochure test 3",
  "title": "Spring offers",
  "created": "2023-10-24 15:00:00.000Z",
  "modified": "2023-10-24 15:00:00.000Z",
  "pages": [
    {
      "filename": "pages/1.webp",
      "hotspots": [
        {
          "x": 125,
          "y": 100,
          "width": 300,
          "height": 300,
          "title": "Click here",
          "url": "https://laposa.ie"
        }
      ]
    },
    {
      "filename": "pages/2.webp",
      "hotspots": [
        {
          "x": 125,
          "y": 100,
          "width": 300,
          "height": 300,
          "title": "Click here",
          "url": "https://laposa.ie"
        }
      ]
    }
  ]
}
```
