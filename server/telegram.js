/**
 * Telegram Bot notification handler for OPTOM elektro orders
 * Includes automatic retry, HTML escaping, and plain-text fallback
 * so that messages NEVER fail to deliver.
 */

const FALLBACK_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8954426665:AAHJc94iLVpctZ0mPJfcSWqkCg4ejMSidl8';
const FALLBACK_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8038275900';

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateString(str, maxLength = 3900) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - 80) + '\n\n⚠️ <i>... [Xabar uzunligi tufayli qisqartirildi. To\'liq ma\'lumot admin panelda]</i>';
}

function buildHtmlMessage(order) {
  const items = order.items || [];
  const itemsList = items.map((item, idx) => {
    const priceFormatted = Number(item.price || 0).toLocaleString('uz-UZ');
    const totalFormatted = Number(item.total || (item.price * item.quantity)).toLocaleString('uz-UZ');
    const unit = escapeHtml(item.unit || 'dona');
    const itemName = escapeHtml(item.name || 'Nomsiz mahsulot');
    return `<b>${idx + 1}. ${itemName}</b>\n    └ ${item.quantity} ${unit} × ${priceFormatted} = <b>${totalFormatted} so'm</b>`;
  }).join('\n\n');

  const deliveryMap = {
    yetkazib_berish: '🚚 Yetkazib berish (Toshkent / Viloyat)',
    olib_ketish: "🏢 Do'kondan olib ketish (O'rikzor bozor)"
  };

  const paymentMap = {
    naqd: '💵 Naqd pul (Qabul qilinganda)',
    karta: '💳 Plastik karta (Click / Payme)',
    hisob_raqam: '🏛️ Bank hisob raqami (Optom schet-faktura)'
  };

  const deliveryText = deliveryMap[order.deliveryMethod] || escapeHtml(order.deliveryMethod || 'Yetkazib berish');
  const paymentText = paymentMap[order.paymentMethod] || escapeHtml(order.paymentMethod || 'Naqd');
  const dateFormatted = new Date(order.createdAt || Date.now()).toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const notesBlock = order.notes ? `📝 <b>Izoh:</b> <i>${escapeHtml(order.notes)}</i>\n` : '';

  const rawMessage = `
⚡ <b>YANGI BUYURTMA #${escapeHtml(order.id)}</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${escapeHtml(order.customerName || 'Mijoz')}
📞 <b>Telefon:</b> <code>${escapeHtml(order.phone || 'Kiritilmagan')}</code>
📍 <b>Manzil:</b> ${escapeHtml(order.city || 'Toshkent')}, ${escapeHtml(order.address || "Ko'rsatilmagan")}
🚚 <b>Yetkazish:</b> ${deliveryText}
💳 <b>To'lov:</b> ${paymentText}
${notesBlock}📦 <b>MAHSULOTLAR RO'YXATI:</b>
${itemsList || "Mahsulotlar mavjud emas"}

━━━━━━━━━━━━━━━━━━━━━━
💰 <b>JAMI SUMMA:</b> <b>${Number(order.totalAmount || 0).toLocaleString('uz-UZ')} so'm</b>
🕒 <b>Vaqt:</b> ${dateFormatted}
━━━━━━━━━━━━━━━━━━━━━━
<i>🤖 OPTOM elektro tizimidan avtomatik xabar</i>
  `.trim();

  return truncateString(rawMessage);
}

