.class public final Landroidx/browser/customtabs/CustomTabsSession;
.super Ljava/lang/Object;
.source "CustomTabsSession.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Landroidx/browser/customtabs/CustomTabsSession$MockSession;,
        Landroidx/browser/customtabs/CustomTabsSession$PendingSession;
    }
.end annotation


# static fields
.field private static final TAG:Ljava/lang/String; = "CustomTabsSession"

.field static final TARGET_ORIGIN_KEY:Ljava/lang/String; = "target_origin"


# instance fields
.field private final mCallback:Landroid/support/customtabs/ICustomTabsCallback;

.field private final mComponentName:Landroid/content/ComponentName;

.field private final mId:Landroid/app/PendingIntent;

.field private final mLock:Ljava/lang/Object;

.field private final mService:Landroid/support/customtabs/ICustomTabsService;


# direct methods
.method constructor <init>(Landroid/support/customtabs/ICustomTabsService;Landroid/support/customtabs/ICustomTabsCallback;Landroid/content/ComponentName;Landroid/app/PendingIntent;)V
    .locals 1
    .param p1, "service"    # Landroid/support/customtabs/ICustomTabsService;
    .param p2, "callback"    # Landroid/support/customtabs/ICustomTabsCallback;
    .param p3, "componentName"    # Landroid/content/ComponentName;
    .param p4, "sessionId"    # Landroid/app/PendingIntent;

    .line 86
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 53
    new-instance v0, Ljava/lang/Object;

    invoke-direct {v0}, Ljava/lang/Object;-><init>()V

    iput-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mLock:Ljava/lang/Object;

    .line 87
    iput-object p1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    .line 88
    iput-object p2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    .line 89
    iput-object p3, p0, Landroidx/browser/customtabs/CustomTabsSession;->mComponentName:Landroid/content/ComponentName;

    .line 90
    iput-object p4, p0, Landroidx/browser/customtabs/CustomTabsSession;->mId:Landroid/app/PendingIntent;

    .line 91
    return-void
.end method

