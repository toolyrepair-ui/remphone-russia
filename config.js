/* Контакты и отправка заявок rem-phone.ru
 * relayUrl — Cloudflare Worker, который пересылает заявку в Telegram владельцу.
 * Токен бота в коде сайта НЕ хранится.
 */
window.REMPHONE_CONFIG = {
    phoneTel: '+79144111730',
    phoneDisplay: '+7 914 411-17-30',
    whatsapp: '79144111730',
    telegramBot: 'REMPHONE_RUSSIA_Bot',
    email: 'toolyrepair@gmail.com',
    ownerTelegramId: '7553859784',
    relayUrl: 'https://rem-phone-relay.toolyrepair.workers.dev'
};
