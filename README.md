# OpenIP
ITMO DevDays F2024 - #104 OpenIP (Interview platform)

### MVP Open Interviw Platform

MVP решение состоит из 2 микросервисов - самой платформы, где отображается информация о пройденных интервью, фидбэках, возможности записаться на собеседование; и cервис совместного редактирования кода для проведения интервью (в наипростейшем его виде)

1) Platform

* Кабинеты hr / соискателя / интервьюера
* Страница кандидатов с их результатами - только для просмотра hr
* История прохождения собеседований / проведения секций для соискателей / интервьюеров
* Возможность интервьюеру создавать слоты для удобного времени проведения секции
* Возможность интервьюеру выставить оценку и... оставить фидбэк (soon)
* Возможность соискателю выбирать доступные слоты для записи

2) CodeShare

* Возможность совместного написания кода (синхронизация через вебсокет)
* Подсветка синтаксиса (Python, C++), изменение размера шрифта
* Поддержка множества комнат, те можно параллельно проводить несколько секций
* Поддержка и отображения множества пользователей (>2) в одной комнате
* Автоматическое закрытие комнаты, если не осталось пользователей в ней
* Приглашение в комнату по ссылке

Видео MVP доступно по ссылке: https://disk.yandex.ru/i/-1f0Dgyfg4S7Fg
Презентация проекта: https://drive.google.com/file/d/1aJxcAEacuZTimc1rDOPYBtqLlGwsUA2T/view?usp=drive_link

# dev

```docker compose watch```

# src

https://github.com/fastapi/full-stack-fastapi-template/tree/master
