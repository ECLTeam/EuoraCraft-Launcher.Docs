---
title: Разбираем манифест версии Minecraft
createTime: 2026/08/04 23:00:00
permalink: /ru/tutorials/minecraft-launcher/fundamentals/version-manifest/
---

# Разбираем манифест версии Minecraft

::: tip Читателю
В этом руководстве нет полного исходного кода — только подход и ключевые фрагменты.
Подробнее: [о руководстве](/ru/tutorials/minecraft-launcher/).
:::

Лаунчеру Minecraft нужно прочитать много настроек из манифеста версии (`version.json`). В этой главе разбирается основная структура манифеста и объясняется, на какие поля нужно смотреть при запуске.

---

## Общая структура манифеста

Современный манифест версии Minecraft (в формате JSON) обычно содержит следующие ключевые части (необязательные поля опущены):

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
      // ... другие аргументы игры
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
      // ... другие аргументы JVM
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
    // ... другие библиотеки
  ],
  "mainClass": "net.minecraft.client.main.Main",
  "releaseTime": "2026-06-16T12:03:33+00:00",
  "time": "2026-06-16T12:03:33+00:00",
  "type": "release"
}
```

> 📝 **Примечание**: в примере использован JSON5 (с комментариями), но настоящий манифест — чистый JSON без комментариев.

---

## Ключевые поля

Для лаунчера достаточно этих полей; остальные (например, `releaseTime`) на логику запуска не влияют.

| Поле | Тип | Описание |
|----------|------|------|
| `arguments.game` | `string[]` | Аргументы для самой игры: имя пользователя, каталог игры и т. п. Содержат заполнители. |
| `arguments.jvm` | `string[]` | Аргументы запуска JVM: пути к библиотекам, системные свойства и т. п. Тоже с заполнителями. |
| `assetIndex.id` | `string` | Идентификатор индекса ресурсов (например, `"32"`), по нему находится нужный JSON индекса. |
| `assetIndex.sha1` | `string` | SHA-1 файла индекса ресурсов, используется для проверки целостности. |
| `downloads.client` | `object` | Данные для загрузки основного JAR клиента: `sha1`, `size`, `url`. |
| `id` | `string` | Имя версии (например, `"26.2"`); многие лаунчеры показывают его в интерфейсе или используют в имени каталога. |
| `javaVersion.majorVersion` | `number` | Рекомендуемая основная версия Java (например, `25`); ниже неё запуск может не работать. |
| `libraries` | `object[]` | Список зависимостей; каждая содержит `name` (координаты Maven) и данные для загрузки. |
| `mainClass` | `string` | Главный класс игры (например, `net.minecraft.client.main.Main`) для командной строки Java. |
| `type` | `string` | Тип версии: `"release"`, `"snapshot"` и т. п. |

---

## Особенности работы с библиотеками

### Положение `sha1` у библиотек Maven не фиксировано

В разных версиях манифеста SHA-1 библиотеки может находиться в разных местах. Обычно есть два варианта.

**Вариант 1** (внутри `downloads.artifact`):
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

**Вариант 2** (непосредственно в объекте библиотеки):
```json
{
  "libraries": [
    {
      "sha1": "ada2141c0cc52ee8f5c48cd5fa4ce0e794f22236"
    }
  ]
}
```

> 💡 **Совет**：при разборе поддерживайте оба варианта: сначала ищите `downloads.artifact.sha1`, а если его нет — берите `sha1` верхнего уровня.
