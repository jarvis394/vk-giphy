# vk-giphy

Тестовое задание для направления Фронтенд Веб-мессенджер в ВК

## Используемые технологии

- React + все, что идет с CRA
- Redux + immer
- TypeScript
- Emotion
- Axios
- react-intersection-observer-hook

## Реализованные фичи

- Все, что требовалось в задании (поиск, отправка сообщений)
- Обновленный дизайн по вкусу 😳
- Экраны в `GifPopup` для ошибки ввода, ошибки сети, начального состояния.
- Анимация показа/скрытия у `Popup`
- Бесконечный скролл в `GifPopup`
- Поддержка выбора гифки через клавиатуру (WAI-ARIA practicies)
- Адаптивная стилизация для `Popup` на мобильных устройствах и десктопах
- Кеширование запросов к API через Service Worker
- Компонент `TextArea`, поддерживающий выделение команд. Ведет себя как простой ввод текста.

## Локальный запуск

1. Склонируйте репозиторий
    ```bash
    git clone https://github.com/jarvis394/vk-giphy.git
    ```
2. Установите зависимости
    ```bash
    npm install
    ```
3. Вставьте токен GIPHY API в файл `.env`, как указано в `.env.template`
    ```bash
    touch .env
    echo REACT_APP_GIPHY_API_TOKEN=xxx > .env
    ```
4. Запустите проект
    ```bash
    npm run start
    ```

## Сценарии

### `npm start`

Запускает приложение

### `npm run build`

Билдит приложение. Для того, чтобы запустить собранное приложение, можно, например, установить утилиту `serve`:

```bash
npm i serve -g
serve -s build
```

### `npm run lint`

Производит линтинг и форматирование кода

## Дизайн

Figma: [тык](https://www.figma.com/file/0TS8WolgTbY1dgMomWYZKL/GIF-Picker-VK2022)

## Результат

Выложен на хостинг Vercel: [vk-giphy.vercel.app](https://vk-giphy.vercel.app)