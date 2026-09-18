.class public abstract Landroid/support/customtabs/IEngagementSignalsCallback$Stub;
.super Landroid/os/Binder;
.source "IEngagementSignalsCallback.java"

# interfaces
.implements Landroid/support/customtabs/IEngagementSignalsCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Landroid/support/customtabs/IEngagementSignalsCallback;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x409
    name = "Stub"
.end annotation

.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Landroid/support/customtabs/IEngagementSignalsCallback$Stub$Proxy;
    }
.end annotation


# static fields
.field static final TRANSACTION_onGreatestScrollPercentageIncreased:I = 0x3

.field static final TRANSACTION_onSessionEnded:I = 0x4

.field static final TRANSACTION_onVerticalScrollEvent:I = 0x2


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 32
    invoke-direct {p0}, Landroid/os/Binder;-><init>()V

    .line 33
    sget-object v0, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->DESCRIPTOR:Ljava/lang/String;

    invoke-virtual {p0, p0, v0}, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->attachInterface(Landroid/os/IInterface;Ljava/lang/String;)V

    .line 34
    return-void
.end method

.method public static asInterface(Landroid/os/IBinder;)Landroid/support/customtabs/IEngagementSignalsCallback;
    .locals 2
    .param p0, "obj"    # Landroid/os/IBinder;

    .line 41
    if-nez p0, :cond_0

    .line 42
    const/4 v0, 0x0

    return-object v0

    .line 44
    :cond_0
    sget-object v0, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->DESCRIPTOR:Ljava/lang/String;

    invoke-interface {p0, v0}, Landroid/os/IBinder;->queryLocalInterface(Ljava/lang/String;)Landroid/os/IInterface;

    move-result-object v0

    .line 45
    .local v0, "iin":Landroid/os/IInterface;
    if-eqz v0, :cond_1

    instance-of v1, v0, Landroid/support/customtabs/IEngagementSignalsCallback;

    if-eqz v1, :cond_1

    .line 46
    move-object v1, v0

    check-cast v1, Landroid/support/customtabs/IEngagementSignalsCallback;

    return-object v1

    .line 48
    :cond_1
    new-instance v1, Landroid/support/customtabs/IEngagementSignalsCallback$Stub$Proxy;

    invoke-direct {v1, p0}, Landroid/support/customtabs/IEngagementSignalsCallback$Stub$Proxy;-><init>(Landroid/os/IBinder;)V

    return-object v1
.end method


# virtual methods
.method public asBinder()Landroid/os/IBinder;
    .locals 0

    .line 52
    return-object p0
.end method

.method public onTransact(ILandroid/os/Parcel;Landroid/os/Parcel;I)Z
    .locals 4
    .param p1, "code"    # I
    .param p2, "data"    # Landroid/os/Parcel;
    .param p3, "reply"    # Landroid/os/Parcel;
    .param p4, "flags"    # I
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Landroid/os/RemoteException;
        }
    .end annotation

    .line 56
    sget-object v0, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->DESCRIPTOR:Ljava/lang/String;

    .line 57
    .local v0, "descriptor":Ljava/lang/String;
    const/4 v1, 0x1

    if-lt p1, v1, :cond_0

    const v2, 0xffffff

    if-gt p1, v2, :cond_0

    .line 58
    invoke-virtual {p2, v0}, Landroid/os/Parcel;->enforceInterface(Ljava/lang/String;)V

    .line 60
    :cond_0
    const v2, 0x5f4e5446

    if-ne p1, v2, :cond_1

    .line 61
    invoke-virtual {p3, v0}, Landroid/os/Parcel;->writeString(Ljava/lang/String;)V

    .line 62
    return v1

    .line 64
    :cond_1
    const/4 v2, 0x0

    packed-switch p1, :pswitch_data_0

    .line 95
    invoke-super {p0, p1, p2, p3, p4}, Landroid/os/Binder;->onTransact(ILandroid/os/Parcel;Landroid/os/Parcel;I)Z

    move-result v1

    return v1

    .line 87
    :pswitch_0
    invoke-virtual {p2}, Landroid/os/Parcel;->readInt()I

    move-result v3

    if-eqz v3, :cond_2

    move v2, v1

    .line 89
    .local v2, "_arg0":Z
    :cond_2
    sget-object v3, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v3}, Landroid/support/customtabs/IEngagementSignalsCallback$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Landroid/os/Bundle;

    .line 90
    .local v3, "_arg1":Landroid/os/Bundle;
    invoke-virtual {p0, v2, v3}, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->onSessionEnded(ZLandroid/os/Bundle;)V

    .line 91
    goto :goto_0

    .line 78
    .end local v2    # "_arg0":Z
    .end local v3    # "_arg1":Landroid/os/Bundle;
    :pswitch_1
    invoke-virtual {p2}, Landroid/os/Parcel;->readInt()I

    move-result v2

    .line 80
    .local v2, "_arg0":I
    sget-object v3, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v3}, Landroid/support/customtabs/IEngagementSignalsCallback$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Landroid/os/Bundle;

    .line 81
    .restart local v3    # "_arg1":Landroid/os/Bundle;
    invoke-virtual {p0, v2, v3}, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->onGreatestScrollPercentageIncreased(ILandroid/os/Bundle;)V

    .line 82
    goto :goto_0

    .line 69
    .end local v2    # "_arg0":I
    .end local v3    # "_arg1":Landroid/os/Bundle;
    :pswitch_2
    invoke-virtual {p2}, Landroid/os/Parcel;->readInt()I

    move-result v3

    if-eqz v3, :cond_3

    move v2, v1

    .line 71
    .local v2, "_arg0":Z
    :cond_3
    sget-object v3, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v3}, Landroid/support/customtabs/IEngagementSignalsCallback$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Landroid/os/Bundle;

    .line 72
    .restart local v3    # "_arg1":Landroid/os/Bundle;
    invoke-virtual {p0, v2, v3}, Landroid/support/customtabs/IEngagementSignalsCallback$Stub;->onVerticalScrollEvent(ZLandroid/os/Bundle;)V

    .line 73
    nop

    .line 98
    .end local v2    # "_arg0":Z
    .end local v3    # "_arg1":Landroid/os/Bundle;
    :goto_0
    return v1

    :pswitch_data_0
    .packed-switch 0x2
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method
