const http = require('http')

const server = http.createServer((req, res) => {
  // Set the response HTTP headers
  res.writeHead(200, { 'Content-Type': 'text/plain' })

  // Send a response based on the request URL
  if (req.url === '/') {
    res.end('Hello, world! Welcome to the homepage.')
  } else if (req.url === '/about') {
    res.end('This is the about page.')
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('404 Not Found')
  }
})

// Start the server and listen on the specified port
server.listen(3000, () => {
  console.log(`Server is running at http://localhost:${3000}`)
})
