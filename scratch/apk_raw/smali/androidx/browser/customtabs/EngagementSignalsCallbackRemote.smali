.class final Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;
.super Ljava/lang/Object;
.source "EngagementSignalsCallbackRemote.java"

# interfaces
.implements Landroidx/browser/customtabs/EngagementSignalsCallback;


# static fields
.field private static final TAG:Ljava/lang/String; = "EngagementSigsCallbkRmt"


# instance fields
.field private final mCallbackBinder:Landroid/support/customtabs/IEngagementSignalsCallback;


# direct methods
.method private constructor <init>(Landroid/support/customtabs/IEngagementSignalsCallback;)V
    .locals 0
    .param p1, "callbackBinder"    # Landroid/support/customtabs/IEngagementSignalsCallback;

    .line 40
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 41
    iput-object p1, p0, Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;->mCallbackBinder:Landroid/support/customtabs/IEngagementSignalsCallback;

    .line 42
    return-void
.end method

.method static fromBinder(Landroid/os/IBinder;)Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;
    .locals 2
    .param p0, "binder"    # Landroid/os/IBinder;

    .line 49
    nop

    .line 50
    invoke-static {p0}, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->asInterface(Landroid/os/IBinder;)Landroid/support/customtabs/IEngagementSignalsCallback;

    move-result-object v0

    .line 51
    .local v0, "callbackBinder":Landroid/support/customtabs/IEngagementSignalsCallback;
    new-instance v1, Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;

    invoke-direct {v1, v0}, Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;-><init>(Landroid/support/customtabs/IEngagementSignalsCallback;)V

    return-object v1
.end method


# virtual methods
.method public onGreatestScrollPercentageIncreased(ILandroid/os/Bundle;)V
    .locals 3
    .param p1, "scrollPercentage"    # I
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 84
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;->mCallbackBinder:Landroid/support/customtabs/IEngagementSignalsCallback;

    invoke-interface {v0, p1, p2}, Landroid/support/customtabs/IEngagementSignalsCallback;->onGreatestScrollPercentageIncreased(ILandroid/os/Bundle;)V
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    .line 87
    goto :goto_0

    .line 85
    :catch_0
    move-exception v0

    .line 86
    .local v0, "e":Landroid/os/RemoteException;
    const-string v1, "EngagementSigsCallbkRmt"

    const-string v2, "RemoteException during IEngagementSignalsCallback transaction"

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 88
    .end local v0    # "e":Landroid/os/RemoteException;
    :goto_0
    return-void
.end method

.method public onSessionEnded(ZLandroid/os/Bundle;)V
    .locals 3
    .param p1, "didUserInteract"    # Z
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 101
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;->mCallbackBinder:Landroid/support/customtabs/IEngagementSignalsCallback;

    invoke-interface {v0, p1, p2}, Landroid/support/customtabs/IEngagementSignalsCallback;->onSessionEnded(ZLandroid/os/Bundle;)V
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    .line 104
    goto :goto_0

    .line 102
    :catch_0
    move-exception v0

    .line 103
    .local v0, "e":Landroid/os/RemoteException;
    const-string v1, "EngagementSigsCallbkRmt"

    const-string v2, "RemoteException during IEngagementSignalsCallback transaction"

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 105
    .end local v0    # "e":Landroid/os/RemoteException;
    :goto_0
    return-void
.end method

.method public onVerticalScrollEvent(ZLandroid/os/Bundle;)V
    .locals 3
    .param p1, "isDirectionUp"    # Z
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 64
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/EngagementSignalsCallbackRemote;->mCallbackBinder:Landroid/support/customtabs/IEngagementSignalsCallback;

    invoke-interface {v0, p1, p2}, Landroid/support/customtabs/IEngagementSignalsCallback;->onVerticalScrollEvent(ZLandroid/os/Bundle;)V
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    .line 67
    goto :goto_0

    .line 65
    :catch_0
    move-exception v0

    .line 66
    .local v0, "e":Landroid/os/RemoteException;
    const-string v1, "EngagementSigsCallbkRmt"

    const-string v2, "RemoteException during IEngagementSignalsCallback transaction"

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 68
    .end local v0    # "e":Landroid/os/RemoteException;
    :goto_0
    return-void
.end method