.method private addIdToBundle(Landroid/os/Bundle;)V
    .locals 2
    .param p1, "bundle"    # Landroid/os/Bundle;

    .line 506
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mId:Landroid/app/PendingIntent;

    if-eqz v0, :cond_0

    const-string v0, "android.support.customtabs.extra.SESSION_ID"

    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mId:Landroid/app/PendingIntent;

    invoke-virtual {p1, v0, v1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 507
    :cond_0
    return-void
.end method

.method private createBundleWithId(Landroid/os/Bundle;)Landroid/os/Bundle;
    .locals 1
    .param p1, "bundle"    # Landroid/os/Bundle;

    .line 499
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 500
    .local v0, "bundleWithId":Landroid/os/Bundle;
    if-eqz p1, :cond_0

    invoke-virtual {v0, p1}, Landroid/os/Bundle;->putAll(Landroid/os/Bundle;)V

    .line 501
    :cond_0
    invoke-direct {p0, v0}, Landroidx/browser/customtabs/CustomTabsSession;->addIdToBundle(Landroid/os/Bundle;)V

    .line 502
    return-object v0
.end method

.method private createEngagementSignalsCallbackWrapper(Landroidx/browser/customtabs/EngagementSignalsCallback;)Landroid/support/customtabs/IEngagementSignalsCallback$Stub;
    .locals 1
    .param p1, "callback"    # Landroidx/browser/customtabs/EngagementSignalsCallback;

    .line 395
    new-instance v0, Landroidx/browser/customtabs/CustomTabsSession$1;

    invoke-direct {v0, p0, p1}, Landroidx/browser/customtabs/CustomTabsSession$1;-><init>(Landroidx/browser/customtabs/CustomTabsSession;Landroidx/browser/customtabs/EngagementSignalsCallback;)V

    return-object v0
.end method

.method private createEngagementSignalsCallbackWrapper(Landroidx/browser/customtabs/EngagementSignalsCallback;Ljava/util/concurrent/Executor;)Landroid/support/customtabs/IEngagementSignalsCallback$Stub;
    .locals 1
    .param p1, "callback"    # Landroidx/browser/customtabs/EngagementSignalsCallback;
    .param p2, "executor"    # Ljava/util/concurrent/Executor;

    .line 446
    new-instance v0, Landroidx/browser/customtabs/CustomTabsSession$2;

    invoke-direct {v0, p0, p2, p1}, Landroidx/browser/customtabs/CustomTabsSession$2;-><init>(Landroidx/browser/customtabs/CustomTabsSession;Ljava/util/concurrent/Executor;Landroidx/browser/customtabs/EngagementSignalsCallback;)V

    return-object v0
.end method

.method public static createMockSessionForTesting(Landroid/content/ComponentName;)Landroidx/browser/customtabs/CustomTabsSession;
    .locals 4
    .param p0, "componentName"    # Landroid/content/ComponentName;

    .line 80
    new-instance v0, Landroidx/browser/customtabs/CustomTabsSession;

    new-instance v1, Landroidx/browser/customtabs/CustomTabsSession$MockSession;

    invoke-direct {v1}, Landroidx/browser/customtabs/CustomTabsSession$MockSession;-><init>()V

    new-instance v2, Landroidx/browser/customtabs/CustomTabsSessionToken$MockCallback;

    invoke-direct {v2}, Landroidx/browser/customtabs/CustomTabsSessionToken$MockCallback;-><init>()V

    const/4 v3, 0x0

    invoke-direct {v0, v1, v2, p0, v3}, Landroidx/browser/customtabs/CustomTabsSession;-><init>(Landroid/support/customtabs/ICustomTabsService;Landroid/support/customtabs/ICustomTabsCallback;Landroid/content/ComponentName;Landroid/app/PendingIntent;)V

    return-object v0
.end method

.method private createPostMessageExtraBundle(Landroid/net/Uri;)Landroid/os/Bundle;
    .locals 2
    .param p1, "targetOrigin"    # Landroid/net/Uri;

    .line 483
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 484
    .local v0, "toReturn":Landroid/os/Bundle;
    if-eqz p1, :cond_0

    .line 485
    const-string v1, "target_origin"

    invoke-virtual {v0, v1, p1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 492
    :cond_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mId:Landroid/app/PendingIntent;

    if-eqz v1, :cond_1

    .line 493
    invoke-direct {p0, v0}, Landroidx/browser/customtabs/CustomTabsSession;->addIdToBundle(Landroid/os/Bundle;)V

    .line 495
    :cond_1
    invoke-virtual {v0}, Landroid/os/Bundle;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_2

    const/4 v1, 0x0

    goto :goto_0

    :cond_2
    move-object v1, v0

    :goto_0
    return-object v1
.end method


# virtual methods
.method getBinder()Landroid/os/IBinder;
    .locals 1

    .line 510
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0}, Landroid/support/customtabs/ICustomTabsCallback;->asBinder()Landroid/os/IBinder;

    move-result-object v0

    return-object v0
.end method

.method getComponentName()Landroid/content/ComponentName;
    .locals 1

    .line 514
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mComponentName:Landroid/content/ComponentName;

    return-object v0
.end method

.method getId()Landroid/app/PendingIntent;
    .locals 1

    .line 519
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mId:Landroid/app/PendingIntent;

    return-object v0
.end method

.method public isEngagementSignalsApiAvailable(Landroid/os/Bundle;)Z
    .locals 3
    .param p1, "extras"    # Landroid/os/Bundle;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Landroid/os/RemoteException;
        }
    .end annotation

    .line 357
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0, v1, p1}, Landroid/support/customtabs/ICustomTabsService;->isEngagementSignalsApiAvailable(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/Bundle;)Z

    move-result v0
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_0

    return v0

    .line 358
    :catch_0
    move-exception v0

    .line 359
    .local v0, "e":Ljava/lang/SecurityException;
    new-instance v1, Ljava/lang/UnsupportedOperationException;

    const-string v2, "This method isn\'t supported by the Custom Tabs implementation."

    invoke-direct {v1, v2, v0}, Ljava/lang/UnsupportedOperationException;-><init>(Ljava/lang/String;Ljava/lang/Throwable;)V

    throw v1
.end method

