.class Landroidx/browser/customtabs/CustomTabsIntent$Api21Impl;
.super Ljava/lang/Object;
.source "CustomTabsIntent.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Landroidx/browser/customtabs/CustomTabsIntent;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0xa
    name = "Api21Impl"
.end annotation


# direct methods
.method private constructor <init>()V
    .locals 0

    .line 1455
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static getLocaleForLanguageTag(Landroid/content/Intent;)Ljava/util/Locale;
    .locals 2
    .param p0, "intent"    # Landroid/content/Intent;

    .line 1464
    const-string v0, "androidx.browser.customtabs.extra.TRANSLATE_LANGUAGE_TAG"

    invoke-virtual {p0, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 1465
    .local v0, "languageTag":Ljava/lang/String;
    if-eqz v0, :cond_0

    invoke-static {v0}, Ljava/util/Locale;->forLanguageTag(Ljava/lang/String;)Ljava/util/Locale;

    move-result-object v1

    goto :goto_0

    :cond_0
    const/4 v1, 0x0

    :goto_0
    return-object v1
.end method

.method static setLanguageTag(Landroid/content/Intent;Ljava/util/Locale;)V
    .locals 2
    .param p0, "intent"    # Landroid/content/Intent;
    .param p1, "locale"    # Ljava/util/Locale;

    .line 1458
    const-string v0, "androidx.browser.customtabs.extra.TRANSLATE_LANGUAGE_TAG"

    invoke-virtual {p1}, Ljava/util/Locale;->toLanguageTag()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1459
    return-void
.end method
