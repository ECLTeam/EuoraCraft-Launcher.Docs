---
title: 環境建置
createTime: 2026/08/15 00:54:10
permalink: /zh-tw/development/setup/environment/
---

::: warning 提示
本頁面為開發者文件，主要面向 EuoraCraft Launcher 的開發者與貢獻者。如果您是普通使用者，可以返回[首頁](/zh-tw/)；本頁面不影響您使用 EuoraCraft Launcher 的功能。
:::

## 開始
開始開發 `EuoraCraft Launcher` 之前，您需要先建置開發環境。以下是詳細的步驟與要求。

### 前置條件
在正式開始前，請確認您已安裝以下工具與軟體：
- Python 3.11 或更高版本（建議 3.13）
- Node.js 22
- pnpm 10.34.4
- Git 最新穩定版
安裝完成後即可進入下一步。

### 1. 複製倉庫
首先，您需要複製 `EuoraCraft Launcher` 的原始碼倉庫。由於本專案使用了 Git 子模組，請使用以下命令複製所有倉庫：
```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
```

如果您已直接複製主倉庫[ECLteam/EuoraCraft-Launcher](https://github.com/ECLteam/EuoraCraft-Launcher)，請使用以下命令初始化子模組：
```bash
git submodule sync --recursive
git submodule update --init --recursive
```
如果沒有出現錯誤，那麼恭喜您可以進入下一步了。


### 2. 安裝相依套件
::: note
鑑於部分地區網路環境的限制，建議您使用鏡像來源安裝相依套件，以提高下載速度與成功率。以下是一些常用的鏡像來源：
- Python 鏡像來源：
  - 清華大學：https://pypi.tuna.tsinghua.edu.cn/simple
  - 阿里雲：https://mirrors.aliyun.com/pypi/simple/
- Node.js 鏡像來源：
  - 淘寶鏡像：https://registry.npmmirror.com/
:::
由於 EuoraCraft Launcher 採用前後端分離的架構，我們需要分別安裝前端與後端的相依套件。
執行以下命令安裝後端相依套件：
如果您使用的是 `Windows PowerShell`，請執行：
```powershell
# Windows PowerShell
python -m venv .venv # 建立虛擬環境
.\.venv\Scripts\Activate.ps1 # 啟用虛擬環境
python -m pip install -e ".[dev]" # 安裝相依套件
```

如果您使用的是 `Linux` 或 `macOS`，請執行：
```bash
python -m venv .venv # 建立虛擬環境
source .venv/bin/activate # 啟用虛擬環境
python -m pip install -e ".[dev]" # 安裝相依套件
```
安裝完後端相依套件後，您可以進入前端目錄，安裝前端相依套件：
```bash
cd frontend
pnpm install # 您也可以使用 npm 或 yarn 安裝相依套件，但我們建議使用 pnpm
```

好了，如果沒有意外，您已經完成開發環境的建置，接下來可以開始開發 `EuoraCraft Launcher` 了。
