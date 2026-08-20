export const PROBLEM_TREE = [
  {
    key: 'display',
    title: 'Разбит дисплей',
    hint: 'Трещины, чёрный экран, сенсор',
    camera: 'frontDisplay',
    symptoms: [
      { id: 'cracks-works', label: 'Трещины, изображение работает', overlay: 'broken', overlayId: 'big-crack', intensity: 0.85, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] },
      { id: 'glass-only', label: 'Разбито только стекло, картинка и сенсор живы', overlay: 'broken', overlayId: 'hairline', intensity: 0.45, serviceCodes: ['screen-glass', 'display-oled', 'display-compatible', 'display-original'], preferGlass: true },
      { id: 'black-sound', label: 'Чёрный экран, звук или вибрация есть', overlay: 'off', overlayId: 'black-vibrate', intensity: 0.7, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] },
      { id: 'stripes', label: 'Полосы, пятна или мерцание', overlay: 'flicker', overlayId: 'stripes', intensity: 0.8, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] },
      { id: 'partial', label: 'Часть изображения пропала', overlay: 'flicker', overlayId: 'partial', intensity: 0.7, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] },
      { id: 'no-touch', label: 'Сенсор не нажимается', overlay: 'sensor', overlayId: 'no-touch', intensity: 1, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] },
      { id: 'ghost', label: 'Ложные нажатия', overlay: 'sensor', overlayId: 'ghost', intensity: 0.8, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] },
      { id: 'shattered', label: 'Стекло осыпается, пятна матрицы', overlay: 'broken', overlayId: 'shattered', intensity: 1, serviceCodes: ['display-oled', 'display-compatible', 'display-original'] }
    ]
  },
  {
    key: 'not-on',
    title: 'Не включается',
    hint: 'Мёртвый телефон, логотип, перезагрузки',
    camera: 'frontDisplay',
    symptoms: [
      { id: 'no-response', label: 'Нет реакции', overlay: 'off', overlayId: 'no-response', intensity: 1, priceMode: 'diagnostics' },
      { id: 'black-rings', label: 'Чёрный экран, но телефон звонит', overlay: 'off', overlayId: 'black-vibrate', intensity: 0.7, serviceCodes: ['display-oled', 'display-compatible', 'display-original'], note: 'Часто это дисплей. Ориентир — замена экрана после осмотра.' },
      { id: 'logo-loop', label: 'Зависает на логотипе', overlay: 'off', overlayId: 'logo-loop', intensity: 0.5, priceMode: 'diagnostics' },
      { id: 'reboot', label: 'Перезагружается', overlay: 'off', overlayId: 'logo-loop', intensity: 0.4, priceMode: 'diagnostics' },
      { id: 'after-drop', label: 'Выключился после удара', overlay: 'off', overlayId: 'after-drop', intensity: 0.35, priceMode: 'diagnostics' },
      { id: 'after-drain', label: 'Выключился после полного разряда', overlay: 'off', overlayId: 'no-response', intensity: 0.8, priceMode: 'diagnostics' }
    ]
  },
  {
    key: 'water',
    title: 'Была вода',
    hint: 'Намок, запотела камера, нестабильно работает',
    camera: 'defaultThreeQuarter',
    safety: 'Выключите телефон, не заряжайте и не сушите феном. Чем раньше вскрытие — тем выше шанс спасти плату.',
    symptoms: [
      { id: 'recent', label: 'Намок недавно', overlay: 'water', intensity: 0.6, priceMode: 'water' },
      { id: 'unstable', label: 'Включается, но работает нестабильно', overlay: 'water', intensity: 0.7, priceMode: 'water' },
      { id: 'dead-water', label: 'После воды не включается', overlay: 'off', overlayId: 'no-response', intensity: 1, priceMode: 'water' },
      { id: 'fog-camera', label: 'Запотела камера', overlay: 'water', intensity: 0.5, camera: 'rearCamera', priceMode: 'water' },
      { id: 'no-sound-water', label: 'Пропал звук или микрофон', overlay: 'water', intensity: 0.5, camera: 'bottomPort', priceMode: 'water' },
      { id: 'no-charge-water', label: 'Не заряжается после воды', overlay: 'water', intensity: 0.5, camera: 'bottomPort', priceMode: 'water' }
    ]
  },
  {
    key: 'battery-heat',
    title: 'Батарея и нагрев',
    hint: 'Садится, греется, вздулся аккумулятор',
    camera: 'defaultThreeQuarter',
    symptoms: [
      { id: 'drains', label: 'Быстро разряжается', overlay: 'heat', intensity: 0.4, serviceCodes: ['battery'] },
      { id: 'percent-off', label: 'Выключается на процентах', overlay: 'heat', intensity: 0.5, serviceCodes: ['battery'] },
      { id: 'swollen', label: 'Аккумулятор вздулся / экран приподнялся', overlay: 'heat', intensity: 0.8, serviceCodes: ['battery'], safety: 'Прекратите зарядку и не кладите телефон под подушку или в карман.' },
      { id: 'heat-charge', label: 'Греется при зарядке', overlay: 'heat', intensity: 0.6, priceMode: 'diagnostics', safety: 'Если корпус горячий — отключите зарядку.' },
      { id: 'heat-idle', label: 'Греется без нагрузки', overlay: 'heat', intensity: 0.55, camera: 'rearBody', priceMode: 'diagnostics' },
      { id: 'heat-after', label: 'Нагрев после воды или удара', overlay: 'heat', intensity: 0.7, priceMode: 'diagnostics' }
    ]
  },
  {
    key: 'charge',
    title: 'Не заряжается',
    hint: 'Разъём, кабель, нестабильный контакт',
    camera: 'bottomPort',
    highlight: 'port',
    symptoms: [
      { id: 'no-charge', label: 'Зарядки нет', overlay: 'none', intensity: 0.3, serviceCodes: ['charge-flex'] },
      { id: 'angle', label: 'Заряжается только под углом', overlay: 'none', intensity: 0.4, serviceCodes: ['charge-flex'] },
      { id: 'drops', label: 'Зарядка прерывается', overlay: 'none', intensity: 0.4, serviceCodes: ['charge-flex'] },
      { id: 'slow', label: 'Заряжается медленно', overlay: 'none', intensity: 0.3, priceMode: 'diagnostics' }
    ]
  },
  {
    key: 'buttons',
    title: 'Не работают кнопки',
    hint: 'Питание, громкость, беззвучный режим',
    camera: 'rightButton',
    symptoms: [
      { id: 'power', label: 'Кнопка питания', overlay: 'none', intensity: 0.3, camera: 'rightButton', highlight: 'power', serviceCodes: ['power-button', 'flex-other'] },
      { id: 'volume', label: 'Кнопки громкости', overlay: 'none', intensity: 0.3, camera: 'leftButtons', highlight: 'volume', serviceCodes: ['flex-other'] },
      { id: 'mute', label: 'Переключатель беззвучного режима / Action Button', overlay: 'none', intensity: 0.3, camera: 'leftButtons', highlight: 'volume', serviceCodes: ['flex-other'] }
    ]
  },
  {
    key: 'camera-face',
    title: 'Камера и Face ID',
    hint: 'Не снимает, стекло камеры, Face ID',
    camera: 'rearCamera',
    highlight: 'camera',
    symptoms: [
      { id: 'rear', label: 'Задняя камера не снимает', overlay: 'none', intensity: 0.4, serviceCodes: ['rear-camera'] },
      { id: 'front', label: 'Передняя камера', overlay: 'none', intensity: 0.4, camera: 'frontDisplay', serviceCodes: ['front-camera'] },
      { id: 'focus', label: 'Не фокусируется или трясётся', overlay: 'none', intensity: 0.4, serviceCodes: ['rear-camera'] },
      { id: 'lens-glass', label: 'Треснуло стекло камеры', overlay: 'none', intensity: 0.5, serviceCodes: ['camera-glass'] },
      { id: 'face-id', label: 'Не работает Face ID', overlay: 'none', intensity: 0.3, camera: 'frontDisplay', priceMode: 'diagnostics', note: 'Face ID проверяем после диагностики, без обещания заранее.' }
    ]
  },
  {
    key: 'audio',
    title: 'Звук и микрофон',
    hint: 'Разговорный и громкий динамик',
    camera: 'frontDisplay',
    symptoms: [
      { id: 'earpiece', label: 'Тихо слышно собеседника', overlay: 'none', intensity: 0.3, serviceCodes: ['earpiece'] },
      { id: 'speaker', label: 'Не работает громкий динамик', overlay: 'none', intensity: 0.3, camera: 'bottomPort', highlight: 'speaker', priceMode: 'diagnostics' }
    ]
  },
  {
    key: 'body',
    title: 'Корпус и крышка',
    hint: 'Скол, погнут, отошёл экран',
    camera: 'rearBody',
    highlight: 'body',
    symptoms: [
      { id: 'back-glass', label: 'Разбита задняя крышка', overlay: 'none', intensity: 0.5, serviceCodes: ['back-glass', 'body'] },
      { id: 'bent', label: 'Погнут корпус', overlay: 'none', intensity: 0.5, serviceCodes: ['body'] },
      { id: 'scratched', label: 'Корпус сильно поцарапан', overlay: 'none', intensity: 0.4, serviceCodes: ['body'] },
      { id: 'camera-glass-body', label: 'Разбито стекло камеры', overlay: 'none', intensity: 0.5, camera: 'rearCamera', highlight: 'camera', serviceCodes: ['camera-glass'] },
      { id: 'screen-gap', label: 'Экран отошёл от рамки', overlay: 'heat', intensity: 0.6, camera: 'frontDisplay', serviceCodes: ['battery'], safety: 'Часто так проявляется вздутая батарея. Прекратите зарядку.' }
    ]
  },
  {
    key: 'other',
    title: 'Другое',
    hint: 'Сеть, зависания, данные, своя проблема',
    camera: 'defaultThreeQuarter',
    commentRequired: true,
    symptoms: [
      { id: 'network', label: 'Связь, Wi-Fi или Bluetooth', overlay: 'none', intensity: 0.2, priceMode: 'diagnostics' },
      { id: 'lag', label: 'Зависает', overlay: 'none', intensity: 0.2, priceMode: 'diagnostics' },
      { id: 'after-update', label: 'Проблемы после обновления', overlay: 'none', intensity: 0.2, priceMode: 'diagnostics' },
      { id: 'pc', label: 'Не определяется компьютером', overlay: 'none', intensity: 0.2, camera: 'bottomPort', priceMode: 'diagnostics' },
      { id: 'data', label: 'Восстановление данных', overlay: 'none', intensity: 0.2, priceMode: 'diagnostics' },
      { id: 'custom', label: 'Другая проблема', overlay: 'none', intensity: 0.2, priceMode: 'diagnostics' }
    ]
  }
];
