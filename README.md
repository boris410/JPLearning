# 五十音學習網站（Japanese Kana Learning Web App）

這是一個五十音學習平台的互動式網站，介面讓使用者練習平假名與片假名。

網站採用 HTML + JavaScript 搭配 Python Django 與 MongoDB Atlas 架構。

---

## 技術架構

- **前端**：HTML / CSS / JavaScript / jQuery
- **後端**：Python 3 + Django
- **資料庫**：MongoDB Atlas（Cluster）
- **容器化部署**：Docker + docker-compose ✅
- **雲端部署**：AWS EC2 ✅
- **其他**：
  - FullPage.js（畫面動畫）
  - localStorage（記錄訪客狀態）

---

## 目前功能

- ✅ 支援中文介面
- ✅ 五十音清單：平假名與片假名切換顯示
- ✅ 點擊假名可顯示大字與播放音效
- ✅ 音效與互動動畫
- ✅ 手機版 RWD 初步支援
- ✅ localStorage 紀錄訪客學習紀錄（測試階段）

---

## 🔜 預定功能（開發中）

- [ ] 拗音與日文單字練習模式
- [ ] 測驗模式（倒數計時、即時正誤反饋）
- [ ] 登入功能（訪客登入、Google OAuth）
- [ ] 學習進度記錄與查詢
- [ ] 多語系支援（預設包含中／英／日）

---

## Docker 與 AWS 部署 ✅

本專案支援 `docker-compose` 快速啟動，並已成功部署至 AWS EC2 上。

### 🚀 使用方式（本地或遠端皆適用）：

1. 編輯 `.env`，檔案中env.exmaple可以修改 只需要一個 MongoDB Atlas 的IP
2. 執行以下指令：
   docker-compose up --build -d

## 製作目的
想自行製作一個熟悉日文５０音的工具，藉機練習HTML、RWD、Django 以及 MongoDB。

## 後續
之後學習React.js，會進一步改成 手機APP 版本


