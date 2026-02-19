// --- إعدادات منصة ماتركس ---
const TG_TOKEN = "8584857850:AAG9WWu_9nPWbY291ES3RhrNMndCNQcTWWo";
const TG_CHAT_ID = "8593574557";

// قائمة المستخدمين المصرح لهم (اليوزر : الكود)
// يمكنك إضافة مستخدمين جدد هنا يدوياً أو تطويرها لاحقاً
let authorizedUsers = {
    "@admin": "MATRIX_ROOT",
    "@test_user": "M35_2026"
};

// --- نظام الدخول والحماية ---
function unlockPlatform() {
    const user = document.getElementById('user-tg').value.trim();
    const code = document.getElementById('activation-code').value.trim();

    if (authorizedUsers[user] && authorizedUsers[user] === code) {
        localStorage.setItem('matrix_auth', 'true');
        localStorage.setItem('matrix_user', user);
        
        // إخفاء شاشة القفل وإظهار المحتوى
        document.getElementById('lock-screen').style.display = 'none';
        
        sendTelegramAlert(`🔓 دخول ناجح:\nالمستخدم: ${user}\nالكود المستخدم: ${code}`);
        bootSystem(user);
    } else {
        alert("❌ بيانات التفعيل غير مطابقة! حول 35ج لـ 01224815487 وراسلنا بيوزرك.");
    }
}

// محاكاة تشغيل النظام
function bootSystem(user) {
    const out = document.getElementById('terminal-output');
    out.innerHTML = `<span class="text-info">[System]: جاري فك تشفير البيانات...</span><br>`;
    setTimeout(() => {
        out.innerHTML += `<span class="text-success">[System]: أهلاً بك يا ${user} في MATRIX OS.</span><br>`;
        out.innerHTML += `<span class="text-warning">[System]: استخدم القائمة الجانبية للتنقل.</span><br>`;
    }, 1000);
}

// --- تشغيل المختبر (Lab) ---
function runMatrixCode() {
    const code = document.getElementById('code-editor').value;
    const resultArea = document.getElementById('code-result');
    
    // إنشاء iframe لتشغيل الكود بأمان
    resultArea.innerHTML = `<iframe id='res-frame' style='width:100%; height:100%; border:none;'></iframe>`;
    const doc = document.getElementById('res-frame').contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
    
    sendTelegramAlert(`🧪 استخدام المختبر:\nالمستخدم: ${localStorage.getItem('matrix_user')}`);
}

// --- لوحة التحكم (الأدمن) ---
function showAdminPrompt() {
    const pass = prompt("أدخل كلمة سر الإدارة للوصول للمفاتيح:");
    if (pass === "01224815487") {
        const adminTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#content-admin"]'));
        adminTab.show();
    } else {
        alert("⚠️ وصول غير مصرح به! سيتم إبلاغ الإدارة.");
    }
}

// إضافة درس جديد (ديناميكي)
function addNewLesson() {
    const title = document.getElementById('admin-lesson-name').value;
    const vid = document.getElementById('admin-video-id').value;
    const theory = document.getElementById('admin-theory').value;

    if(title && vid) {
        // إظهار الفيديو في الواجهة الرئيسية
        document.getElementById('video-container').classList.remove('d-none');
        document.getElementById('main-player').src = `https://www.youtube.com/embed/${vid}`;
        document.getElementById('lesson-title').innerText = "🎬 " + title;
        
        document.getElementById('terminal-output').innerHTML += `<br><span class="text-info">[New Lesson]: تم تحميل قسم ${title} بنجاح.</span><br>`;
        alert("تم نشر المحتوى الجديد في المنصة!");
    }
}

// --- إرسال التنبيهات للتليجرام ---
function sendTelegramAlert(msg) {
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(msg)}`);
}

// فحص الجلسة عند فتح الموقع
window.onload = () => {
    if (localStorage.getItem('matrix_auth') === 'true') {
        document.getElementById('lock-screen').style.display = 'none';
        bootSystem(localStorage.getItem('matrix_user'));
    }
};
