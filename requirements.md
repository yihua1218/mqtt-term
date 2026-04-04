# Project Specification: mqtt-term

## 1. Project Overview
`mqtt-term` is a web terminal tool developed based on Node.js. Its core feature is the **decoupling of the transport layer**: the terminal's input and output are not directly bound to a system PTY via WebSockets. Instead, it interacts with remote physical devices or processes by subscribing to and publishing on specific MQTT topics.

## 2. Tech Stack
- **Runtime**: Node.js
- **Frontend UI**: xterm.js (for web terminal rendering)
- **Communication Protocol**: MQTT (for subscription/publication-based I/O)
- **Backend Framework**: Express.js (to serve static pages and manage configuration)
- **MQTT Library**: MQTT.js
- **Real-time Backend-Frontend Communication**: WebSocket (`ws` library)

## 3. Core Functional Requirements

### 3.1 Minimum Viable Product (MVP) Goals
- Create a web interface that displays an interactive terminal window.
- Connect to a specified MQTT Broker via the Node.js backend.
- **Output Flow**: Subscribe to `serial/CM/out`. Upon receiving a message, immediately display it in the web terminal.
- **Input Flow**: When a character is typed in the web terminal, immediately publish it to `serial/CM/input`.

### 3.2 Test Environment Configuration
- **MQTT Broker**: `your-broker-address`
- **Port**: `1883`
- **Subscribe Topic (Terminal Output)**: `serial/CM/out`
- **Publish Topic (Terminal Input)**: `serial/CM/input`

### 3.3 Backend Requirements
- **Configuration Management**: Support reading MQTT Broker address, port, and topic information from an external file (e.g., `config.json`).
- **MQTT-WebSocket Bridge**:
    - Establish a stable connection to the MQTT broker.
    - When data is received from an MQTT topic, forward it to the frontend via WebSocket.
    - When data is received from the frontend via WebSocket, publish it to the appropriate MQTT topic.
- **Static Asset Serving**: Host and serve the frontend HTML/JS files.

### 3.4 Frontend Requirements
- **Terminal Implementation**: Initialize a terminal using `xterm.js`.
- **I/O Handling**:
    - Listen for the terminal's input events (`onData`) and send the input to the backend for MQTT publication.
    - Receive data from the backend and use `terminal.write()` to render it on the screen.

## 4. Expected File Structure
```text
mqtt-term/
├── config.json          # Stores MQTT connection and topic settings
├── server.js            # Main Node.js application (Express + MQTT Client + WebSocket Server)
├── public/              # Frontend web assets
│   ├── index.html       # Terminal entry page
│   └── script.js        # xterm.js initialization and logic
├── package.json         # Project dependencies
└── README.md            # Project description
```