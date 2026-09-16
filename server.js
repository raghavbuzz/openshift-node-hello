const http = require("http");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        message: "Hello World from OpenShift!",
        hostname: require("os").hostname(),
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});