# mqtt-term

A web-based terminal that uses MQTT for I/O.

## Description

`mqtt-term` is a Node.js application that provides a web terminal interface. Instead of a direct connection to a system's PTY, it uses the MQTT protocol to send and receive data. This allows the terminal to interact with remote devices or applications that communicate over MQTT.

## Features

- Web-based terminal using xterm.js.
- MQTT-based communication for terminal input and output.
- Decoupled I/O streams via MQTT topics.
- Configurable MQTT broker and topics.

## Tech Stack

- **Backend**: Node.js, Express.js, MQTT.js, ws
- **Frontend**: xterm.js
- **Protocol**: MQTT, WebSocket

## File Structure

```txt
mqtt-term/
├── config.example.json
├── config.json
├── server.js
├── public/
│   ├── index.html
│   └── script.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed.
- An MQTT broker accessible to the application.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mqtt-term
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure the MQTT broker:
   - Copy `config.example.json` to `config.json` and edit it with your MQTT broker's URL, port, and the topics for input and output.

   ```json
   {
     "brokerUrl": "mqtt://your-broker-address",
     "brokerPort": 1883,
     "topics": {
       "subscribe": "serial/CM/out",
       "publish": "serial/CM/input"
     },
     "debug": false
   }
   ```

### Running the Application

Start the server. The default port is `3000`.

```bash
node server.js
```

To run on a different port (e.g., 8080), use the `PORT` environment variable:

```bash
PORT=8080 node server.js
```

Then, open your web browser and navigate to `http://localhost:<PORT>` (e.g., `http://localhost:8080`). You should see the terminal interface.

## How It Works

1.  **Web Interface**: The `index.html` file loads `xterm.js` to create a terminal in the browser.
2.  **WebSocket Connection**: The frontend `script.js` establishes a WebSocket connection to the Node.js backend.
3.  **Backend Server**: The `server.js` file runs an Express server to serve the static frontend files and a WebSocket server to communicate with the frontend. This server acts as a bridge.
4.  **MQTT Client**: The backend also runs an MQTT client that connects to the broker specified in `config.json`.
5.  **Input Flow (Browser to MQTT)**:
    -   When you type in the web terminal, the input is sent to the backend via WebSocket.
    -   The backend receives the data and publishes it to the `publish` topic defined in `config.json`.
6.  **Output Flow (MQTT to Browser)**:
    -   The backend subscribes to the `subscribe` topic defined in `config.json`.
    -   When a message is received on this topic, the backend forwards it to the frontend via the WebSocket connection.
    -   The frontend's `script.js` receives the data and writes it to the `xterm.js` terminal, displaying the output.
