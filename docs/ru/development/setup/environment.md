---
title: Настройка окружения
createTime: 2026/08/15 00:54:10
permalink: /ru/development/setup/environment/
---

::: warning Внимание
Эта страница — документация для разработчиков EuoraCraft Launcher. Если вы обычный пользователь, вернитесь на [главную](/ru/); содержимое этой страницы не влияет на использование EuoraCraft Launcher.
:::

## Начало
Перед разработкой `EuoraCraft Launcher` нужно настроить окружение. Ниже приведены шаги и требования.

### Требования
До начала работы убедитесь, что установлены следующие инструменты:
- Python 3.11 или новее (рекомендуется 3.13)
- Node.js 22
- pnpm 10.34.4
- Последняя стабильная версия Git
После установки можно переходить к следующему шагу.

### 1. Клонирование репозитория
Сначала клонируйте репозиторий с исходным кодом `EuoraCraft Launcher`. Проект использует подмодули Git, поэтому клонируйте вместе с ними:
```bash
git clone --recurse-submodules https://github.com/ECLteam/EuoraCraft-Launcher.git
```

Если основной репозиторий [ECLteam/EuoraCraft-Launcher](https://github.com/ECLteam/EuoraCraft-Launcher) уже склонирован обычным способом, инициализируйте подмодули:
```bash
git submodule sync --recursive
git submodule update --init --recursive
```
Если ошибок нет, можно переходить к следующему шагу.


### 2. Установка зависимостей
::: note
В зависимости от сети может помочь зеркало — загрузка будет быстрее и надёжнее. Часто используемые зеркала:
- Зеркала Python:
  - Университет Цинхуа: https://pypi.tuna.tsinghua.edu.cn/simple
  - Alibaba Cloud: https://mirrors.aliyun.com/pypi/simple/
- Зеркало Node.js:
  - npmmirror: https://registry.npmmirror.com/
:::
EuoraCraft Launcher разделён на фронтенд и бэкенд, поэтому зависимости устанавливаются отдельно.
Установите зависимости бэкенда:
В `Windows PowerShell` выполните:
```powershell
# Windows PowerShell
python -m venv .venv # создать виртуальное окружение
.\.venv\Scripts\Activate.ps1 # активировать окружение
python -m pip install -e ".[dev]" # установить зависимости
```

В `Linux` или `macOS` выполните:
```bash
python -m venv .venv # создать виртуальное окружение
source .venv/bin/activate # активировать окружение
python -m pip install -e ".[dev]" # установить зависимости
```
После установки зависимостей бэкенда перейдите в каталог фронтенда и установите его зависимости:
```bash
cd frontend
pnpm install # можно использовать npm или yarn, но рекомендуется pnpm
```

Если всё прошло без ошибок, окружение готово — можно начинать разработку `EuoraCraft Launcher`.
