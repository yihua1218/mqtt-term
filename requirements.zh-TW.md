# 專案需求規格書：mqtt-term

## 1. 專案概述
`mqtt-term` 是一個基於 Node.js 開發的 Web Terminal 工具。其核心特性在於**傳輸層的解耦**：終端機的輸入（Input）與輸出（Output）並非直接透過 WebSocket 與系統 PTY 綁定，而是透過訂閱（Sub）與發佈（Pub）特定的 MQTT Topic 來與遠端實體設備或程序進行 I/O 互動。

## 2. 技術棧 (Tech Stack)
- **Runtime**: Node.js
- **Frontend UI**: xterm.js (用於網頁終端機渲染)
- **Communication Protocol**: MQTT (基於訂閱/發佈模式的 I/O)
- **Backend Framework**: Express.js (提供靜態網頁服務與設定管理)
- **MQTT Library**: MQTT.js

## 3. 核心功能需求

### 3.1 最小化可行產品 (MVP) 目標
- 建立一個 Web 介面，顯示一個可操作的終端機視窗。
- 透過後端 Node.js 連接至指定的 MQTT Broker。
- **Output 流程**：訂閱 `serial/CM/out`，收到訊息後立即顯示在網頁終端機上。
- **Input 流程**：在網頁終端機輸入字元時，立即發佈至 `serial/CM/input`。

### 3.2 測試環境配置
- **MQTT Broker**: `your-broker-address`
- **Port**: `1883` (註：原需求提及 1833，請確認是否為標準 MQTT Port 1883 或特定埠號)
- **Subscribe Topic (Terminal Output)**: `serial/CM/out`
- **Publish Topic (Terminal Input)**: `serial/CM/input`

### 3.3 後端需求 (Backend)
- **設定檔管理**：支援從外部檔案（如 `.env` 或 `config.json`）讀取 MQTT Broker 地址、埠號及 Topic 資訊。
- **MQTT 橋接**：
    - 建立與 Broker 的穩定連線。
    - 當從 MQTT 收到數據時，需將 Buffer/String 傳送至前端（可透過 Socket.io 或直接封裝）。
- **靜態資源服務**：託管並啟動前端 HTML/JS 頁面。

### 3.4 前端需求 (Frontend)
- **Terminal 實作**：使用 `xterm.js` 初始化終端機。
- **I/O 處理**：
    - 監聽終端機的輸入事件（`onData`），並將輸入內容發送給後端以進行 MQTT Publish。
    - 接收後端傳來的數據，並使用 `terminal.write()` 渲染至畫面。

## 4. 預期檔案結構
```text
mqtt-term/
├── config.json          # 存放 MQTT 連線與 Topic 設定
├── server.js            # Node.js 主程式 (Express + MQTT Client)
├── public/              # 前端網頁資源
│   ├── index.html       # 終端機入口頁面
│   └── script.js        # xterm.js 初始化與邏輯
├── package.json         # 專案依賴設定
└── README.md            # 專案說明文件
```

---

## 5. 給 Gemini 的實作指令 (Prompt 建議)

> 「請根據上述 `mqtt-term` 需求規格書，幫我撰寫最小化實作的程式碼。
> 1. 提供 `package.json` 需要的依賴（如 `express`, `mqtt`, `xterm` 等）。
> 2. 撰寫 `server.js`：需包含連接 MQTT Broker `your-broker-address:1883` 的邏輯，並處理 `serial/CM/out` (Sub) 與 `serial/CM/input` (Pub) 的轉發。
> 3. 撰寫前端 `index.html` 與 `script.js`：使用 CDN 引入 `xterm.js`，實現與後端同步的 I/O。
> 4. **注意**：後端與前端通訊建議使用 WebSocket (如 `ws` 或 `socket.io`) 作為 MQTT 數據的最後一哩路，確保即時性。
> 5. 程式碼中的註解請全部使用英文 (English comments only)。」

---

### 技術備註 (給你參考)
* **MQTT Port**: 通常標準是 `1883`。如果你確定環境是 `1833`，記得在實作時調整。
* **輸入緩衝**: 由於 `xterm.js` 的 `onData` 是按鍵觸發，如果你是輸入一個字元就 Pub 一次，對於頻繁輸入（如快速打字）會產生大量小封包。在之後的進階版中，可以考慮加入短暫的 Buffer 處理，但在 MVP 階段，直接發送是最簡單的作法。