function buildPlainTextMessage(order) {
  const items = order.items || [];
  const itemsList = items.map((item, idx) => {
    const priceFormatted = Number(item.price || 0).toLocaleString('uz-UZ');
    const totalFormatted = Number(item.total || (item.price * item.quantity)).toLocaleString('uz-UZ');
    const unit = item.unit || 'dona';
    const itemName = item.name || 'Nomsiz mahsulot';
    return `${idx + 1}. ${itemName}\n   └ ${item.quantity} ${unit} x ${priceFormatted} = ${totalFormatted} so'm`;
  }).join('\n\n');

  const deliveryMap = {
    yetkazib_berish: 'Yetkazib berish (Toshkent / Viloyat)',
    olib_ketish: "Do'kondan olib ketish (O'rikzor bozor)"
  };

  const paymentMap = {
    naqd: 'Naqd pul (Qabul qilinganda)',
    karta: 'Plastik karta (Click / Payme)',
    hisob_raqam: 'Bank hisob raqami (Optom schet-faktura)'
  };

  const deliveryText = deliveryMap[order.deliveryMethod] || order.deliveryMethod || 'Yetkazib berish';
  const paymentText = paymentMap[order.paymentMethod] || order.paymentMethod || 'Naqd';
  const dateFormatted = new Date(order.createdAt || Date.now()).toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const notesBlock = order.notes ? `Izoh: ${order.notes}\n` : '';

  const rawMessage = `
⚡ YANGI BUYURTMA #${order.id}
----------------------------------------
Mijoz: ${order.customerName || 'Mijoz'}
Telefon: ${order.phone || 'Kiritilmagan'}
Manzil: ${order.city || 'Toshkent'}, ${order.address || "Ko'rsatilmagan"}
Yetkazish: ${deliveryText}
To'lov: ${paymentText}
${notesBlock}MAHSULOTLAR RO'YXATI:
${itemsList || "Mahsulotlar mavjud emas"}

----------------------------------------
JAMI SUMMA: ${Number(order.totalAmount || 0).toLocaleString('uz-UZ')} so'm
Vaqt: ${dateFormatted}
----------------------------------------
OPTOM elektro tizimidan avtomatik xabar
  `.trim();

  if (rawMessage.length > 3900) {
    return rawMessage.slice(0, 3800) + '\n\n... (Xabar uzunligi tufayli qisqartirildi, admin panelda ko\'ring)';
  }
  return rawMessage;
}

/**
 * Raw sender to Telegram API with timeout
 */
async function sendRawTelegramMessage(token, chatId, text, parseMode = null) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: text
  };
  if (parseMode) {
    body.parse_mode = parseMode;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timer);
    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Sends order notification to one or multiple chat IDs with retry and plain text fallback.
 */
