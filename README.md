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
- Разная стилизация для `Popup` на мобильных устройствах и десктопах
- Кеширование запросов к API через Service Worker
- Компонент `TextArea`, поддерживающий выделение команд. Ведет себя как простой ввод текста.

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