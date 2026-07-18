const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const { topic, duration, audience } = req.body;

 const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent(`
أنت خبير محتوى TikTok. اكتب سكريبت فيديو TikTok احترافي بالعربية بناءً على هذه المعلومات:

الموضوع: ${topic}
مدة الفيديو: ${duration} ثانية
الجمهور المستهدف: ${audience}

اكتب السكريبت بهذا الشكل:
1. 🎯 الهوك (أول 3 ثواني): جملة تجذب الانتباه فوراً
2. 📝 السكريبت الكامل: مقسم بالثواني
3. 🎬 أفكار المونتاج: ماذا يظهر في كل جزء
4. #️⃣ الهاشتاقات: 10 هاشتاقات مناسبة
5. 💡 نصيحة إضافية لزيادة المشاهدات
    `);

    const content = result.response.text();
    console.log("تم توليد المحتوى بنجاح");
    res.json({ content });
  } catch (error) {
    console.error("خطأ:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`السيرفر يعمل على المنفذ ${process.env.PORT}`);
});