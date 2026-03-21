# 🪵 Schepki Boilerplate — Шаблон расширения

Этот шаблон используется для создания **всех новых расширений** в системе «Щепки».
Он уже содержит подключение к Remote Config и аналитике GA4.

## Как создать новое расширение за 5 шагов

### Шаг 1: Скопируй эту папку
Скопируй папку `schepki-boilerplate` и переименуй её (например, `breathing-timer`).

### Шаг 2: Обнови manifest.json
Замени в файле `manifest.json`:
- `EXTENSION_NAME` → название расширения (например, `Breathing Timer - Calm Focus`)
- `EXTENSION_DESCRIPTION` → описание (1-2 предложения)

### Шаг 3: Обнови popup.js
В файле `popup.js` замени:
- `REPLACE_WITH_EXTENSION_ID` → ID расширения из `config.json` (например, `breathing_timer`)

### Шаг 4: Добавь расширение в config.json
В репозитории `schepki-config` открой `config.json` и добавь блок для нового расширения в раздел `"extensions"`.

### Шаг 5: Напиши логику расширения
В `popup.js` в разделе `// YOUR EXTENSION LOGIC HERE` напиши код своего расширения.
В `popup.html` добавь свой интерфейс в блок `<div id="main-content">`.

## Файлы шаблона

| Файл | Что делает |
|---|---|
| `manifest.json` | Описание расширения для Chrome |
| `popup.html` | Интерфейс (то, что видит пользователь) |
| `popup.css` | Стили интерфейса |
| `popup.js` | Логика расширения |
| `analytics.js` | Модуль аналитики GA4 (не трогать) |
| `remote-config.js` | Модуль Remote Config (не трогать) |
| `icons/` | Иконки расширения (16x16, 48x48, 128x128) |

## Ключевые ссылки

- **Remote Config:** https://github.com/nikol-dev-tools/schepki-config/blob/main/config.json
- **Privacy Policy:** https://nikol-dev-tools.github.io/schepki-config/privacy.html
- **GA4 Measurement ID:** G-3ZKRBK0TBV
