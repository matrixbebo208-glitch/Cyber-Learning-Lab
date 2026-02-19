// --- 1. الإعدادات والربط (بياناتك الحقيقية) ---
const SUPABASE_URL = 'https://datbgyhlzgxpmavqzuvj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdGJneWhsemd4cG1hdnF6dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzU2NzAsImV4cCI6MjA4NzExMTY3MH0._WtcwRY1_33domEA8ZxCc05NGbcReOz-JkfOQifEEMg';
const ADMIN_BOT_TOKEN = "8584857850:AAG9WWu_9nPWbY291ES3RhrNMndCNQcTWWo";
const MY_CHAT_ID = "8593574557";

// بدء اتصال Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. نظام الدخول وتوليد الـ ID ---
function generateUserId() {
    const name = document.getElementById('user-name').value.trim();
    if (name.length < 3) {
        alert("يرجى إدخال اسمك الحقيقي (3 حروف على الأقل)");
        return;
    }

    // توليد ID فريد وحفظه في المتصفح
    const userId = "MX-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('m_id', userId);
    localStorage.setItem('m_name', name);

    showActivationScreen(name, userId);
}

function showActivationScreen(name, id) {
    document.getElementById('auth-content').innerHTML = `
        <h5 class="text-success small mb-3">مرحباً ${name}</h5>
        <div class="p-2 border border-info mb-3 bg-black">
            <span class="text-secondary small d-block">ID حسابك (اضغط للنسخ):</span>
            <strong id="u-id" style="cursor:pointer; color: #00ff41;" onclick="copyId()">${id}</strong>
        </div>
        <p class="small text-muted">اطلب كود التفعيل من البوت بـ 35ج</p>
        <button onclick="window.open('https://t.me/Matrix_Admin_Arish_Bot')" class="btn btn-warning btn-sm w-100 mb-2">طلب التفعيل عبر تليجرام</button>
        <input type="text" id="activation-key" class="form-control mb-2 text-center" placeholder="أدخل كود التفعيل">
        <button onclick="verifyKey('${id}')" class="btn btn-success w-100">تشغيل النظام</button>
    `;
}

// --- 3. التحقق من الكود من قاعدة البيانات ---
async function verifyKey(userId) {
    const key = document.getElementById('activation-key').value.trim();
    
    // البحث في جدول keys عن الكود والـ ID المطابق
    const { data, error } = await _supabase
        .from('keys')
        .select('*')
        .eq('code', key)
        .eq('assigned_to', userId)
        .single();

    if (data) {
        localStorage.setItem('m_auth', 'true');
        notifyAdmin(`✅ الطالب ${localStorage.getItem('m_name')} قام بتفعيل حسابه بنجاح!`);
        enterPlatform();
    } else {
        alert("الكود غير صحيح أو لا يخص هذا الـ ID. تأكد من الإدارة.");
    }
}

// --- 4. نظام الشات وتنبيهات تليجرام ---
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    const user = localStorage.getItem('m_name');
    const id = localStorage.getItem('m_id');

    if (msg) {
        // حفظ الرسالة في Supabase
        const { error } = await _supabase.from('chat').insert([{ user_name: user, message: msg }]);
        
        if (!error) {
            // إرسال تنبيه فوري لبوت الإدارة بتاعك
            const tgMsg = `💬 رسالة شات جديدة:\n👤 ${user} (${id})\n✉️ ${msg}`;
            fetch(`https://api.telegram.org/bot${ADMIN_BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${encodeURIComponent(tgMsg)}`);
            input.value = '';
        }
    }
}

// الاستماع للرسائل الجديدة فوراً (Real-time)
_supabase
    .channel('public:chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, payload => {
        renderChatMessage(payload.new);
    })
    .subscribe();

function renderChatMessage(data) {
    const chatBox = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "mb-2 p-1 border-bottom border-secondary animate-in";
    msgDiv.innerHTML = `<strong class="text-info">${data.user_name}:</strong> <span class="text-white">${data.message}</span>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 5. تشغيل المنصة وعرض المحتوى ---
function enterPlatform() {
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('main-platform').classList.remove('d-none');
    document.getElementById('display-name').innerText = localStorage.getItem('m_name');
    loadCourses();
}

async function loadCourses() {
    const { data: courses, error } = await _supabase.from('courses').select('*');
    const list = document.getElementById('courses-list');
    list.innerHTML = "";
    
    if (courses) {
        courses.forEach(course => {
            const btn = document.createElement('button');
            btn.className = "list-group-item list-group-item-action text-end bg-dark text-success border-success mb-2";
            btn.innerHTML = `📁 ${course.title}`;
            btn.onclick = () => openCourse(course);
            list.appendChild(btn);
        });
    }
}

function openCourse(course) {
    document.getElementById('course-viewer').classList.remove('d-none');
    document.getElementById('view-title').innerText = course.title;
    document.getElementById('view-desc').innerText = course.description;
    // تحويل رابط يوتيوب لرابط Embed للتشغيل داخل الموقع
    const vidId = course.video_url;
    document.getElementById('main-video').src = `https://www.youtube-nocookie.com/embed/${vidId}?rel=0&showinfo=0`;
}

// --- وظائف مساعدة ---
function copyId() {
    const id = document.getElementById('u-id').innerText;
    navigator.clipboard.writeText(id);
    alert("تم نسخ الـ ID بنجاح");
}

async function notifyAdmin(msg) {
    fetch(`https://api.telegram.org/bot${ADMIN_BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${encodeURIComponent(msg)}`);
}

function terminateSession() {
    if(confirm("هل تريد الخروج؟ ستحتاج لكود التفعيل مرة أخرى.")) {
        localStorage.clear();
        location.reload();
    }
}

// فحص الجلسة عند فتح الصفحة
window.onload = () => {
    if (localStorage.getItem('m_auth') === 'true') {
        enterPlatform();
    }
};
