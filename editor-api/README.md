# Pdf2web API

- accept PDF and convert to images (using PDF.js)
- accept submission for newly defined areas for specific PDF
- provide list of images for specific PDF
- provide list of zones for specific PDF/images

## API spec

Client id and secret will be saved in .env. We need only only two clients right now: supervalu, centra.

POST /publications
request: pdf file as body
response: publication object

GET /publications
request:
response: array of publication (id, name, created, updated)

GET /publications/{publication id}
request:
reponse: publication object

POST /publication/{publication id}/area
request: area object without id (page number, x, y, width, height, tooltip, url)
response: area object including ID

DELETE /publication/{publication id}/area/{area object id}
request:
reponse: 200 ok

##  Publication object

````json
{
    "id": 1,
    "name": "Spring brochure test 3",
    "title": "SuperValu spring offers",
    "author": "Norbert Laposa",
    "created": "2023-10-24 15:00:00.000Z",
    "modified": "2023-10-24 15:00:00.000Z",
    "pages": [
        {"filename": "pages/1.webp", "areas": [{"coordinate_x": 125, "coordinate_y": 100, "width": 300, "height": 300, "tooltip": "Click here", "url": "https://shop.supervalu.ie"}]},
        {"filename": "pages/2.webp", "areas": [{"x": 125, "y": 100, "width": 300, "height": 300, "tooltip": "Click here", "url": "https://shop.supervalu.ie"}]}
    ]

}
````

## Database

One table:

pdf_publication (
    id serial,
    name varchar(255),
    title varchar(255),
    author: varchar(255),
    created: datetime,
    modified: datetime
)

pdf_publication_page (
    id serial,
    pdf_publication_id integer REFERENCES pdf_publication ON UPDATE CASCADE ON DELETE CASCADE,
    filename varchar(255),
    created: datetime,
    modified: datetime
)

pdf_publication_page_area (
    id serial,
    pdf_publication_page_id integer REFERENCES pdf_publication_page ON UPDATE CASCADE ON DELETE CASCADE,
    coordinate_x smallint,
    coordinate_y smallint,
    width smallint,
    height smallint,
    tooltip varchar(255),
    url text,
    created: datetime,
    modified: datetime
)
