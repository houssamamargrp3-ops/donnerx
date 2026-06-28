# 🩸 DONNER.X — منصة التبرع بالدم الوطنية

منصة وطنية متكاملة لإدارة التبرع بالدم، تربط المتبرعين بمراكز الدم والمستشفيات.

## التقنيات
- **Next.js 16** + TypeScript
- **PostgreSQL** + Prisma ORM v7
- **NextAuth v5** للمصادقة
- **Tailwind CSS** + Arabic RTL

## الواجهات
1. 📱 تطبيق المتبرعين
2. 🩸 لوحة مراكز الدم
3. 🏥 بوابة المستشفيات
4. ⚙️ لوحة الإدارة المركزية

## التشغيل المحلي

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## متغيرات البيئة
انسخ `.env.example` إلى `.env` وعدّل القيم.
