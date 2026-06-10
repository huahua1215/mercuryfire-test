# 前端面試專案

Vue 3 + Vite + TypeScript + Tailwind CSS + Pinia + Vue Router + axios

## 技術堆疊

| 層級 | 套件 |
|---|---|
| 框架 | Vue 3（`<script setup>`） |
| 建置工具 | Vite |
| 語言 | TypeScript（strict 模式） |
| 樣式 | Tailwind CSS v4 |
| 狀態管理 | Pinia |
| 路由 | Vue Router |
| HTTP 請求 | axios |
| 程式碼規範 | ESLint + typescript-eslint + eslint-plugin-vue |
| 格式化 | Prettier |

## 專案結構

```
src/
├── api/            # axios 封裝 + 各模組 service 函式
│   └── modules/    # 每個 API 領域一個檔案
├── composables/    # 可重用的組合式函式
├── components/     # 共用 UI 元件
├── views/          # 路由層級的頁面元件
├── stores/         # Pinia 狀態管理
├── router/         # Vue Router 設定
├── types/          # TypeScript interface、enum、type
└── utils/          # 純工具函式
```

## 快速開始

### 系統需求

- Node.js >= 18
- npm >= 9

### 環境變數設定

將 `.env.example` 複製為 `.env` 並填入對應值：

```bash
cp .env.example .env
```

| 變數 | 說明 |
|---|---|
| `VITE_API_BASE_URL` | 後端 API 的 Base URL |
| `VITE_INTERVIEWER_NAME` | 顯示在應用程式中的姓名 |

### 安裝相依套件

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

預設執行於 `http://localhost:5173`。

### TypeScript 型別檢查

```bash
npm run typecheck
```

### 程式碼規範檢查

```bash
npm run lint        # 檢查
npm run lint:fix    # 自動修正
```

### 程式碼格式化

```bash
npm run format        # 直接寫入
npm run format:check  # 僅檢查，不修改
```

### 正式環境建置

```bash
npm run build
npm run preview
```