.method public mayLaunchUrl(Landroid/net/Uri;Landroid/os/Bundle;Ljava/util/List;)Z
    .locals 2
    .param p1, "url"    # Landroid/net/Uri;
    .param p2, "extras"    # Landroid/os/Bundle;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/net/Uri;",
            "Landroid/os/Bundle;",
            "Ljava/util/List<",
            "Landroid/os/Bundle;",
            ">;)Z"
        }
    .end annotation

    .line 113
    .local p3, "otherLikelyBundles":Ljava/util/List;, "Ljava/util/List<Landroid/os/Bundle;>;"
    invoke-direct {p0, p2}, Landroidx/browser/customtabs/CustomTabsSession;->createBundleWithId(Landroid/os/Bundle;)Landroid/os/Bundle;

    move-result-object p2

    .line 115
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0, v1, p1, p2, p3}, Landroid/support/customtabs/ICustomTabsService;->mayLaunchUrl(Landroid/support/customtabs/ICustomTabsCallback;Landroid/net/Uri;Landroid/os/Bundle;Ljava/util/List;)Z

    move-result v0
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v0

    .line 116
    :catch_0
    move-exception v0

    .line 117
    .local v0, "e":Landroid/os/RemoteException;
    const/4 v1, 0x0

    return v1
.end method

.method public postMessage(Ljava/lang/String;Landroid/os/Bundle;)I
    .locals 3
    .param p1, "message"    # Ljava/lang/String;
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 272
    invoke-direct {p0, p2}, Landroidx/browser/customtabs/CustomTabsSession;->createBundleWithId(Landroid/os/Bundle;)Landroid/os/Bundle;

    move-result-object p2

    .line 273
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mLock:Ljava/lang/Object;

    monitor-enter v0

    .line 275
    :try_start_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v1, v2, p1, p2}, Landroid/support/customtabs/ICustomTabsService;->postMessage(Landroid/support/customtabs/ICustomTabsCallback;Ljava/lang/String;Landroid/os/Bundle;)I

    move-result v1
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    :try_start_1
    monitor-exit v0

    return v1

    .line 279
    :catchall_0
    move-exception v1

    goto :goto_0

    .line 276
    :catch_0
    move-exception v1

    .line 277
    .local v1, "e":Landroid/os/RemoteException;
    monitor-exit v0

    const/4 v0, -0x2

    return v0

    .line 279
    .end local v1    # "e":Landroid/os/RemoteException;
    :goto_0
    monitor-exit v0
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    throw v1
.end method

.method public receiveFile(Landroid/net/Uri;ILandroid/os/Bundle;)Z
    .locals 2
    .param p1, "uri"    # Landroid/net/Uri;
    .param p2, "purpose"    # I
    .param p3, "extras"    # Landroid/os/Bundle;

    .line 334
    invoke-direct {p0, p3}, Landroidx/browser/customtabs/CustomTabsSession;->createBundleWithId(Landroid/os/Bundle;)Landroid/os/Bundle;

    move-result-object p3

    .line 336
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0, v1, p1, p2, p3}, Landroid/support/customtabs/ICustomTabsService;->receiveFile(Landroid/support/customtabs/ICustomTabsCallback;Landroid/net/Uri;ILandroid/os/Bundle;)Z

    move-result v0
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v0

    .line 337
    :catch_0
    move-exception v0

    .line 338
    .local v0, "e":Landroid/os/RemoteException;
    const/4 v1, 0x0

    return v1
.end method

.method public requestPostMessageChannel(Landroid/net/Uri;)Z
    .locals 2
    .param p1, "postMessageOrigin"    # Landroid/net/Uri;

    .line 225
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    const/4 v1, 0x0

    invoke-virtual {p0, p1, v1, v0}, Landroidx/browser/customtabs/CustomTabsSession;->requestPostMessageChannel(Landroid/net/Uri;Landroid/net/Uri;Landroid/os/Bundle;)Z

    move-result v0

    return v0
.end method

