---
title: Das Versionsmanifest von Minecraft verstehen
createTime: 2026/08/04 23:00:00
permalink: /de/tutorials/minecraft-launcher/fundamentals/version-manifest/
---

# Das Versionsmanifest von Minecraft verstehen

::: tip An die Leserschaft
Dieses Tutorial enthält keinen vollständigen Quellcode, sondern nur die Denkweise und zentrale Codeausschnitte.
Mehr dazu: [Hinweise zum Tutorial](/de/tutorials/minecraft-launcher/).
:::

Ein Minecraft-Launcher muss viele Einstellungen aus dem Versionsmanifest (`version.json`) lesen. Dieses Kapitel erklärt den Kernaufbau des Manifests und welche Felder beim Start wichtig sind.

---

## Aufbau des Manifests

Ein modernes Versionsmanifest von Minecraft (im JSON-Format) enthält meist folgende Teile (unnötige Felder sind weggelassen):

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
      // ... weitere Spielargumente
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
      // ... weitere JVM-Argumente
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
    // ... weitere Bibliotheken
  ],
  "mainClass": "net.minecraft.client.main.Main",
  "releaseTime": "2026-06-16T12:03:33+00:00",
  "time": "2026-06-16T12:03:33+00:00",
  "type": "release"
}
```

> 📝 **Hinweis**: Das Beispiel nutzt JSON5 (mit Kommentaren). Das echte Manifest ist reines JSON ohne Kommentare.

---

## Die wichtigen Felder

Für einen Launcher genügen die folgenden Felder; der Rest (etwa `releaseTime`) beeinflusst den Start nicht.

| Feld | Typ | Bedeutung |
|----------|------|------|
| `arguments.game` | `string[]` | Startargumente für das Spiel selbst, etwa Benutzername und Spielverzeichnis; enthalten Platzhalter. |
| `arguments.jvm` | `string[]` | Argumente der Java-VM, etwa Bibliothekspfade und Systemeigenschaften; ebenfalls mit Platzhaltern. |
| `assetIndex.id` | `string` | Kennung des Asset-Index (z. B. `"32"`), damit die passende Index-JSON gefunden wird. |
| `assetIndex.sha1` | `string` | SHA-1 der Index-Datei, zur Prüfung der Integrität. |
| `downloads.client` | `object` | Download-Informationen zur Haupt-JAR des Clients: `sha1`, `size`, `url`. |
| `id` | `string` | Versionsname (z. B. `"26.2"`); viele Launcher zeigen ihn an oder nutzen ihn als Verzeichnisnamen. |
| `javaVersion.majorVersion` | `number` | Empfohlene Java-Hauptversion (z. B. `25`); darunter startet das Spiel eventuell nicht. |
| `libraries` | `object[]` | Liste der Abhängigkeiten; jede enthält `name` (Maven-Koordinaten) und Download-Informationen. |
| `mainClass` | `string` | Hauptklasse des Spiels (z. B. `net.minecraft.client.main.Main`) für den Java-Aufruf. |
| `type` | `string` | Versionsart, etwa `"release"` oder `"snapshot"`. |

---

## Besonderheiten bei Bibliotheken

### Die Position von `sha1` ist nicht fest

Je nach Version steht der SHA-1 einer Bibliothek an unterschiedlichen Stellen. Üblich sind zwei Formen.

**Form 1** (innerhalb von `downloads.artifact`):
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

**Form 2** (direkt im Bibliotheksobjekt):
```json
{
  "libraries": [
    {
      "sha1": "ada2141c0cc52ee8f5c48cd5fa4ce0e794f22236"
    }
  ]
}
```

> 💡 **Empfehlung**: Beim Parsen beide Formen unterstützen: zuerst `downloads.artifact.sha1` suchen, sonst auf das oberste `sha1` zurückfallen.