async function sendTelegramOrderNotification(order, settings = {}) {
  const token = (settings && settings.telegramBotToken && settings.telegramBotToken.trim()) ||
                process.env.TELEGRAM_BOT_TOKEN ||
                FALLBACK_BOT_TOKEN;

  const rawChatId = (settings && settings.telegramChatId && String(settings.telegramChatId).trim()) ||
                    process.env.TELEGRAM_CHAT_ID ||
                    FALLBACK_CHAT_ID;

  if (!token || !rawChatId) {
    console.warn('[Telegram Bot] Bot Token yoki Chat ID mavjud emas. Buyurtma telegramga yuborilmadi.');
    return {
      success: false,
      skipped: true,
      reason: 'Bot Token yoki Chat ID sozlanmagan'
    };
  }

  // Split multiple chat IDs if separated by comma/semicolon/space
  const chatIds = String(rawChatId)
    .split(/[,;\s]+/)
    .map(id => id.trim())
    .filter(Boolean);

  if (chatIds.length === 0) {
    return { success: false, skipped: true, reason: 'Yaroqli Chat ID topilmadi' };
  }

  const htmlText = buildHtmlMessage(order);
  const plainText = buildPlainTextMessage(order);

  const deliveryReport = [];

  for (const chatId of chatIds) {
    let delivered = false;
    let lastError = null;

    // 1. First Attempt: Send with HTML parse mode
    for (let attempt = 1; attempt <= 2 && !delivered; attempt++) {
      try {
        const data = await sendRawTelegramMessage(token, chatId, htmlText, 'HTML');
        if (data && data.ok) {
          delivered = true;
          console.log(`[Telegram Bot] #${order.id} buyurtmasi HTML formatida yuborildi (${chatId})`);
          deliveryReport.push({ chatId, ok: true, format: 'HTML', messageId: data.result?.message_id });
          break;
        } else {
          lastError = data?.description || 'Noma\'lum xatolik';
          console.warn(`[Telegram Bot] HTML yuborishda xatolik (urinish ${attempt}, chat ${chatId}): ${lastError}`);
          // If entity parse error, break immediately to plain text
          if (lastError.toLowerCase().includes('entity') || lastError.toLowerCase().includes('parse')) {
            break;
          }
          await new Promise(r => setTimeout(r, 600));
        }
      } catch (networkErr) {
        lastError = networkErr.message;
        console.warn(`[Telegram Bot] Tarmoq xatosi (urinish ${attempt}, chat ${chatId}): ${networkErr.message}`);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    // 2. Fallback Attempt: Send as Plain Text if HTML failed
    if (!delivered) {
      console.log(`[Telegram Bot] #${order.id} buyurtmasi Plain Text rejimida qayta yuborilmoqda (${chatId})...`);
      for (let attempt = 1; attempt <= 2 && !delivered; attempt++) {
        try {
          const data = await sendRawTelegramMessage(token, chatId, plainText, null);
          if (data && data.ok) {
            delivered = true;
            console.log(`[Telegram Bot] #${order.id} buyurtmasi Plain Text formatida muvaffaqiyatli yuborildi (${chatId})`);
            deliveryReport.push({ chatId, ok: true, format: 'PLAIN_TEXT', messageId: data.result?.message_id });
            break;
          } else {
            lastError = data?.description || 'Plain text xatolik';
            await new Promise(r => setTimeout(r, 600));
          }
        } catch (networkErr) {
          lastError = networkErr.message;
          await new Promise(r => setTimeout(r, 800));
        }
      }
    }

    if (!delivered) {
      console.error(`[Telegram Bot] #${order.id} buyurtmasini (${chatId}) chatiga yuborib bo'lmadi: ${lastError}`);
      deliveryReport.push({ chatId, ok: false, error: lastError });
    }
  }

  const anySuccess = deliveryReport.some(r => r.ok);
  return {
    success: anySuccess,
    report: deliveryReport
  };
}

/**
 * Sends a test message to verify the bot and chat ID
 */
async function sendTestMessage(token, chatId) {
  const effectiveToken = (token && token.trim()) || FALLBACK_BOT_TOKEN;
  const effectiveChatId = (chatId && String(chatId).trim()) || FALLBACK_CHAT_ID;

  if (!effectiveToken || !effectiveChatId) {
    return { success: false, error: 'Token va Chat ID talab qilinadi!' };
  }

  const timeStr = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  const htmlText = `
⚡ <b>OPTOM ELEKTRO: TEST XABARI</b>
━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Aloqa muvaffaqiyatli o'rnatildi!</b>
🕒 <b>Vaqt:</b> ${timeStr}

Saytda yangi buyurtma tushganda barcha ma'lumotlar avtomatik tarzda ushbu chatga keladi.
━━━━━━━━━━━━━━━━━━━━━━
<i>OPTOM elektro tizimi</i>
  `.trim();

  const plainText = `
OPTOM ELEKTRO: TEST XABARI
----------------------------------------
Aloqa muvaffaqiyatli o'rnatildi!
Vaqt: ${timeStr}

Saytda yangi buyurtma tushganda barcha ma'lumotlar ushbu chatga keladi.
----------------------------------------
OPTOM elektro tizimi
  `.trim();

  try {
    const data = await sendRawTelegramMessage(effectiveToken, effectiveChatId, htmlText, 'HTML');
    if (data.ok) {
      return { success: true, message: 'Test xabari Telegramingizga yuborildi!' };
    }

    // Try fallback
    const plainData = await sendRawTelegramMessage(effectiveToken, effectiveChatId, plainText, null);
    if (plainData.ok) {
      return { success: true, message: 'Test xabari muvaffaqiyatli yetkazildi (oddiy matn formatida)!' };
    }

    return { success: false, error: data.description || plainData.description || 'Xatolik yuz berdi' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendTelegramOrderNotification,
  sendTestMessage,
  escapeHtml,
  FALLBACK_BOT_TOKEN,
  FALLBACK_CHAT_ID
};