.method public requestPostMessageChannel(Landroid/net/Uri;Landroid/net/Uri;Landroid/os/Bundle;)Z
    .locals 3
    .param p1, "postMessageOrigin"    # Landroid/net/Uri;
    .param p2, "postMessageTargetOrigin"    # Landroid/net/Uri;
    .param p3, "extras"    # Landroid/os/Bundle;

    .line 244
    nop

    .line 245
    :try_start_0
    invoke-direct {p0, p2}, Landroidx/browser/customtabs/CustomTabsSession;->createPostMessageExtraBundle(Landroid/net/Uri;)Landroid/os/Bundle;

    move-result-object v0

    .line 246
    .local v0, "targetOriginWithIdBundle":Landroid/os/Bundle;
    if-eqz v0, :cond_0

    .line 247
    invoke-virtual {p3, v0}, Landroid/os/Bundle;->putAll(Landroid/os/Bundle;)V

    .line 248
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v1, v2, p1, p3}, Landroid/support/customtabs/ICustomTabsService;->requestPostMessageChannelWithExtras(Landroid/support/customtabs/ICustomTabsCallback;Landroid/net/Uri;Landroid/os/Bundle;)Z

    move-result v1

    return v1

    .line 251
    :cond_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v1, v2, p1}, Landroid/support/customtabs/ICustomTabsService;->requestPostMessageChannel(Landroid/support/customtabs/ICustomTabsCallback;Landroid/net/Uri;)Z

    move-result v1
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v1

    .line 253
    .end local v0    # "targetOriginWithIdBundle":Landroid/os/Bundle;
    :catch_0
    move-exception v0

    .line 254
    .local v0, "e":Landroid/os/RemoteException;
    const/4 v1, 0x0

    return v1
.end method

.method public setActionButton(Landroid/graphics/Bitmap;Ljava/lang/String;)Z
    .locals 4
    .param p1, "icon"    # Landroid/graphics/Bitmap;
    .param p2, "description"    # Ljava/lang/String;

    .line 130
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 131
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v1, "android.support.customtabs.customaction.ICON"

    invoke-virtual {v0, v1, p1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 132
    const-string v1, "android.support.customtabs.customaction.DESCRIPTION"

    invoke-virtual {v0, v1, p2}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 134
    new-instance v1, Landroid/os/Bundle;

    invoke-direct {v1}, Landroid/os/Bundle;-><init>()V

    .line 135
    .local v1, "metaBundle":Landroid/os/Bundle;
    const-string v2, "android.support.customtabs.extra.ACTION_BUTTON_BUNDLE"

    invoke-virtual {v1, v2, v0}, Landroid/os/Bundle;->putBundle(Ljava/lang/String;Landroid/os/Bundle;)V

    .line 136
    invoke-direct {p0, v0}, Landroidx/browser/customtabs/CustomTabsSession;->addIdToBundle(Landroid/os/Bundle;)V

    .line 138
    :try_start_0
    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v3, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v2, v3, v1}, Landroid/support/customtabs/ICustomTabsService;->updateVisuals(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/Bundle;)Z

    move-result v2
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v2

    .line 139
    :catch_0
    move-exception v2

    .line 140
    .local v2, "e":Landroid/os/RemoteException;
    const/4 v3, 0x0

    return v3
.end method

.method public setEngagementSignalsCallback(Landroidx/browser/customtabs/EngagementSignalsCallback;Landroid/os/Bundle;)Z
    .locals 4
    .param p1, "callback"    # Landroidx/browser/customtabs/EngagementSignalsCallback;
    .param p2, "extras"    # Landroid/os/Bundle;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Landroid/os/RemoteException;
        }
    .end annotation

    .line 384
    invoke-direct {p0, p1}, Landroidx/browser/customtabs/CustomTabsSession;->createEngagementSignalsCallbackWrapper(Landroidx/browser/customtabs/EngagementSignalsCallback;)Landroid/support/customtabs/IEngagementSignalsCallback$Stub;

    move-result-object v0

    .line 386
    .local v0, "wrapper":Landroid/support/customtabs/IEngagementSignalsCallback;
    :try_start_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0}, Landroid/support/customtabs/IEngagementSignalsCallback;->asBinder()Landroid/os/IBinder;

    move-result-object v3

    invoke-interface {v1, v2, v3, p2}, Landroid/support/customtabs/ICustomTabsService;->setEngagementSignalsCallback(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/IBinder;Landroid/os/Bundle;)Z

    move-result v1
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_0

    return v1

    .line 387
    :catch_0
    move-exception v1

    .line 388
    .local v1, "e":Ljava/lang/SecurityException;
    new-instance v2, Ljava/lang/UnsupportedOperationException;

    const-string v3, "This method isn\'t supported by the Custom Tabs implementation."

    invoke-direct {v2, v3, v1}, Ljava/lang/UnsupportedOperationException;-><init>(Ljava/lang/String;Ljava/lang/Throwable;)V

    throw v2
