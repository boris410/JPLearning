# 使用 Python 官方映像檔
FROM python:3.11-slim

# 建立容器內的工作資料夾
WORKDIR /app

# 複製需求檔進容器
COPY requirements.txt ./

# 安裝 Python 套件
RUN pip install --no-cache-dir -r requirements.txt

# 複製整個 Django 專案進容器
COPY . .

# 告訴 Docker 這個應用會開放 8000 port（Django 預設）
EXPOSE 8000

# 啟動 Django 開發伺服器
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
