// نظام تسجيل الدخول والتحكم - MATRIX
async function login() {
    const studentId = document.getElementById('student-id').value;
    const activationKey = document.getElementById('activation-key').value;
    const errorMsg = document.getElementById('login-error');

    // 1. الدخول السري للأدمن (يوسف)
    if (studentId === "ADMIN" && activationKey === MATRIX_CONFIG.SECRET_ADMIN_CODE) {
        showAdminPanel();
        return;
    }

    // 2. دخول الطلاب العاديين من قاعدة البيانات
    const { data, error } = await _supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .eq('activation_key', activationKey)
        .single();

    if (error || !data) {
        errorMsg.classList.remove('d-none');
        errorMsg.innerText = "بيانات غير صحيحة، تأكد من الـ ID وكود التفعيل";
    } else {
        localStorage.setItem('matrix_user', JSON.stringify(data));
        showPlatform(data);
    }
}

// فتح لوحة التحكم للأدمن فقط
function showAdminPanel() {
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('admin-section').classList.remove('d-none');
    alert("مرحباً يا يوسف.. نظام التحكم جاهز");
}

// عرض واجهة الطالب
function showPlatform(user) {
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('platform-section').classList.remove('d-none');
    document.getElementById('display-id').innerText = "ID: " + user.student_id;
    document.getElementById('user-balance').innerText = user.balance;
    loadCourses(); // تحميل الدروس اللي إنت ضفتها
}

// منع الخروج المفاجئ للحماية
window.onbeforeunload = function() {
    return "هل أنت متأكد من مغادرة المنصة؟";
};