.end method

.method public setEngagementSignalsCallback(Ljava/util/concurrent/Executor;Landroidx/browser/customtabs/EngagementSignalsCallback;Landroid/os/Bundle;)Z
    .locals 4
    .param p1, "executor"    # Ljava/util/concurrent/Executor;
    .param p2, "callback"    # Landroidx/browser/customtabs/EngagementSignalsCallback;
    .param p3, "extras"    # Landroid/os/Bundle;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Landroid/os/RemoteException;
        }
    .end annotation

    .line 434
    nop

    .line 435
    invoke-direct {p0, p2, p1}, Landroidx/browser/customtabs/CustomTabsSession;->createEngagementSignalsCallbackWrapper(Landroidx/browser/customtabs/EngagementSignalsCallback;Ljava/util/concurrent/Executor;)Landroid/support/customtabs/IEngagementSignalsCallback$Stub;

    move-result-object v0

    .line 437
    .local v0, "wrapper":Landroid/support/customtabs/IEngagementSignalsCallback;
    :try_start_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0}, Landroid/support/customtabs/IEngagementSignalsCallback;->asBinder()Landroid/os/IBinder;

    move-result-object v3

    invoke-interface {v1, v2, v3, p3}, Landroid/support/customtabs/ICustomTabsService;->setEngagementSignalsCallback(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/IBinder;Landroid/os/Bundle;)Z

    move-result v1
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_0

    return v1

    .line 438
    :catch_0
    move-exception v1

    .line 439
    .local v1, "e":Ljava/lang/SecurityException;
    new-instance v2, Ljava/lang/UnsupportedOperationException;

    const-string v3, "This method isn\'t supported by the Custom Tabs implementation."

    invoke-direct {v2, v3, v1}, Ljava/lang/UnsupportedOperationException;-><init>(Ljava/lang/String;Ljava/lang/Throwable;)V

    throw v2
.end method

.method public setSecondaryToolbarSwipeUpGesture(Landroid/app/PendingIntent;)Z
    .locals 3
    .param p1, "pendingIntent"    # Landroid/app/PendingIntent;

    .line 176
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 177
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v1, "androidx.browser.customtabs.extra.SECONDARY_TOOLBAR_SWIPE_UP_GESTURE"

    invoke-virtual {v0, v1, p1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 179
    invoke-direct {p0, v0}, Landroidx/browser/customtabs/CustomTabsSession;->addIdToBundle(Landroid/os/Bundle;)V

    .line 181
    :try_start_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v1, v2, v0}, Landroid/support/customtabs/ICustomTabsService;->updateVisuals(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/Bundle;)Z

    move-result v1
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v1

    .line 182
    :catch_0
    move-exception v1

    .line 183
    .local v1, "e":Landroid/os/RemoteException;
    const/4 v2, 0x0

    return v2
.end method

