# mqtt-term

一個使用 MQTT 進行 I/O 的網頁終端機。

## 專案描述

`mqtt-term` 是一個 Node.js 應用程式，提供一個網頁終端機介面。它的輸入和輸出並非直接連接到系統的 PTY，而是使用 MQTT 協定來收發數據。這使得終端機可以與透過 MQTT 進行通訊的遠端設備或應用程式互動。

## 功能特性

- 基於 xterm.js 的網頁終端機。
- 使用 MQTT 進行終端機的輸入和輸出通訊。
- 透過 MQTT 主題（topics）解耦的 I/O 數據流。
- 可配置的 MQTT 代理（broker）和主題。

## 技術棧

- **後端**: Node.js, Express.js, MQTT.js, ws
- **前端**: xterm.js
- **協定**: MQTT, WebSocket

## 檔案結構

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

## 開始使用

### 環境需求

- 已安裝 Node.js 和 npm。
- 應用程式可以存取到的 MQTT 代理。

### 安裝步驟

1. 複製專案倉庫：

```bash
git clone <repository-url>
cd mqtt-term
```

2. 安裝依賴套件：

```bash
npm install
```

3. 設定 MQTT 代理：

   -   將 `config.example.json` 複製並重新命名為 `config.json`，然後編輯 `config.json` 檔案，填入您的 MQTT 代理位址、埠號以及用於輸入和輸出的主題。

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

### 執行應用程式

啟動伺服器。預設的連接埠是 `3000`。

```bash
node server.js
```

若要在不同的連接埠（例如 8080）上執行，請使用 `PORT` 環境變數：

```bash
PORT=8080 node server.js
```

然後，打開您的網頁瀏覽器並前往 `http://localhost:<PORT>`（例如 `http://localhost:8080`）。您應該會看到終端機介面。

## 運作方式

1. **網頁介面**：`index.html` 檔案載入 `xterm.js` 以在瀏覽器中建立一個終端機。
2. **WebSocket 連線**：前端的 `script.js` 會與 Node.js 後端建立一個 WebSocket 連線。
3. **後端伺服器**：`server.js` 檔案會執行一個 Express 伺服器來提供靜態前端檔案，並同時執行一個 WebSocket 伺服器與前端通訊。此伺服器扮演著橋樑的角色。
4. **MQTT 客戶端**：後端同時也運行一個 MQTT 客戶端，連接到 `config.json` 中指定的代理。
5. **輸入流程 (瀏覽器至 MQTT)**：
   -  當您在網頁終端機中輸入時，輸入內容會透過 WebSocket 傳送到後端。
   -  後端收到數據後，會將其發佈到 `config.json` 中定義的 `publish` 主題。
6. **輸出流程 (MQTT 至 瀏覽器)**：
   -  後端會訂閱 `config.json` 中定義的 `subscribe` 主題。
   -  當在此主題上收到訊息時，後端會透過 WebSocket 連線將其轉發到前端。
   -  前端的 `script.js` 收到數據後，會將其寫入 `xterm.js` 終端機，從而顯示輸出。
