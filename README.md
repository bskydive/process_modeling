# Моделирование процессов

## Что это?

 * репозиторий для моделирования процессов разработки ПО
 * Проект инструмента моделирования
 * Разбор книг, текстов, докладов про моделирование
 * реальные данные для анализа задач/кода
 * TODO скрипты черновые, не всё работает

## Что тут есть?

 * [тут](./utils/freeplane/freeplane.sh) портативный рисователь нейросхем [freeplane](https://www.freeplane.org/), потомок почившего freemind, версия 1.11.1
 * рисователь мнемосхем пропатчен, увеличена память для экспорта картинок `JAVA_OPTS="-Xmx1000g $JAVA_OPTS"`
 * [тут](./doc/README.md) документация этапа проектирования
 * [тут](./tokens/) bash скрипты с ENV VARIABLES и токенами для cloud api
 * [тут](./doc/assets/) схемы и сырые данные для cloud api

## Для кого?

 * тимлидов, разработчиков

## Как пользоваться?

 * нейросхемы смотреть через freemind, он кроссплатформенный на java
 * md смотреть любым текстовым редактором или через IDE
 * [CHANGELOG](https://t.me/stepanovv_ru_kb)
 * запуск парсера 
	```bash
		# ставим nvm
		nvm i 20
		npm i
		npm run start
	```

### TODO Анализ issues vscode

 * надежда на любовь M$ к github питает вероятность качественных данных
 * смотрим бесплатно без смс
    * [закрытые задачки, которые ушли в релиз](https://github.com/microsoft/vscode/issues?q=is:issue+is:closed+reason:completed+label:insiders-released)
    * [закрытые PR](https://github.com/microsoft/vscode/pulls?q=is:pr+is:merged&page=1)
 * [смотрим скрипты плагином](./assets/github.api.http)
    * [делаем токен тут](https://github.com/settings/tokens?type=beta)
    * [ставим плагин humao.rest-client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) для vscode
    * запихиваем токен в vscode settings.json
        ```bash
            "rest-client.environmentVariables": {
                "$shared": {
                    "gh-api-token": "SOMETOKEN"
                }
            }
        ```
    * [запихиваем токен в ENV VAR](./tokens/.gh-api-token.sh)

        ```bash
            #!/bin/bash
            export gh_api_token="SOMETOKEN"
        ```

## Как связаться с автором?

 * https://t.me/stepanovv_ru
