---
title: Umgebung einrichten
createTime: 2026/08/15 00:54:10
permalink: /de/development/setup/environment/
---

::: warning Hinweis
Diese Seite richtet sich an Entwickler und Mitwirkende von EuoraCraft Launcher. Als normaler Nutzer kannst du zur [Startseite](/de/) zurückkehren; die Inhalte hier betreffen die Nutzung von EuoraCraft Launcher nicht.
:::

## Loslegen
Bevor du `EuoraCraft Launcher` entwickelst, musst du die Entwicklungsumgebung einrichten. Die Schritte und Voraussetzungen stehen unten.

### Voraussetzungen
Stelle vor dem Start sicher, dass folgende Werkzeuge installiert sind:
- Python 3.11 oder neuer (3.13 empfohlen)
- Node.js 22
- pnpm 10.34.4
- Git in der neuesten stabilen Version
Danach geht es mit dem nächsten Schritt weiter.

### 1. Repository klonen
Klone zuerst das Quellcode-Repository von `EuoraCraft Launcher`. Das Projekt verwendet Git-Submodule, daher klonst du alle Repositories mit:
```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
```

Wenn du das Haupt-Repository [ECLteam/EuoraCraft-Launcher](https://github.com/ECLteam/EuoraCraft-Launcher) bereits normal geklont hast, initialisiere die Submodule mit:
```bash
git submodule sync --recursive
git submodule update --init --recursive
```
Wenn keine Fehler auftreten, kannst du weitermachen.


### 2. Abhängigkeiten installieren
::: note
Je nach Netzwerkumgebung helfen Mirrors, Downloads schneller und zuverlässiger zu machen. Häufig genutzte Mirrors:
- Python-Mirrors:
  - Tsinghua-Universität: https://pypi.tuna.tsinghua.edu.cn/simple
  - Alibaba Cloud: https://mirrors.aliyun.com/pypi/simple/
- Node.js-Mirror:
  - npmmirror: https://registry.npmmirror.com/
:::
EuoraCraft Launcher besteht aus getrenntem Frontend und Backend, daher werden die Abhängigkeiten getrennt installiert.
Installiere die Backend-Abhängigkeiten:
Unter `Windows PowerShell`:
```powershell
# Windows PowerShell
python -m venv .venv # virtuelle Umgebung anlegen
.\.venv\Scripts\Activate.ps1 # virtuelle Umgebung aktivieren
python -m pip install -e ".[dev]" # Abhängigkeiten installieren
```

Unter `Linux` oder `macOS`:
```bash
python -m venv .venv # virtuelle Umgebung anlegen
source .venv/bin/activate # virtuelle Umgebung aktivieren
python -m pip install -e ".[dev]" # Abhängigkeiten installieren
```
Wechsle anschließend in das Frontend-Verzeichnis und installiere dessen Abhängigkeiten:
```bash
cd frontend
pnpm install # npm oder yarn funktionieren auch, empfohlen ist pnpm
```

Wenn alles ohne Fehler durchläuft, ist die Umgebung fertig und du kannst mit der Entwicklung von `EuoraCraft Launcher` beginnen.
