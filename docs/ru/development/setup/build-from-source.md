---
title: Сборка из исходного кода
permalink: /ru/development/setup/build-from-source/
createTime: 2026/08/12 21:30:00
---

# Сборка проекта

EuoraCraft Launcher состоит из бэкенда на Python, подмодуля фронтенда `frontend` и подмодуля Core `ECL/game`. При клонировании нужно получить и подмодули.

## Требования к окружению

| Инструмент | Версия |
| --- | --- |
| Python | 3.11 или новее, рекомендуется 3.12 |
| Node.js | 22 |
| pnpm | 10.34.4 |
| Git | Последняя стабильная версия |

::: warning Системные зависимости Linux
В Ubuntu/Debian нужно дополнительно установить GTK, WebKit и инструменты упаковки:

```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```
:::

## 1. Получение исходного кода

```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
cd EuoraCraft-Launcher
```

Если репозиторий уже склонирован обычным способом, инициализируйте подмодули:

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

## 2. Установка зависимостей бэкенда

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

## 3. Сборка фронтенда

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build
cd ..
```

Результат сборки фронтенда находится в `frontend/dist`: этот каталог читают и запуск бэкенда, и упаковка через PyInstaller.

## 4. Запуск из исходного кода

```bash
python main.py
```

Для входа через Microsoft создайте в корне файл `.env` и укажите `MICROSOFT_CLIENT_ID`; без этого разработка возможна, но вход через Microsoft недоступен. Журналы работы находятся в `ECL_data/logs`.

## 5. Проверка проекта

```bash
python -m ruff check ECL tests
python -m pytest -q
```

Если менялся фронтенд, дополнительно выполните в каталоге `frontend`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 6. Упаковка настольного приложения

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

| Платформа | Результат сборки |
| --- | --- |
| Windows | `dist/EuoraCraft Launcher.exe` |
| Linux | `dist/EuoraCraft Launcher` |
| macOS | `dist/EuoraCraft Launcher.app` |

Сборка завершена, если в конце терминала появилось `Build complete!`, а в `dist` есть артефакт для нужной платформы.

::: tip Частые вопросы
Если сообщается об отсутствии `frontend/dist`, повторите шаг 3. Если каталоги подмодулей пусты, снова выполните `git submodule update --init --recursive`.
:::
