---
title: 了解 Minecraft 版本清單檔案
createTime: 2026/08/04 23:00:00
permalink: /zh-tw/tutorials/minecraft-launcher/fundamentals/version-manifest/
---

# 了解 Minecraft 版本清單檔案

::: tip 致讀者
本教學不提供完整原始碼，僅提供思路與關鍵程式碼片段。
詳細原因請參見：[教學說明](/zh-tw/tutorials/minecraft-launcher/)
:::

Minecraft 啟動器需要從版本清單（`version.json`）中讀取大量設定資訊，本章將重點剖析清單檔案的核心結構，並說明哪些欄位是啟動過程中必須關注的。

---

## 清單檔案結構概覽

現代 Minecraft 版本清單（以 JSON 格式儲存）通常包含以下關鍵部分（已省略非必要欄位）：

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
      // ... 更多遊戲參數
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
      // ... 更多 JVM 參數
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
    // ... 更多相依函式庫
  ],
  "mainClass": "net.minecraft.client.main.Main",
  "releaseTime": "2026-06-16T12:03:33+00:00",
  "time": "2026-06-16T12:03:33+00:00",
  "type": "release"
}
```

> 📝 **註**：上述範例使用了 JSON5 語法（允許註解），實際清單檔案為純 JSON，不含註解。

---

## 關鍵欄位詳解

開發啟動器只需關注以下欄位，其餘欄位（如 `releaseTime` 等）不影響啟動邏輯。

| 欄位路徑 | 型別 | 說明 |
|----------|------|------|
| `arguments.game` | `string[]` | 遊戲引擎本身所需的啟動參數，如使用者名稱、遊戲目錄等，包含佔位符。 |
| `arguments.jvm` | `string[]` | Java 虛擬機執行參數，如函式庫路徑、系統屬性等，同樣包含佔位符。 |
| `assetIndex.id` | `string` | 資源索引識別碼（如 `"32"`），用於定位對應的資源索引 JSON 檔案。 |
| `assetIndex.sha1` | `string` | 資源索引檔案的 SHA-1 雜湊值，用於校驗檔案完整性。 |
| `downloads.client` | `object` | 遊戲用戶端主 JAR 檔案的下載資訊，包含 `sha1`、`size`、`url`。 |
| `id` | `string` | 版本名稱（如 `"26.2"`），許多啟動器會將其顯示在介面上或用於目錄命名。 |
| `javaVersion.majorVersion` | `number` | 建議使用的 Java 主版本號（如 `25`），低於此版本可能無法正常啟動。 |
| `libraries` | `object[]` | 所有相依函式庫的清單，每個函式庫包含 `name`（Maven 座標）與下載資訊。 |
| `mainClass` | `string` | 遊戲主進入類別（如 `net.minecraft.client.main.Main`），用於 Java 命令的類別名稱。 |
| `type` | `string` | 版本型別，如 `"release"`（正式版）、`"snapshot"`（快照）等。 |

---

## 關於相依函式庫的特別說明

### Maven 函式庫的 `sha1` 位置不固定

不同版本的清單中，函式庫檔案的 SHA-1 雜湊值可能出現在不同位置，通常有兩種形式：

**形式一**（巢狀於 `downloads.artifact` 中）：
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

**形式二**（直接位於函式庫物件下）：
```json
{
  "libraries": [
    {
      "sha1": "ada2141c0cc52ee8f5c48cd5fa4ce0e794f22236"
    }
  ]
}
```

> 💡 **建議**：解析時應相容兩種結構，優先查找 `downloads.artifact.sha1`，若不存在則回退到頂層的 `sha1`。
