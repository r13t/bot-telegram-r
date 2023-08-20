const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = '6671244143:AAHflfX9Y_eLWJi1qXiVKCkqjOsydfdUS_U'; // استبدله بتوكن البوت الخاص بك
const bot = new TelegramBot(token, { polling: true });

let accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));

// رسالة الترحيب والزرين
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name; // اسم المستخدم

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'كود جديد 🎟️',
                        callback_data: 'show_support_message2'
                    }
                ],
                [
                    {
                        text: 'تواصل مع فريق الدعم 📮',
                        callback_data: 'show_support_message'
                    }
                ]
            ]
        }
    };

    const welcomeMessage = `اهلاً وسهلاً ${userName}، في متجر STOR 🎮، ادخل الكود الذي حصلت عليه من صاحب المتجر لمتابعة الشراء.`;

    bot.sendMessage(chatId, welcomeMessage, options);
});

// ردود الاستجابة على الأزرار
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'show_support_message2') {
        bot.sendMessage(chatId, `اطلب الكود من هنا ⬅️ @r1_7t`);
    } else if (data === 'show_support_message') {
        const supportMessage = `صاحب المتجر - @r1_7t
قناة المتجر - https://t.me/spider7code

تواصل معنا ، سنرد عليك باقرب وقت ممكن 🤍`;

        bot.sendMessage(chatId, supportMessage);
    }
});

// رد على الكود المدخل وإظهار المعلومات
bot.onText(/^(?!\/start)(?!\/buy)(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userInput = match[1];

    const account = accounts.find(acc => acc.code === userInput);

    if (account) {
        const accountInfo = account.asss[0];
        const purchaseMessage = `تمت عملية الشراء بنجاح 🤝.\n\nالحساب: ${accountInfo.username}\nالباسورد: ${accountInfo.password}\n\nالبائع: @r1_7t\nالمشتري: ${msg.from.username} | ${msg.from.first_name}\n\nنوع الحساب: ${accountInfo.info}`;

        bot.sendMessage(chatId, purchaseMessage);

        // حذف الحساب المباع من المصفوفة
        accounts = accounts.filter(acc => acc.asss[0].username !== userInput);
        fs.writeFileSync('accounts.json', JSON.stringify(accounts, null, 4));
    } else {
        const errorMessage = 'الرمز غير صحيح';
        bot.sendMessage(chatId, errorMessage);
    }
});