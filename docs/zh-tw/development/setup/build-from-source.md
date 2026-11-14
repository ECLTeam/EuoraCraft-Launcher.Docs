---
title: 從原始碼建置
permalink: /zh-tw/development/setup/build-from-source/
createTime: 2026/08/12 21:30:00
---

# 專案建置

EuoraCraft Launcher 由 Python 後端、frontend 前端子模組與 `ECL/game` Core 子模組組成。複製專案時必須同時拉取子模組。

## 環境要求

| 工具 | 版本 |
| --- | --- |
| Python | 3.11 或更高，建議 3.12 |
| Node.js | 22 |
| pnpm | 10.34.4 |
| Git | 最新穩定版 |

::: warning Linux 系統相依套件
Ubuntu/Debian 需要額外安裝 GTK、WebKit 與打包工具：

```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```
:::

## 1. 取得原始碼

```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
cd EuoraCraft-Launcher
```

如果已經用一般方式複製，請補做子模組初始化：

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

## 2. 安裝後端相依套件

::: code-tabs
@tab Windows PowerShell
```powershell
py -3.12 -m venv .venv
Set-ExecutionPolicy -Scope Process Bypass
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

@tab Linux / macOS
```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```
:::

## 3. 建置前端

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build
cd ..
```

前端建置結果位於 `frontend/dist`，後端執行與 PyInstaller 打包都會讀取該目錄。

## 4. 執行原始碼

```bash
python main.py
```

Microsoft 登入需要在根目錄建立 `.env` 並填寫 `MICROSOFT_CLIENT_ID`；未設定時仍可進行不依賴 Microsoft 登入的開發。執行日誌位於 `ECL_data/logs`。

## 5. 檢查專案

```bash
python -m ruff check ECL tests
python -m pytest -q
```

修改過前端時，在 `frontend` 目錄額外執行：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 6. 打包桌面程式

::: code-tabs
@tab Windows PowerShell
```powershell
$env:ECL_CONSOLE = "1"
$env:ECL_UPX = "0"
python -m PyInstaller --noconfirm EuoraCraft-Launcher.spec
```

@tab Linux / macOS
```bash
ECL_CONSOLE=1 ECL_UPX=0 python -m PyInstaller --noconfirm EuoraCraft-Launcher.spec
```
:::

| 平台 | 建置結果 |
| --- | --- |
| Windows | `dist/EuoraCraft Launcher.exe` |
| Linux | `dist/EuoraCraft Launcher` |
| macOS | `dist/EuoraCraft Launcher.app` |

終端最後出現 `Build complete!`，且 `dist` 中存在對應平台的產物，即表示建置完成。

::: tip 常見問題
提示缺少 `frontend/dist` 時，請重新執行第 3 步；子模組目錄為空時，請重新執行 `git submodule update --init --recursive`。
:::
