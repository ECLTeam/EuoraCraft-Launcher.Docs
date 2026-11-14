---
title: Aus dem Quellcode bauen
permalink: /de/development/setup/build-from-source/
createTime: 2026/08/12 21:30:00
---

# Projekt bauen

EuoraCraft Launcher besteht aus einem Python-Backend, dem Frontend-Submodul `frontend` und dem Core-Submodul `ECL/game`. Beim Klonen müssen die Submodule mitgeladen werden.

## Voraussetzungen

| Werkzeug | Version |
| --- | --- |
| Python | 3.11 oder neuer, 3.12 empfohlen |
| Node.js | 22 |
| pnpm | 10.34.4 |
| Git | Neueste stabile Version |

::: warning Systemabhängigkeiten unter Linux
Unter Ubuntu/Debian müssen GTK, WebKit und Packaging-Werkzeuge zusätzlich installiert werden:

```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```
:::

## 1. Quellcode holen

```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
cd EuoraCraft-Launcher
```

Wenn du bereits normal geklont hast, initialisiere die Submodule nachträglich:

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

## 2. Backend-Abhängigkeiten installieren

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

## 3. Frontend bauen

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build
cd ..
```

Das Ergebnis liegt in `frontend/dist`. Sowohl der Start des Backends als auch das Packaging mit PyInstaller lesen dieses Verzeichnis.

## 4. Aus dem Quellcode starten

```bash
python main.py
```

Für die Microsoft-Anmeldung ist im Projektstamm eine `.env` mit `MICROSOFT_CLIENT_ID` nötig; ohne sie ist Entwicklung möglich, die Microsoft-Anmeldung aber nicht. Logs liegen in `ECL_data/logs`.

## 5. Projekt prüfen

```bash
python -m ruff check ECL tests
python -m pytest -q
```

Wenn du das Frontend geändert hast, zusätzlich im Verzeichnis `frontend`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 6. Desktop-Anwendung paketieren

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

| Plattform | Ergebnis |
| --- | --- |
| Windows | `dist/EuoraCraft Launcher.exe` |
| Linux | `dist/EuoraCraft Launcher` |
| macOS | `dist/EuoraCraft Launcher.app` |

Der Build ist fertig, wenn im Terminal `Build complete!` erscheint und in `dist` das passende Artefakt liegt.

::: tip Häufige Fragen
Fehlt `frontend/dist`, wiederhole Schritt 3. Sind die Submodul-Verzeichnisse leer, führe erneut `git submodule update --init --recursive` aus.
:::
