/**
 * Telegram Bot notification handler for OPTOM elektro orders
 */

async function sendTelegramOrderNotification(order, settings) {
  const token = (settings && settings.telegramBotToken) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = (settings && settings.telegramChatId) || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[Telegram Bot] Bot Token yoki Chat ID kiritilmagan. Buyurtma telegramga yuborilmadi (lekin bazaga saqlandi).');
    return {
      success: false,
      skipped: true,
      reason: 'Bot Token yoki Chat ID sozlanmagan'
    };
  }

  try {
    const itemsList = (order.items || []).map((item, idx) => {
      const priceFormatted = Number(item.price || 0).toLocaleString('uz-UZ');
      const totalFormatted = Number(item.total || (item.price * item.quantity)).toLocaleString('uz-UZ');
      const unit = item.unit || 'dona';
      return `<b>${idx + 1}. ${escapeHtml(item.name)}</b>\n    └ ${item.quantity} ${unit} × ${priceFormatted} = <b>${totalFormatted} so'm</b>`;
    }).join('\n\n');

    const deliveryMap = {
      yetkazib_berish: '🚚 Yetkazib berish (Toshkent / Viloyat)',
      olib_ketish: '🏢 Do\'kondan olib ketish (O\'rikzor bozor)'
    };

    const paymentMap = {
      naqd: '💵 Naqd pul (Qabul qilinganda)',
      karta: '💳 Plastik karta (Click / Payme)',
      hisob_raqam: '🏛️ Bank hisob raqami (Optom schet-faktura)'
    };

    const deliveryText = deliveryMap[order.deliveryMethod] || order.deliveryMethod;
    const paymentText = paymentMap[order.paymentMethod] || order.paymentMethod;
    const dateFormatted = new Date(order.createdAt || Date.now()).toLocaleString('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const message = `
⚡ <b>YANGI BUYURTMA #${order.id}</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${escapeHtml(order.customerName)}
📞 <b>Telefon:</b> <code>${escapeHtml(order.phone)}</code>
📍 <b>Manzil:</b> ${escapeHtml(order.city || 'Toshkent')}, ${escapeHtml(order.address || 'Ko\'rsatilmagan')}
🚚 <b>Yetkazish:</b> ${deliveryText}
💳 <b>To'lov:</b> ${paymentText}
${order.notes ? `📝 <b>Izoh:</b> <i>${escapeHtml(order.notes)}</i>\n` : ''}
📦 <b>MAHSULOTLAR RO'YXATI:</b>
${itemsList || "Mahsulotlar mavjud emas"}

━━━━━━━━━━━━━━━━━━━━━━
💰 <b>JAMI SUMMA:</b> <b>${Number(order.totalAmount || 0).toLocaleString('uz-UZ')} so'm</b>
🕒 <b>Vaqt:</b> ${dateFormatted}
━━━━━━━━━━━━━━━━━━━━━━
<i>🤖 OPTOM elektro tizimidan avtomatik xabar</i>
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('[Telegram Bot API Error]:', data);
      return { success: false, error: data.description };
    }

    console.log(`[Telegram Bot] #${order.id} buyurtmasi muvaffaqiyatli Telegramga yuborildi!`);
    return { success: true, result: data.result };
  } catch (error) {
    console.error('[Telegram Bot Network Error]:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendTestMessage(token, chatId) {
  if (!token || !chatId) {
    return { success: false, error: 'Token va Chat ID talab qilinadi!' };
  }

  try {
    const text = `
⚡ <b>OPTOM ELEKTRO: TEST XABARI</b>
━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Tabriklaymiz!</b> Telegram Bot tizimi bilan aloqa muvaffaqiyatli o'rnatildi!
🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}

Endi saytda yangi buyurtma berilganda, barcha ma'lumotlar avtomatik tarzda ushbu chatga keladi.
━━━━━━━━━━━━━━━━━━━━━━
<i>OPTOM elektro Admin paneli</i>
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      return { success: false, error: data.description || 'Xatolik yuz berdi' };
    }
    return { success: true, message: 'Test xabari muvaffaqiyatli yuborildi!' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  sendTelegramOrderNotification,
  sendTestMessage
};

