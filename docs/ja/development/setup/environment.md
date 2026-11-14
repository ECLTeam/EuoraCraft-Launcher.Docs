---
title: 環境構築
createTime: 2026/08/15 00:54:10
permalink: /ja/development/setup/environment/
---

::: warning お知らせ
このページは開発者向けのドキュメントで、EuoraCraft Launcher の開発者とコントリビューターを対象としています。一般ユーザーの方は[ホーム](/ja/)へお戻りください。このページの内容は EuoraCraft Launcher の利用には影響しません。
:::

## はじめに
`EuoraCraft Launcher` の開発を始める前に、開発環境を構築する必要があります。以下に手順と要件をまとめます。

### 前提条件
作業を始める前に、次のツールとソフトウェアがインストールされていることを確認してください：
- Python 3.11 以降（3.13 を推奨）
- Node.js 22
- pnpm 10.34.4
- Git の最新安定版
インストールが済んだら次の手順に進みます。

### 1. リポジトリのクローン
まず `EuoraCraft Launcher` のソースリポジトリをクローンします。本プロジェクトは Git サブモジュールを使用しているため、次のコマンドですべてのリポジトリを取得してください：
```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
```

メインリポジトリ[ECLteam/EuoraCraft-Launcher](https://github.com/ECLteam/EuoraCraft-Launcher)を通常の方法でクローンした場合は、次のコマンドでサブモジュールを初期化します：
```bash
git submodule sync --recursive
git submodule update --init --recursive
```
エラーが出なければ、次の手順に進めます。


### 2. 依存関係のインストール
::: note
ネットワーク環境によっては、ミラーを使用するとダウンロードの速度と成功率が向上します。よく使われるミラーは次のとおりです：
- Python ミラー：
  - 清華大学：https://pypi.tuna.tsinghua.edu.cn/simple
  - Alibaba Cloud：https://mirrors.aliyun.com/pypi/simple/
- Node.js ミラー：
  - npmmirror：https://registry.npmmirror.com/
:::
EuoraCraft Launcher はフロントエンドとバックエンドが分かれているため、それぞれ依存関係をインストールします。
バックエンドの依存関係は次のコマンドでインストールします。
`Windows PowerShell` の場合：
```powershell
# Windows PowerShell
python -m venv .venv # 仮想環境を作成
.\.venv\Scripts\Activate.ps1 # 仮想環境を有効化
python -m pip install -e ".[dev]" # 依存関係をインストール
```

`Linux` または `macOS` の場合：
```bash
python -m venv .venv # 仮想環境を作成
source .venv/bin/activate # 仮想環境を有効化
python -m pip install -e ".[dev]" # 依存関係をインストール
```
バックエンドの依存関係をインストールしたら、フロントエンドのディレクトリに移動して依存関係をインストールします：
```bash
cd frontend
pnpm install # npm や yarn でも可能ですが、pnpm を推奨します
```

問題がなければ開発環境の構築は完了です。`EuoraCraft Launcher` の開発を始められます。
