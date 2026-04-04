// public/script.js

// English: Initialize the FitAddon
const fitAddon = new FitAddon.FitAddon();

// English: Initialize the Terminal with the addon
const term = new Terminal();
term.loadAddon(fitAddon);

const socket = new WebSocket(`ws://${window.location.host}`);

// English: Attach the terminal to the DOM element.
term.open(document.getElementById('terminal'));

// English: Fit the terminal to the container size.
function fitTerminal() {
    try {
        fitAddon.fit();
    } catch (e) {
        console.error('Error fitting terminal:', e);
    }
}

// English: Handle incoming messages from the server (MQTT messages).
socket.onmessage = (event) => {
  // English: The server sends data as a string.
  term.write(event.data);
};

// English: Handle user input in the terminal.
term.onData((data) => {
  // English: Send the user's input to the server to be published to MQTT.
  socket.send(data);
});

// English: Handle WebSocket connection opening.
socket.onopen = () => {
    console.log('WebSocket connection established.');
    term.write('Welcome to MQTT-Term!\r\n');
    // English: Fit the terminal when the connection is established and the terminal is ready.
    fitTerminal();
};

// English: Handle WebSocket connection closing.
socket.onclose = () => {
    console.log('WebSocket connection closed.');
    term.write('\r\nConnection closed.\r\n');
};

// English: Handle WebSocket errors.
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    term.write('\r\nConnection error.\r\n');
};

// English: Add a resize listener to the window to refit the terminal on window resize.
window.addEventListener('resize', fitTerminal);

