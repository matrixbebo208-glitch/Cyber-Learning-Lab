// --- 1. إعدادات الربط المركزية ---
const SUPABASE_URL = 'https://datbgyhlzgxpmavqzuvj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdGJneWhsemd4cG1hdnF6dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzU2NzAsImV4cCI6MjA4NzExMTY3MH0._WtcwRY1_33domEA8ZxCc05NGbcReOz-JkfOQifEEMg';
const ADMIN_BOT_TOKEN = "8584857850:AAG9WWu_9nPWbY291ES3RhrNMndCNQcTWWo";
const MY_CHAT_ID = "8593574557"; 

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. نظام الدخول وتوليد الهوية ---
function generateUserId() {
    const name = document.getElementById('user-name').value.trim();
    if (name.length < 3) {
        alert("يرجى إدخال اسمك الحقيقي للدخول.");
        return;
    }
    const userId = "MX-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('m_id', userId);
    localStorage.setItem('m_name', name);
    
    // إرسال تنبيه فوري للأدمن
    notifyAdmin(`👤 محاولة دخول جديدة:\nالاسم: ${name}\nالأيدي: ${userId}`);
    showActivationScreen(name, userId);
}

function showActivationScreen(name, id) {
    document.getElementById('auth-content').innerHTML = `
        <h5 class="text-success small mb-3">مرحباً ${name}.. النظام بانتظار التفعيل</h5>
        <div class="p-2 border border-info mb-3 bg-black">
            <span class="text-secondary small d-block">ID حسابك (اضغط للنسخ):</span>
            <strong id="u-id" style="color: #00ff41; cursor:pointer;" onclick="navigator.clipboard.writeText('${id}'); alert('تم النسخ');">${id}</strong>
        </div>
        <button onclick="window.open('https://t.me/Matrix_Admin_Arish_Bot')" class="btn btn-warning btn-sm w-100 mb-2">طلب التفعيل عبر تليجرام</button>
        <input type="text" id="activation-key" class="form-control mb-2 text-center" placeholder="أدخل كود التفعيل">
        <button onclick="verifyKey('${id}')" class="btn btn-success w-100">تشغيل النظام</button>
    `;
}

// --- 3. التحقق من الكود عبر Supabase ---
async function verifyKey(userId) {
    const key = document.getElementById('activation-key').value.trim();
    const { data, error } = await _supabase
        .from('keys')
        .select('*')
        .eq('code', key)
        .eq('assigned_to', userId)
        .single();

    if (data) {
        localStorage.setItem('m_auth', 'true');
        notifyAdmin(`✅ الطالب ${localStorage.getItem('m_name')} قام بتفعيل النظام بنجاح!`);
        enterPlatform();
    } else {
        alert("فشل في التشفير: الكود غير صحيح أو غير مخصص لهذا الحساب.");
    }
}

// --- 4. لوحة الإدارة والتحكم ---
function adminAccess() {
    const password = prompt("أدخل كود الوصول للمدير:");
    if (password === "01224815487") {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('admin-panel').classList.remove('d-none');
    } else {
        alert("الوصول مرفوض.. محاولة اختراق مسجلة!");
    }
}

function exitAdmin() {
    document.getElementById('admin-panel').classList.add('d-none');
    document.getElementById('lock-screen').style.display = 'block';
}

// --- 5. وظائف المنصة والدروس ---
async function loadCourses() {
    const { data: courses, error } = await _supabase.from('courses').select('*');
    const list = document.getElementById('courses-list');
    list.innerHTML = "";

    if (courses) {
        courses.forEach(course => {
            const btn = document.createElement('button');
            btn.className = "list-group-item list-group-item-action";
            btn.innerHTML = `📁 ${course.title}`;
            btn.onclick = () => openCourse(course);
            list.appendChild(btn);
        });
    }
}

function openCourse(course) {
    document.getElementById('welcome-msg').classList.add('d-none');
    document.getElementById('course-viewer').classList.remove('d-none');
    document.getElementById('view-title').innerText = course.title;
    document.getElementById('view-desc').innerText = course.description;
    document.getElementById('main-video').src = `https://www.youtube.com/embed/${course.video_url}`;
}

async function publishNewCourse() {
    const title = document.getElementById('c-title').value;
    const vid = document.getElementById('c-vid').value;
    const desc = document.getElementById('c-desc').value;

    const { error } = await _supabase.from('courses').insert([{ title, video_url: vid, description: desc }]);
    if (!error) {
        alert("تم نشر الدرس بنجاح!");
        location.reload();
    }
}

// --- 6. وظائف عامة ---
function notifyAdmin(msg) {
    fetch(`https://api.telegram.org/bot${ADMIN_BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${encodeURIComponent(msg)}`);
}

function enterPlatform() {
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('main-platform').classList.remove('d-none');
    document.getElementById('display-name').innerText = localStorage.getItem('m_name');
    loadCourses();
}

function terminateSession() {
    localStorage.clear();
    location.reload();
}

window.onload = () => {
    if (localStorage.getItem('m_auth') === 'true') enterPlatform();
};
