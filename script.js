// --- إعدادات نظام التلجرام (ضع بياناتك هنا) ---
const TG_TOKEN = "ضع_هنا_TOKEN_البوت_الخاص_بك"; 
const TG_CHAT_ID = "ضع_هنا_CHAT_ID_حسابك";

// --- نظام الدروس البسيط ---
let currentStep = 0;
const lessons = [
    {
        question: "[System]: أهلاً بك. لفتح أول تبويبة، اكتب وسم HTML الذي يصنع 'زر' (Button).",
        expected: "<button>",
        success: "أحسنت! تم فتح تبويبة HTML/CSS. انتقل للخطوة التالية."
    },
    {
        question: "[System]: في بايثون، ما هو الأمر الذي نستخدمه لاستدعاء مكتبة 'socket' للشبكات؟",
        expected: "import socket",
        success: "رائع! تبويبة بايثون والشبكات متاحة الآن."
    }
];

// دالة التحقق من الإجابة
function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim();
    const terminalOutput = document.getElementById('terminal-output');
    
    if (userInput.toLowerCase().includes(lessons[currentStep].expected.toLowerCase())) {
        terminalOutput.innerHTML += `<br><span class="text-info">> ${userInput}</span>`;
        terminalOutput.innerHTML += `<br><span class="text-success">${lessons[currentStep].success}</span>`;
        currentStep++;
        
        // عرض المهمة التالية إذا وجدت
        if (currentStep < lessons.length) {
            terminalOutput.innerHTML += `<br>${lessons[currentStep].question}`;
        } else {
            terminalOutput.innerHTML += `<br><span class="text-warning">[System]: تهانينا! لقد أنهيت جميع المهام الأساسية.</span>`;
        }
    } else {
        terminalOutput.innerHTML += `<br><span class="text-info">> ${userInput}</span>`;
        terminalOutput.innerHTML += `<br><span class="text-danger">[Error]: إجابة خاطئة، حاول مرة أخرى.</span>`;
    }
    document.getElementById('user-input').value = ""; // مسح الخانة
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // التمرير لأسفل
}

// --- دالة إرسال البيانات لتلجرام ---
function sendToTelegram() {
    const devName = document.getElementById('dev-name').value;
    const devLang = document.getElementById('dev-lang').value;
    const devCode = document.getElementById('dev-code').value;

    if (!devName || !devCode) {
        alert("برجاء ملء جميع الخانات!");
        return;
    }

    const message = `🚀 **طلب درس جديد**\n👤 المطور: ${devName}\n💻 اللغة: ${devLang}\n📝 الكود:\n\`${devCode}\``;

    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    })
    .then(res => {
        if(res.ok) alert("تم الإرسال لتلجرام المسؤول بنجاح!");
        else alert("خطأ في الإرسال، تأكد من إعدادات الـ Token.");
    })
    .catch(err => console.error("Telegram Error:", err));
}
