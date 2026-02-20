// --- وظائف لوحة التحكم (يوسف الأدمن) ---

// 1. وظيفة شحن الرصيد
async function addBalance() {
    const tID = document.getElementById('target-id').value;
    const amount = parseInt(document.getElementById('amount').value);

    if (!tID || !amount) return alert("دخل البيانات الأول");

    // جلب الرصيد الحالي للطالب
    const { data: student } = await _supabase
        .from('students')
        .select('balance')
        .eq('student_id', tID)
        .single();

    if (!student) return alert("الطالب ده مش موجود!");

    // تحديث الرصيد (القديم + الجديد)
    const newBalance = student.balance + amount;

    const { error } = await _supabase
        .from('students')
        .update({ balance: newBalance })
        .eq('student_id', tID);

    if (!error) {
        alert(`تم شحن ${amount} ج.م لـ ${tID} بنجاح!`);
        document.getElementById('amount').value = "";
    } else {
        alert("حصل مشكلة في الشحن!");
    }
}

// 2. وظيفة إضافة درس جديد للمتجر
async function addNewCourse() {
    const title = document.getElementById('course-name').value;
    const price = document.getElementById('course-price').value;
    const url = document.getElementById('course-link').value;

    if (!title || !price || !url) return alert("املأ بيانات الدرس كاملة");

    const { error } = await _supabase
        .from('lessons') // تأكد إنك عملت جدول بالاسم ده في سوبابيز
        .insert([{ title: title, price: price, video_url: url }]);

    if (!error) {
        alert("تم نشر الدرس في المنصة بنجاح!");
        document.getElementById('course-name').value = "";
        document.getElementById('course-price').value = "";
        document.getElementById('course-link').value = "";
    } else {
        alert("خطأ في إضافة الدرس: " + error.message);
    }
}

// 3. وظيفة عرض الدروس للطلاب (ستستدعى في auth.js)
async function loadCourses() {
    const { data: lessons, error } = await _supabase
        .from('lessons')
        .select('*');

    const container = document.getElementById('courses-container');
    container.innerHTML = "";

    if (lessons) {
        lessons.forEach(lesson => {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card bg-secondary text-white p-3 shadow">
                        <h5>${lesson.title}</h5>
                        <p class="text-info">السعر: ${lesson.price} ج.م</p>
                        <button onclick="buyCourse('${lesson.id}', ${lesson.price})" class="btn btn-warning w-100">شراء المحاضرة</button>
                    </div>
                </div>
            `;
        });
    }
}
