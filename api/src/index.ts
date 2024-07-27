import { createServer } from 'node:http'
import qr from 'qrcode'

const server = createServer((req, res) => {
  const url = req.url
  const method = req.method
  console.log(method)

  if (url === "/qrcode" && method === "POST" ) {
      
  }
  
  res.end()
})

server.listen(3000)