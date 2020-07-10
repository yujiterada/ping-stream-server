# Ping Stream Server

This is a simple web server made with Express to show implementations of pings by a non-streaming response and a streaming response.

![](pingStream.gif)

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install the necessary packages.

```bash
npm install
```

## Usage

Start the server.

```bash
node server.js
```
The following endpoints are available.

```html
GET /ping
GET /pingStream
```
Execute the following curl commands to compare the differences of a non-streaming response and a streaming response.
```bash
curl --no-buffer --request GET 'http://localhost:5002/ping?host=8.8.8.8'
curl --no-buffer --request GET 'http://localhost:5002/pingStream?host=8.8.8.8'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)