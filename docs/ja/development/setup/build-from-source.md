---
title: ソースコードからのビルド
permalink: /ja/development/setup/build-from-source/
createTime: 2026/08/12 21:30:00
---

# プロジェクトのビルド

EuoraCraft Launcher は Python バックエンド、frontend フロントエンドサブモジュール、`ECL/game` Core サブモジュールで構成されています。クローン時にはサブモジュールも同時に取得してください。

## 動作環境

| ツール | バージョン |
| --- | --- |
| Python | 3.11 以降（3.12 を推奨） |
| Node.js | 22 |
| pnpm | 10.34.4 |
| Git | 最新安定版 |

::: warning Linux のシステム依存パッケージ
Ubuntu/Debian では GTK、WebKit、パッケージングツールを追加でインストールする必要があります：

```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```
:::

## 1. ソースコードの取得

```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
cd EuoraCraft-Launcher
```

すでに通常の方法でクローンしている場合は、サブモジュールを初期化します：

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

## 2. バックエンドの依存関係をインストール

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

## 3. フロントエンドのビルド

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build
cd ..
```

フロントエンドのビルド結果は `frontend/dist` に出力され、バックエンドの実行と PyInstaller によるパッケージングの両方がこのディレクトリを参照します。

## 4. ソースコードから実行

```bash
python main.py
```

Microsoft ログインを使う場合は、ルートディレクトリに `.env` を作成し `MICROSOFT_CLIENT_ID` を設定します。未設定でも Microsoft ログインに依存しない開発は可能です。実行ログは `ECL_data/logs` に出力されます。

## 5. プロジェクトのチェック

```bash
python -m ruff check ECL tests
python -m pytest -q
```

フロントエンドを変更した場合は、`frontend` ディレクトリで追加的に実行します：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 6. デスクトップアプリのパッケージング

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

| プラットフォーム | ビルド成果物 |
| --- | --- |
| Windows | `dist/EuoraCraft Launcher.exe` |
| Linux | `dist/EuoraCraft Launcher` |
| macOS | `dist/EuoraCraft Launcher.app` |

ターミナルの最後に `Build complete!` が表示され、`dist` に対応プラットフォームの成果物があればビルド完了です。

::: tip よくある問題
`frontend/dist` が見つからないと表示された場合は手順 3 を再実行してください。サブモジュールのディレクトリが空の場合は `git submodule update --init --recursive` を再実行してください。
:::
