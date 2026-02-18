// --- إعدادات النظام الأساسية ---
let currentStep = 0;
let lessons = [];

// ⚠️ ضع بياناتك هنا (بين علامات التنصيص)
const TG_TOKEN = "8584857850:AAG9WWu_9nPWbY291ES3RhrNMndCNQcTWWo"; 
const TG_CHAT_ID = "8593574557";

// 1. جلب الدروس من ملف الـ JSON
fetch('lessons.json')
    .then(res => res.json())
    .then(data => {
        lessons = data.all_lessons;
        updateTerminal(`[System]: تم تحميل ${lessons.length} تحديات بنجاح. ابدأ الحل!`);
        showQuestion();
    })
    .catch(err => updateTerminal("[Error]: فشل في تحميل قاعدة البيانات."));

// 2. دالة عرض السؤال الحالي
function showQuestion() {
    const q = lessons[currentStep];
    updateTerminal(`<br><span class="text-warning">[تحدي ${q.category}]: ${q.question}</span>`);
}

// 3. دالة فحص الإجابة
function checkAnswer() {
    const inputField = document.getElementById('user-input');
    const answer = inputField.value.trim();
    const q = lessons[currentStep];

    if (answer.toLowerCase() === q.expected.toLowerCase()) {
        updateTerminal(`<br><span class="text-info">> ${answer}</span>`);
        updateTerminal(`<br><span class="text-success">✅ أحسنت! ${q.success}</span>`);
        
        unlockTab(q.category); // فتح التبويبة الخاصة باللغة
        
        currentStep++;
        if (currentStep < lessons.length) {
            setTimeout(showQuestion, 1000);
        } else {
            updateTerminal("<br><span class='text-primary'>🏆 مبروك! لقد أتممت جميع التحديات المتاحة حالياً.</span>");
        }
    } else {
        updateTerminal(`<br><span class="text-info">> ${answer}</span>`);
        updateTerminal(`<br><span class="text-danger">❌ إجابة خاطئة. استخدم أزرار المساعدة بالأسفل إذا تعثرت!</span>`);
    }
    inputField.value = "";
}

// 4. تنفيذ فكرتك (البحث المفلتر والذكي)
function getTheory() {
    const q = lessons[currentStep];
    const query = `${q.category} ${q.question} شرح نظري`;
    const filter = "site:w3schools.com OR site:geeksforgeeks.org OR site:mdn.io";
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query + " " + filter)}`, '_blank');
}

function getVideo() {
    const q = lessons[currentStep];
    const query = `شرح ${q.category} ${q.question}`;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
}

function autoFilterContent() {
    updateTerminal("<br><span class='text-warning'>🤖 جاري تحليل السؤال وجلب الخلاصة من الويب...</span>");
    setTimeout(getTheory, 1500);
}

// 5. ربط تلجرام (إرسال دروس المطورين)
function sendToTelegram() {
    const name = document.getElementById('dev-name').value;
    const lang = document.getElementById('dev-lang').value;
    const code = document.getElementById('dev-code').value;

    if (!name || !code) return alert("املا الخانات يا بطل!");

    const msg = `🚀 تحدي جديد من مطور!\n👤 الاسم: ${name}\n💻 التخصص: ${lang}\n📝 المحتوى: ${code}`;
    
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg })
    }).then(() => alert("وصلت الرسالة للمسؤول! شكراً لمساهمتك."));
}

// وظائف مساعدة
function updateTerminal(msg) {
    const out = document.getElementById('terminal-output');
    out.innerHTML += msg;
    out.scrollTop = out.scrollHeight;
}

function unlockTab(cat) {
    const id = `tab-${cat.toLowerCase()}`;
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('disabled');
        el.style.opacity = "1";
    }
}

