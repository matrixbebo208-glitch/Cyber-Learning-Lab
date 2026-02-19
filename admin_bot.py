import telebot
import requests

# --- البيانات الأساسية ---
BOT_TOKEN = "8584857850:AAG9WWu_9nPWbY291ES3RhrNMndCNQcTWWo"
SUPABASE_URL = "https://datbgyhlzgxpmavqzuvj.supabase.co"
# استخدم هنا المفتاح الذي يبدأ بـ eyJ (Service Role Key يفضل للعمليات الحساسة)
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdGJneWhsemd4cG1hdnF6dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzU2NzAsImV4cCI6MjA4NzExMTY3MH0._WtcwRY1_33domEA8ZxCc05NGbcReOz-JkfOQifEEMg"
ADMIN_ID = 8593574557  # الأيدي الخاص بك

bot = telebot.TeleBot(BOT_TOKEN)

# دالة لإضافة الكود في Supabase
def add_key_to_db(user_id, code):
    url = f"{SUPABASE_URL}/rest/v1/keys"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    data = {"code": str(code), "assigned_to": user_id}
    response = requests.post(url, headers=headers, json=data)
    return response.status_code == 201

@bot.message_handler(commands=['start'])
def start(message):
    if message.from_user.id == ADMIN_ID:
        bot.reply_to(message, "🛠️ أهلاً بك يا أدمن ماتركس.\nلتفعيل طالب، أرسل الأمر كالتالي:\n`تفعيل MX-1234 998877`")
    else:
        bot.reply_to(message, "⚠️ عذراً، هذا البوت مخصص لإدارة نظام ماتركس فقط.")

@bot.message_handler(func=lambda m: m.text and m.text.startswith("تفعيل"))
def handle_activation(message):
    if message.from_user.id != ADMIN_ID: return
    
    try:
        parts = message.text.split()
        user_id = parts[1] # الأيدي الخاص بالطالب
        code = parts[2]    # الكود اللي هتديهوله
        
        if add_key_to_db(user_id, code):
            bot.reply_to(message, f"✅ تم بنجاح!\nالطالب: {user_id}\nكود التفعيل: {code}\nيمكن للطالب الدخول الآن.")
        else:
            bot.reply_to(message, "❌ فشل إضافة الكود. تأكد من إعدادات الجدول في Supabase.")
    except Exception as e:
        bot.reply_to(message, f"⚠️ خطأ في التنسيق. استخدم:\nتفعيل [ID] [CODE]")

print("🤖 بوت ماتركس يعمل الآن...")
bot.polling()
