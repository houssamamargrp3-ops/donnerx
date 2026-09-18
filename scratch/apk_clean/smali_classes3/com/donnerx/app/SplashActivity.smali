.class public Lcom/donnerx/app/SplashActivity;
.super Landroid/app/Activity;
.source "SplashActivity.java"


# direct methods
.method public static synthetic $r8$lambda$WYZHljXoG5AMZwqjLQqaUdogwvA(Lcom/donnerx/app/SplashActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/donnerx/app/SplashActivity;->lambda$onCreate$0()V

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 8
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    return-void
.end method

.method private synthetic lambda$onCreate$0()V
    .locals 2

    .line 13
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/donnerx/app/MainActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    invoke-virtual {p0, v0}, Lcom/donnerx/app/SplashActivity;->startActivity(Landroid/content/Intent;)V

    .line 14
    invoke-virtual {p0}, Lcom/donnerx/app/SplashActivity;->finish()V

    .line 15
    return-void
.end method


# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 4
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .line 11
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 12
    new-instance v0, Landroid/os/Handler;

    invoke-direct {v0}, Landroid/os/Handler;-><init>()V

    new-instance v1, Lcom/donnerx/app/SplashActivity$$ExternalSyntheticLambda0;

    invoke-direct {v1, p0}, Lcom/donnerx/app/SplashActivity$$ExternalSyntheticLambda0;-><init>(Lcom/donnerx/app/SplashActivity;)V

    const-wide/16 v2, 0x5dc

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 16
    return-void
.end method
