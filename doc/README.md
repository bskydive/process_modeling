# Документация и аналитика

## план

 * [нейросхема](./%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D1%85%D0%B5%D0%BC%D1%8B/process_modeling.mm)
 * [нейросхема в картинках](./%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D1%85%D0%B5%D0%BC%D1%8B/process_modeling.jpg)
 * [нейросхема в картинках сжатая](./%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D1%85%D0%B5%D0%BC%D1%8B/process_modeling.small.jpg)
 * [сценарии](./%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D0%B8.md)
 * [excel таблицы Дорофеева](./%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%8B/%D0%A7%D0%B0%D1%81%D1%82%D1%8C%203.%20%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BB%D0%B4%D1%83%D0%BD%D1%81%D1%82%D0%B2%D0%BE.xlsx)
 * [оценка задач](./%D0%BE%D1%86%D0%B5%D0%BD%D0%BA%D0%B0%20%D0%B7%D0%B0%D0%B4%D0%B0%D1%87.md)
 * [разбор видео про техдолг](./%D1%82%D0%B5%D1%85%D0%B4%D0%BE%D0%BB%D0%B3.md)

## факт

 * аналитика [excel с графиками](../assets/vscode.github/vscode-analysis.github.ods)
 * подготовка данных csv
	* меню лист-->вставить лист из файла-->./log/curl-vscode-ISSUES-2023-06-07T15:09:22.994Z-PARSED.csv
	* вырезаем первые три столбца, удаляем первую строку
	* выделяем, делаем сводную таблицу: 
		* заменяем в столбце времени точки на запятые
		* меняем формат столбца времени на числовой, дробный
		* данные: durationHoursRawFloat
		* строки: assignee
		* столбцы: closed
		* столбцы итогов
		* ![](./сводная_таблица.jpg)
	* сортируем по времени
		* выделяем всё кроме первых двух строк
		* меню данные-->сортировка-->выбираем столбец с итогами(суммой)-->по убыванию
		* ![](./сортировка_выделение.jpg)
	* делаем график
		* TODO сделать линию, добавить нули вместо пустых ячеек
		* TODO добавить текст
		* ![](./диаграмма1.jpg)
 * [csv после парсинга](../assets/vscode.github/log.tar.gz)
	* issues, pulls
	* столбцы: 
		* дата закрытия
		* исполнитель
		* приведённое(дробное) время исполнения в часах
		* приведённое(человеко-читаемое) время исполнения(DD-HH-MM-SS)
		* url в облаке для подробностей
		* commit для pulls

## Ссылки

 * [моделирование и проектирование состояний системы, спецификаций(Alloy](https://habr.com/ru/company/yandex/blog/457810/)
 * [Максим Дорофеев — Эффективность неэффективности Встреча CodeFreeze в Москве, 10.07.2014](https://youtu.be/XDF02KmgJFE?list=PLm6zCN_KJCrX81iojL2lE2gHSbwnQE-QI&t=1560)
 * [Принцип экономии мыслетоплива / Максим Дорофеев (mnogosdelal.ru)](https://www.youtube.com/watch?v=fWR5SFhBUWc)
 * [Измерения в Scrum и Kanban: Шухарт, 6-сигма и люди снежинки с руками из жопы Дорофеев ](https://www.youtube.com/watch?v=VPDJXngp2bM)
 * [Несеребряные пули или кратко про методы софтостроения](https://habr.com/ru/post/546908/): нисходящий, восходящий, спиральный
 * https://toolshed.com/2015/05/the-failure-of-agile.html
 * [группа экспертов про научный подход к процессам - code review долго плохо дорого](https://www.youtube.com/watch?v=IDj3x__YZgE&list=PLFtS8Ah0wZvWS37oveJ0-D5K6V7GWUpqY&index=13)
 * [текстовый квест "симулятор тимлида"](https://habr.com/ru/companies/wrike/articles/679146/)
 * [инструмент для моделирования логики процессов - построил модель, посмотрел результат тысячи прогонов](https://cloud.anylogic.com/models)
 * [Три стадии оптимизации процессов - Перформанс: что в имени тебе моём? — Алексей Шипилёв об оптимизации в крупных проектах](https://habr.com/ru/companies/jugru/articles/338732/)
 * [Design Review и другие друзья разработчика, Дельгядо Филипп](https://www.youtube.com/watch?v=4Y0XJXRZv6k)
 * [Код ревью и парное программирование. Эффективность и гуманность ](https://music.yandex.com/album/13732143/track/112642653?dir=desc&activeTab=track-list)
 * https://www.litres.ru/daniel-kaneman/shum-nesovershenstvo-chelovecheskih-suzhdeniy/


