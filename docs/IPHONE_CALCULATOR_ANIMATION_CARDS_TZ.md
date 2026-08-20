# Карточки анимаций универсального 3D-калькулятора

Краткая актуальная спецификация оставшихся symptom ID. Видимые zone rings запрещены во всех карточках.

| Категория | Симптомы | Камера | Главный визуальный признак |
|---|---|---|---|
| `display` | `cracks-works`, `glass-only`, `black-sound`, `stripes`, `partial`, `no-touch`, `ghost`, `shattered` | `frontDisplay` | OLED-трещины, матрица, сенсор или чёрный экран |
| `not-on` | `no-response`, `black-rings`, `logo-loop`, `reboot`, `after-drop`, `after-drain` | `frontDisplay` | мёртвый OLED, логотип, press/shake |
| `water` | `recent`, `unstable`, `dead-water`, `fog-camera`, `no-sound-water`, `no-charge-water` | 3/4, камера или порт | капли, конденсат, нестабильный/чёрный OLED |
| `battery-heat` | `drains`, `percent-off`, `swollen`, `heat-charge`, `heat-idle`, `heat-after` | 3/4 / rear | процент, щель OLED, локальное тепло |
| `charge` | `no-charge`, `angle`, `drops`, `slow` | `bottomPort` | контакт USB-C, наклон, badge |
| `buttons` | `power`, `volume`, `mute` | боковые пресеты | физический proxy-ход детали |
| `camera-face` | `rear`, `front`, `focus`, `lens-glass`, `face-id` | rear/front | preview, jitter, линза, Face ID |
| `audio` | `earpiece`, `speaker` | верх OLED / низ | короткие незамкнутые дуги |
| `body` | `back-glass`, `bent`, `scratched`, `camera-glass-body`, `screen-gap` | rear / 3/4 | surface map, vertex bend, физическая щель |
| `other` | `network`, `lag`, `after-update`, `pc`, `data`, `custom` | 3/4 / порт | нейтральная экранная история |

## Timing

- Camera transition: 700–1000 мс.
- Button press: 120–180 мс с полным возвратом.
- Focus jitter: 350–450 мс, затем пауза 1,4–1,8 с.
- Face ID dots: до 600 мс, затем полное исчезновение.
- Sound arcs: 2–3 коротких импульса opacity 0,08–0,14.
- Reduced motion: без циклов, статичный финальный кадр.

## Surface FX

### Задняя крышка

- Две совмещённые плоскости: базовые трещины и additive highlight.
- Highlight усиливается при скользящем угле камеры.
- Depth test и polygon offset обязательны.

### Погнутый корпус

- Все исходные mesh переводятся в общие phone-space координаты.
- Параболический прогиб применяется согласованно ко всем сохранённым вершинам.
- Пересчёт выполняется один раз при входе и один раз при выходе из симптома.
- Нельзя заменять изгиб глобальным roll телефона или тёмной полосой.

### Царапины

- Несколько групп тонких кривых разной длины.
- Opacity зависит от угла камеры.
- Camera island и выступающие детали должны физически перекрывать слой.

### Экран отошёл

- Смещение наружу по `glassOut` около 1 мм.
- Одна длинная тёмная щель и слабый тёплый блик.
- Полные окружности, овалы и пульсирующие рамки отсутствуют.

## Техническая приёмка

- Удалённые symptom ID отсутствуют в каталоге и viewer.
- Переключение симптомов не оставляет старых FX.
- Визуальные полные кольца отсутствуют на desktop и mobile.
- Console errors = 0.
- Цели производительности: desktop ≥ 50 FPS, mobile ≥ 30 FPS.
