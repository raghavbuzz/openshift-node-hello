const http = require("http");
const os = require("os");

const PORT = process.env.PORT || 8080;

let isShuttingDown = false;

const server = http.createServer((req, res) => {

    // Don't accept new requests during shutdown
    if (isShuttingDown) {
        res.writeHead(503, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Service is shutting down"
        }));

        return;
    }

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        message: "Hello World from OpenShift!",
        hostname: os.hostname(),
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Version 5 Running on host ${os.hostname()}`);
});

/*
 * Graceful shutdown
 */
const gracefulShutdown = (signal) => {

    console.log(`[SHUTDOWN] Received ${signal}`);

    isShuttingDown = true;

    console.log("[SHUTDOWN] Stopping new requests...");

    server.close(() => {

        console.log("[SHUTDOWN] All existing connections completed.");

        console.log("[SHUTDOWN] Application shutting down.");

        setTimeout(() => {
            console.log("[SHUTDOWN] Application shutting down.");
            process.exit(0);

        }, 10000);
    });

    // Safety timeout
    setTimeout(() => {

        console.error(
            "[SHUTDOWN] Graceful shutdown timeout exceeded. Forcing exit."
        );

        process.exit(1);

    }, 60000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));