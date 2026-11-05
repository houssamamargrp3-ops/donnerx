/**
 * 🚀 HayatLink — Hackathon Phased Rollout Feature Flags
 * 
 * للتحكم في تفعيل أو تعطيل الميزات بسهولة تامة:
 * - لإرجاع الميزة للعمل فوراً: غيّر القيمة من `false` إلى `true`
 * - لتعطيل الميزة وإظهارها كـ "قيد التطوير": غيّر القيمة إلى `false`
 * 
 * هذا الملف مصمم ليكون المفتاح الوحيد للتشغيل والإيقاف بدون أي تعقيد.
 */

export const FEATURE_FLAGS = {
  /**
   * ميزة تتبع مخزون الدم المركزي (Inventory)
   * القيمة الافتراضية: false (تظهر قيد التطوير خلال الهاكاثون)
   * لإرجاعها: اجعلها true
   */
  INVENTORY_ENABLED: false,

  /**
   * ميزة نظام المكافآت والجوائز (Gamification)
   * القيمة الافتراضية: false (تظهر قيد التطوير للجنة الهاكاثون)
   * لإرجاعها: اجعلها true
   */
  GAMIFICATION_ENABLED: false,

  /**
   * ميزة مساعد الذكاء الاصطناعي (AI Assistant)
   * القيمة الافتراضية: false
   * لإرجاعها: اجعلها true
   */
  AI_ASSISTANT_ENABLED: false,
};
