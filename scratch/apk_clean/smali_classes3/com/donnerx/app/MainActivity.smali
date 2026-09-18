.class public Lcom/donnerx/app/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"


# static fields
.field private static final APP_URL:Ljava/lang/String; = "https://pskoc8occwcsggc8k8cs0g48.194.34.232.105.sslip.io/dashboard"


# instance fields
.field private progressBar:Landroid/widget/ProgressBar;

.field private webView:Landroid/webkit/WebView;


# direct methods
.method static bridge synthetic -$$Nest$fgetprogressBar(Lcom/donnerx/app/MainActivity;)Landroid/widget/ProgressBar;
    .locals 0

    iget-object p0, p0, Lcom/donnerx/app/MainActivity;->progressBar:Landroid/widget/ProgressBar;

    return-object p0
.end method

.method public constructor <init>()V
    .locals 0

    .line 19
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    return-void
.end method


# virtual methods
.method public onBackPressed()V
    .locals 1

    .line 99
    iget-object v0, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->canGoBack()Z

    move-result v0

    if-eqz v0, :cond_0

    .line 100
    iget-object v0, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->goBack()V

    goto :goto_0

    .line 102
    :cond_0
    invoke-super {p0}, Landroid/app/Activity;->onBackPressed()V

    .line 104
    :goto_0
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 4
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .line 28
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 31
    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Lcom/donnerx/app/MainActivity;->requestWindowFeature(I)Z

    .line 32
    invoke-virtual {p0}, Lcom/donnerx/app/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v1

    const/16 v2, 0x400

    invoke-virtual {v1, v2, v2}, Landroid/view/Window;->setFlags(II)V

    .line 36
    invoke-virtual {p0}, Lcom/donnerx/app/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v1

    const v2, -0x23d9da

    invoke-virtual {v1, v2}, Landroid/view/Window;->setStatusBarColor(I)V

    .line 38
    sget v1, Lcom/donnerx/app/R$layout;->activity_main:I

    invoke-virtual {p0, v1}, Lcom/donnerx/app/MainActivity;->setContentView(I)V

    .line 40
    sget v1, Lcom/donnerx/app/R$id;->webview:I

    invoke-virtual {p0, v1}, Lcom/donnerx/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v1

    check-cast v1, Landroid/webkit/WebView;

    iput-object v1, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    .line 41
    sget v1, Lcom/donnerx/app/R$id;->progressbar:I

    invoke-virtual {p0, v1}, Lcom/donnerx/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v1

    check-cast v1, Landroid/widget/ProgressBar;

    iput-object v1, p0, Lcom/donnerx/app/MainActivity;->progressBar:Landroid/widget/ProgressBar;

    .line 44
    iget-object v1, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v1}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    move-result-object v1

    .line 45
    .local v1, "settings":Landroid/webkit/WebSettings;
    invoke-virtual {v1, v0}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    .line 46
    invoke-virtual {v1, v0}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V

    .line 47
    invoke-virtual {v1, v0}, Landroid/webkit/WebSettings;->setDatabaseEnabled(Z)V

    .line 48
    const/4 v2, -0x1

    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setCacheMode(I)V

    .line 49
    invoke-virtual {v1, v0}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V

    .line 50
    invoke-virtual {v1, v0}, Landroid/webkit/WebSettings;->setLoadWithOverviewMode(Z)V

    .line 51
    invoke-virtual {v1, v0}, Landroid/webkit/WebSettings;->setUseWideViewPort(Z)V

    .line 52
    const/4 v2, 0x0

    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setSupportZoom(Z)V

    .line 53
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setBuiltInZoomControls(Z)V

    .line 54
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    .line 57
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v2

    invoke-virtual {v2, v0}, Landroid/webkit/CookieManager;->setAcceptCookie(Z)V

    .line 58
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v2

    iget-object v3, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v2, v3, v0}, Landroid/webkit/CookieManager;->setAcceptThirdPartyCookies(Landroid/webkit/WebView;Z)V

    .line 61
    iget-object v0, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    new-instance v2, Lcom/donnerx/app/MainActivity$1;

    invoke-direct {v2, p0}, Lcom/donnerx/app/MainActivity$1;-><init>(Lcom/donnerx/app/MainActivity;)V

    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    .line 73
    iget-object v0, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    new-instance v2, Lcom/donnerx/app/MainActivity$2;

    invoke-direct {v2, p0}, Lcom/donnerx/app/MainActivity$2;-><init>(Lcom/donnerx/app/MainActivity;)V

    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    .line 94
    iget-object v0, p0, Lcom/donnerx/app/MainActivity;->webView:Landroid/webkit/WebView;

    const-string v2, "https://pskoc8occwcsggc8k8cs0g48.194.34.232.105.sslip.io/dashboard"

    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 95
    return-void
.end method
