const http = require("http");

function createApp({ message = process.env.APP_MESSAGE || "Hello from Jenkins!" } = {}) {
  return http.createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(message);
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, "0.0.0.0", () => {
    console.log(`Server listening on http://127.0.0.1:${port}`);
  });
}

module.exports = { createApp };
