---
title: Minecraft のバージョンマニフェストを理解する
createTime: 2026/08/04 23:00:00
permalink: /ja/tutorials/minecraft-launcher/fundamentals/version-manifest/
---

# Minecraft のバージョンマニフェストを理解する

::: tip 読者へ
本チュートリアルは完成したソースコードを提供せず、考え方と重要なコード片のみを示します。
詳しい理由は[チュートリアルの説明](/ja/tutorials/minecraft-launcher/)を参照してください。
:::

Minecraft のランチャーは、バージョンマニフェスト（`version.json`）から多くの設定情報を読み取る必要があります。本章ではマニフェストの中心的な構造を整理し、起動時に必ず確認すべきフィールドを説明します。

---

## マニフェストの構造の概要

現代の Minecraft のバージョンマニフェスト（JSON 形式）は、通常次のような要素を含みます（不要なフィールドは省略しています）：

```json5
{
  "arguments": {
    "game": [
      "--username",
      "${auth_player_name}",
      "--version",
      "${version_name}",
      "--gameDir",
      "${game_directory}",
      "--assetsDir",
      "${assets_root}",
      "--assetIndex",
      "${assets_index_name}",
      "--uuid",
      "${auth_uuid}",
      "--accessToken",
      "${auth_access_token}",
      "--clientId",
      "${clientid}",
      "--xuid",
      "${auth_xuid}",
      "--versionType",
      "${version_type}"
      // ... その他のゲーム引数
    ],
    "jvm": [
      "--sun-misc-unsafe-memory-access=allow",
      "--enable-native-access=ALL-UNNAMED",
      "-Djava.library.path=${natives_directory}/java",
      "-Djna.tmpdir=${natives_directory}/jna",
      "-Dorg.lwjgl.system.SharedLibraryExtractPath=${natives_directory}/lwjgl",
      "-Dio.netty.native.workdir=${natives_directory}/netty",
      "-Dminecraft.launcher.brand=${launcher_name}",
      "-Dminecraft.launcher.version=${launcher_version}",
      "-cp",
      "${classpath}"
      // ... その他の JVM 引数
    ]
  },
  "assetIndex": {
    "id": "32",
    "sha1": "49da57a9512de46382d2fe4b68af047fea7a16f9",
    "size": 586366,
    "totalSize": 477011740,
    "url": "https://piston-meta.mojang.com/v1/packages/49da57a9512de46382d2fe4b68af047fea7a16f9/32.json"
  },
  "downloads": {
    "client": {
      "sha1": "2dc72797acbc1b63fc16a11c4ac393605f453754",
      "size": 39193383,
      "url": "https://piston-data.mojang.com/v1/objects/2dc72797acbc1b63fc16a11c4ac393605f453754/client.jar"
    }
  },
  "id": "26.2",
  "javaVersion": {
    "component": "java-runtime-epsilon",
    "majorVersion": 25
  },
  "libraries": [
    {
      "downloads": {
        "artifact": {
          "path": "at/yawk/lz4/lz4-java/1.10.1/lz4-java-1.10.1.jar",
          "sha1": "f541d7f910fe3d76f38f799c507c48cc81b12ecb",
          "size": 910232,
          "url": "https://libraries.minecraft.net/at/yawk/lz4/lz4-java/1.10.1/lz4-java-1.10.1.jar"
        }
      },
      "name": "at.yawk.lz4:lz4-java:1.10.1"
    }
    // ... その他のライブラリ
  ],
  "mainClass": "net.minecraft.client.main.Main",
  "releaseTime": "2026-06-16T12:03:33+00:00",
  "time": "2026-06-16T12:03:33+00:00",
  "type": "release"
}
```

> 📝 **注**：上記の例はコメントを許す JSON5 で書かれていますが、実際のマニフェストはコメントを含まない純粋な JSON です。

---

## 主要フィールドの詳細

ランチャーの開発では次のフィールドだけを扱えば十分です。それ以外（`releaseTime` など）は起動処理に影響しません。

| フィールド | 型 | 説明 |
|----------|------|------|
| `arguments.game` | `string[]` | ゲーム本体に渡す起動引数（ユーザー名、ゲームディレクトリなど）。プレースホルダーを含みます。 |
| `arguments.jvm` | `string[]` | Java 仮想マシンの実行引数（ライブラリパス、システムプロパティなど）。こちらもプレースホルダーを含みます。 |
| `assetIndex.id` | `string` | アセットインデックスの識別子（`"32"` など）。対応するインデックス JSON の特定に使います。 |
| `assetIndex.sha1` | `string` | アセットインデックスファイルの SHA-1。ファイルの完全性確認に使います。 |
| `downloads.client` | `object` | ゲームクライアント本体の JAR のダウンロード情報（`sha1`、`size`、`url`）。 |
| `id` | `string` | バージョン名（`"26.2"` など）。多くのランチャーは画面表示やディレクトリ名に使います。 |
| `javaVersion.majorVersion` | `number` | 推奨される Java のメジャーバージョン（`25` など）。これより低いと起動できない場合があります。 |
| `libraries` | `object[]` | 依存ライブラリの一覧。各要素は `name`（Maven 座標）とダウンロード情報を持ちます。 |
| `mainClass` | `string` | ゲームのメインクラス（`net.minecraft.client.main.Main` など）。Java コマンドのクラス名に使います。 |
| `type` | `string` | バージョンの種類（`"release"`、`"snapshot"` など）。 |

---

## 依存ライブラリに関する注意

### Maven ライブラリの `sha1` の位置は一定ではない

バージョンによって、ライブラリの SHA-1 が入る位置が異なります。主に次の 2 通りです。

**形式 1**（`downloads.artifact` の中に入る）：
```json
{
  "libraries": [
    {
      "downloads": {
        "artifact": {
          "sha1": "f541d7f910fe3d76f38f799c507c48cc81b12ecb"
        }
      }
    }
  ]
}
```

**形式 2**（ライブラリのオブジェクト直下に入る）：
```json
{
  "libraries": [
    {
      "sha1": "ada2141c0cc52ee8f5c48cd5fa4ce0e794f22236"
    }
  ]
}
```

> 💡 **推奨**：解析時は両方の構造に対応し、まず `downloads.artifact.sha1` を探し、存在しなければ最上位の `sha1` にフォールバックしてください。
