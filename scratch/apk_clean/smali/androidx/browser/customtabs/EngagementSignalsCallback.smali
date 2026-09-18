.class public interface abstract Landroidx/browser/customtabs/EngagementSignalsCallback;
.super Ljava/lang/Object;
.source "EngagementSignalsCallback.java"


# virtual methods
.method public onGreatestScrollPercentageIncreased(ILandroid/os/Bundle;)V
    .locals 0
    .param p1, "scrollPercentage"    # I
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 51
    return-void
.end method

.method public onSessionEnded(ZLandroid/os/Bundle;)V
    .locals 0
    .param p1, "didUserInteract"    # Z
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 61
    return-void
.end method

.method public onVerticalScrollEvent(ZLandroid/os/Bundle;)V
    .locals 0
    .param p1, "isDirectionUp"    # Z
    .param p2, "extras"    # Landroid/os/Bundle;

    .line 38
    return-void
.end method
