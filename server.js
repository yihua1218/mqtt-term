// server.js

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// English: Load configuration from config.json
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// English: Serve static files from the 'public' directory
app.use(express.static('public'));

// English: MQTT Client Setup
const mqttClient = mqtt.connect(`${config.brokerUrl}:${config.brokerPort}`);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker.');
    // English: Subscribe to the output topic
    mqttClient.subscribe(config.topics.subscribe, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${config.topics.subscribe}`);
        }
    });
});

mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

// English: WebSocket Connection Handling
wss.on('connection', (ws) => {
    console.log('Frontend client connected via WebSocket.');

    // English: Forward messages from MQTT to the frontend
    const mqttMessageHandler = (topic, message) => {
        if (topic === config.topics.subscribe) {
            ws.send(message.toString());
        }
    };
    mqttClient.on('message', mqttMessageHandler);

    // English: Forward messages from the frontend to MQTT
    ws.on('message', (message) => {
        if (config.debug) {
            console.log(`Received from frontend: "${message.toString()}". Publishing to MQTT topic: ${config.topics.publish}`);
        }
        mqttClient.publish(config.topics.publish, message);
    });

    ws.on('close', () => {
        console.log('Frontend client disconnected.');
        // English: Remove the listener to avoid memory leaks
        mqttClient.removeListener('message', mqttMessageHandler);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
