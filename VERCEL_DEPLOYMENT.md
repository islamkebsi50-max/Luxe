# نشر التطبيق على Vercel

تم تجهيز التطبيق بنجاح للنشر على Vercel. اتبع هذه الخطوات:

## الخطوة 1: تحضير المتغيرات البيئية

تأكد من أن لديك جميع المتغيرات البيئية المطلوبة:

```env
# Firebase Configuration (Required)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account_email

# Image Hosting (Optional but recommended)
IMGBB_API_KEY=your_imgbb_api_key

# Session Secret (Generate a random string)
SESSION_SECRET=your_random_secret_key_here
```

## الخطوة 2: رفع المشروع إلى GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## الخطوة 3: نشر على Vercel

### الخيار 1: استخدام Vercel CLI
```bash
npm install -g vercel
vercel
```

### الخيار 2: من خلال Dashboard Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بحسابك (أو أنشئ حساباً جديداً)
3. انقر على "Add New Project"
4. اختر مستودعك على GitHub
5. في "Environment Variables"، أضف المتغيرات البيئية أعلاه
6. انقر "Deploy"

## الخطوة 4: إضافة المتغيرات البيئية في Vercel

بعد النشر الأول:
1. اذهب إلى إعدادات المشروع
2. انقر على "Environment Variables"
3. أضف كل المتغيرات البيئية:
   - FIREBASE_PROJECT_ID
   - FIREBASE_PRIVATE_KEY
   - FIREBASE_CLIENT_EMAIL
   - IMGBB_API_KEY
   - SESSION_SECRET

## ملفات التكوين

تم إضافة الملفات التالية لتوافق Vercel:

- **vercel.json**: إعدادات البناء والنشر
- **.vercelignore**: الملفات التي يجب استبعادها عند النشر
- **server/index-prod.ts**: محدث لخدمة الملفات الثابتة من المسار الصحيح

## التحقق من النشر

بعد النشر، تأكد من:
- ✅ يتم تحميل الموقع بشكل صحيح (ليس كود الخادم)
- ✅ جميع الطلبات تعمل بشكل صحيح
- ✅ الصور تُحمّل من imgbb
- ✅ قاعدة البيانات تعمل بشكل صحيح

## استكشاف الأخطاء

إذا ظهرت مشاكل:

1. **404 Not Found**: تحقق من أن `dist/public/` موجود بشكل صحيح
2. **عرض الكود**: تأكد من أن الخادم يخدم `index.html` بشكل صحيح
3. **API لا تعمل**: تحقق من المتغيرات البيئية
4. **الصور لا تُحمّل**: تأكد من أن IMGBB_API_KEY صحيح

## المساعدة

لمزيد من المعلومات عن نشر التطبيقات على Vercel:
- [وثائق Vercel](https://vercel.com/docs)
- [ملف package.json](./package.json) - تحقق من أوامر البناء
