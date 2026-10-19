# ЦПК

[![Deploy to GitHub Pages](https://github.com/osipenko-stanislav/navigator/actions/workflows/pages.yml/badge.svg)](https://github.com/osipenko-stanislav/navigator/actions/workflows/pages.yml)

Интерактивный прототип карьерного навигатора и учебного планировщика Центрального университета.

## Локальный запуск

```sh
python3 -m http.server 4173
```

После запуска откройте `http://localhost:4173/goals/`.

## Публикация

Каждый push в ветку `main` автоматически публикует статический сайт через GitHub Pages. Предыдущий интерфейс остается в корне сайта, а текущая версия публикуется из сохраненной в `main` статической копии `_site/v2/`. При обновлении `v2` нужно обновить эту копию в `main`, сохранив структуру файлов и статические страницы маршрутов. В настройках репозитория в разделе **Settings → Pages** источником публикации должен быть выбран **GitHub Actions**.

Текущая версия: <https://osipenko-stanislav.github.io/navigator/v2/>

Предыдущая версия: <https://osipenko-stanislav.github.io/navigator/>