.method public setSecondaryToolbarViews(Landroid/widget/RemoteViews;[ILandroid/app/PendingIntent;)Z
    .locals 3
    .param p1, "remoteViews"    # Landroid/widget/RemoteViews;
    .param p2, "clickableIDs"    # [I
    .param p3, "pendingIntent"    # Landroid/app/PendingIntent;

    .line 156
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 157
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v1, "android.support.customtabs.extra.EXTRA_REMOTEVIEWS"

    invoke-virtual {v0, v1, p1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 158
    const-string v1, "android.support.customtabs.extra.EXTRA_REMOTEVIEWS_VIEW_IDS"

    invoke-virtual {v0, v1, p2}, Landroid/os/Bundle;->putIntArray(Ljava/lang/String;[I)V

    .line 159
    const-string v1, "android.support.customtabs.extra.EXTRA_REMOTEVIEWS_PENDINGINTENT"

    invoke-virtual {v0, v1, p3}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 160
    invoke-direct {p0, v0}, Landroidx/browser/customtabs/CustomTabsSession;->addIdToBundle(Landroid/os/Bundle;)V

    .line 162
    :try_start_0
    iget-object v1, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v1, v2, v0}, Landroid/support/customtabs/ICustomTabsService;->updateVisuals(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/Bundle;)Z

    move-result v1
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v1

    .line 163
    :catch_0
    move-exception v1

    .line 164
    .local v1, "e":Landroid/os/RemoteException;
    const/4 v2, 0x0

    return v2
.end method

.method public setToolbarItem(ILandroid/graphics/Bitmap;Ljava/lang/String;)Z
    .locals 4
    .param p1, "id"    # I
    .param p2, "icon"    # Landroid/graphics/Bitmap;
    .param p3, "description"    # Ljava/lang/String;
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 200
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 201
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v1, "android.support.customtabs.customaction.ID"

    invoke-virtual {v0, v1, p1}, Landroid/os/Bundle;->putInt(Ljava/lang/String;I)V

    .line 202
    const-string v1, "android.support.customtabs.customaction.ICON"

    invoke-virtual {v0, v1, p2}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 203
    const-string v1, "android.support.customtabs.customaction.DESCRIPTION"

    invoke-virtual {v0, v1, p3}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 205
    new-instance v1, Landroid/os/Bundle;

    invoke-direct {v1}, Landroid/os/Bundle;-><init>()V

    .line 206
    .local v1, "metaBundle":Landroid/os/Bundle;
    const-string v2, "android.support.customtabs.extra.ACTION_BUTTON_BUNDLE"

    invoke-virtual {v1, v2, v0}, Landroid/os/Bundle;->putBundle(Ljava/lang/String;Landroid/os/Bundle;)V

    .line 207
    invoke-direct {p0, v1}, Landroidx/browser/customtabs/CustomTabsSession;->addIdToBundle(Landroid/os/Bundle;)V

    .line 209
    :try_start_0
    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v3, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v2, v3, v1}, Landroid/support/customtabs/ICustomTabsService;->updateVisuals(Landroid/support/customtabs/ICustomTabsCallback;Landroid/os/Bundle;)Z

    move-result v2
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v2

    .line 210
    :catch_0
    move-exception v2

    .line 211
    .local v2, "e":Landroid/os/RemoteException;
    const/4 v3, 0x0

    return v3
.end method

.method public validateRelationship(ILandroid/net/Uri;Landroid/os/Bundle;)Z
    .locals 3
    .param p1, "relation"    # I
    .param p2, "origin"    # Landroid/net/Uri;
    .param p3, "extras"    # Landroid/os/Bundle;

    .line 304
    const/4 v0, 0x1

    const/4 v1, 0x0

    if-lt p1, v0, :cond_1

    const/4 v0, 0x2

    if-le p1, v0, :cond_0

    goto :goto_0

    .line 308
    :cond_0
    invoke-direct {p0, p3}, Landroidx/browser/customtabs/CustomTabsSession;->createBundleWithId(Landroid/os/Bundle;)Landroid/os/Bundle;

    move-result-object p3

    .line 310
    :try_start_0
    iget-object v0, p0, Landroidx/browser/customtabs/CustomTabsSession;->mService:Landroid/support/customtabs/ICustomTabsService;

    iget-object v2, p0, Landroidx/browser/customtabs/CustomTabsSession;->mCallback:Landroid/support/customtabs/ICustomTabsCallback;

    invoke-interface {v0, v2, p1, p2, p3}, Landroid/support/customtabs/ICustomTabsService;->validateRelationship(Landroid/support/customtabs/ICustomTabsCallback;ILandroid/net/Uri;Landroid/os/Bundle;)Z

    move-result v0
    :try_end_0
    .catch Landroid/os/RemoteException; {:try_start_0 .. :try_end_0} :catch_0

    return v0

    .line 311
    :catch_0
    move-exception v0

    .line 312
    .local v0, "e":Landroid/os/RemoteException;
    return v1

    .line 306
    .end local v0    # "e":Landroid/os/RemoteException;
    :cond_1
    :goto_0
    return v1
.end method
