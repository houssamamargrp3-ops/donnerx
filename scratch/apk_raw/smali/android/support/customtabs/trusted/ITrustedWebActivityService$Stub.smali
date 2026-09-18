.class public abstract Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;
.super Landroid/os/Binder;
.source "ITrustedWebActivityService.java"

# interfaces
.implements Landroid/support/customtabs/trusted/ITrustedWebActivityService;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Landroid/support/customtabs/trusted/ITrustedWebActivityService;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x409
    name = "Stub"
.end annotation

.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub$Proxy;
    }
.end annotation


# static fields
.field static final TRANSACTION_areNotificationsEnabled:I = 0x6

.field static final TRANSACTION_cancelNotification:I = 0x3

.field static final TRANSACTION_extraCommand:I = 0x9

.field static final TRANSACTION_getActiveNotifications:I = 0x5

.field static final TRANSACTION_getSmallIconBitmap:I = 0x7

.field static final TRANSACTION_getSmallIconId:I = 0x4

.field static final TRANSACTION_notifyNotificationWithChannel:I = 0x2


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 50
    invoke-direct {p0}, Landroid/os/Binder;-><init>()V

    .line 51
    sget-object v0, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->DESCRIPTOR:Ljava/lang/String;

    invoke-virtual {p0, p0, v0}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->attachInterface(Landroid/os/IInterface;Ljava/lang/String;)V

    .line 52
    return-void
.end method

.method public static asInterface(Landroid/os/IBinder;)Landroid/support/customtabs/trusted/ITrustedWebActivityService;
    .locals 2
    .param p0, "obj"    # Landroid/os/IBinder;

    .line 59
    if-nez p0, :cond_0

    .line 60
    const/4 v0, 0x0

    return-object v0

    .line 62
    :cond_0
    sget-object v0, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->DESCRIPTOR:Ljava/lang/String;

    invoke-interface {p0, v0}, Landroid/os/IBinder;->queryLocalInterface(Ljava/lang/String;)Landroid/os/IInterface;

    move-result-object v0

    .line 63
    .local v0, "iin":Landroid/os/IInterface;
    if-eqz v0, :cond_1

    instance-of v1, v0, Landroid/support/customtabs/trusted/ITrustedWebActivityService;

    if-eqz v1, :cond_1

    .line 64
    move-object v1, v0

    check-cast v1, Landroid/support/customtabs/trusted/ITrustedWebActivityService;

    return-object v1

    .line 66
    :cond_1
    new-instance v1, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub$Proxy;

    invoke-direct {v1, p0}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub$Proxy;-><init>(Landroid/os/IBinder;)V

    return-object v1
.end method


# virtual methods
.method public asBinder()Landroid/os/IBinder;
    .locals 0

    .line 70
    return-object p0
.end method

.method public onTransact(ILandroid/os/Parcel;Landroid/os/Parcel;I)Z
    .locals 6
    .param p1, "code"    # I
    .param p2, "data"    # Landroid/os/Parcel;
    .param p3, "reply"    # Landroid/os/Parcel;
    .param p4, "flags"    # I
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Landroid/os/RemoteException;
        }
    .end annotation

    .line 74
    sget-object v0, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->DESCRIPTOR:Ljava/lang/String;

    .line 75
    .local v0, "descriptor":Ljava/lang/String;
    const/4 v1, 0x1

    if-lt p1, v1, :cond_0

    const v2, 0xffffff

    if-gt p1, v2, :cond_0

    .line 76
    invoke-virtual {p2, v0}, Landroid/os/Parcel;->enforceInterface(Ljava/lang/String;)V

    .line 78
    :cond_0
    const v2, 0x5f4e5446

    if-ne p1, v2, :cond_1

    .line 79
    invoke-virtual {p3, v0}, Landroid/os/Parcel;->writeString(Ljava/lang/String;)V

    .line 80
    return v1

    .line 82
    :cond_1
    packed-switch p1, :pswitch_data_0

    .line 146
    :pswitch_0
    invoke-super {p0, p1, p2, p3, p4}, Landroid/os/Binder;->onTransact(ILandroid/os/Parcel;Landroid/os/Parcel;I)Z

    move-result v1

    return v1

    .line 134
    :pswitch_1
    invoke-virtual {p2}, Landroid/os/Parcel;->readString()Ljava/lang/String;

    move-result-object v2

    .line 136
    .local v2, "_arg0":Ljava/lang/String;
    sget-object v3, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v3}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Landroid/os/Bundle;

    .line 138
    .local v3, "_arg1":Landroid/os/Bundle;
    invoke-virtual {p2}, Landroid/os/Parcel;->readStrongBinder()Landroid/os/IBinder;

    move-result-object v4

    .line 139
    .local v4, "_arg2":Landroid/os/IBinder;
    invoke-virtual {p0, v2, v3, v4}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->extraCommand(Ljava/lang/String;Landroid/os/Bundle;Landroid/os/IBinder;)Landroid/os/Bundle;

    move-result-object v5

    .line 140
    .local v5, "_result":Landroid/os/Bundle;
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 141
    invoke-static {p3, v5, v1}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$100(Landroid/os/Parcel;Landroid/os/Parcelable;I)V

    .line 142
    goto :goto_0

    .line 126
    .end local v2    # "_arg0":Ljava/lang/String;
    .end local v3    # "_arg1":Landroid/os/Bundle;
    .end local v4    # "_arg2":Landroid/os/IBinder;
    .end local v5    # "_result":Landroid/os/Bundle;
    :pswitch_2
    invoke-virtual {p0}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->getSmallIconBitmap()Landroid/os/Bundle;

    move-result-object v2

    .line 127
    .local v2, "_result":Landroid/os/Bundle;
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 128
    invoke-static {p3, v2, v1}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$100(Landroid/os/Parcel;Landroid/os/Parcelable;I)V

    .line 129
    goto :goto_0

    .line 87
    .end local v2    # "_result":Landroid/os/Bundle;
    :pswitch_3
    sget-object v2, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v2}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/os/Bundle;

    .line 88
    .local v2, "_arg0":Landroid/os/Bundle;
    invoke-virtual {p0, v2}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->areNotificationsEnabled(Landroid/os/Bundle;)Landroid/os/Bundle;

    move-result-object v3

    .line 89
    .local v3, "_result":Landroid/os/Bundle;
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 90
    invoke-static {p3, v3, v1}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$100(Landroid/os/Parcel;Landroid/os/Parcelable;I)V

    .line 91
    goto :goto_0

    .line 112
    .end local v2    # "_arg0":Landroid/os/Bundle;
    .end local v3    # "_result":Landroid/os/Bundle;
    :pswitch_4
    invoke-virtual {p0}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->getActiveNotifications()Landroid/os/Bundle;

    move-result-object v2

    .line 113
    .local v2, "_result":Landroid/os/Bundle;
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 114
    invoke-static {p3, v2, v1}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$100(Landroid/os/Parcel;Landroid/os/Parcelable;I)V

    .line 115
    goto :goto_0

    .line 119
    .end local v2    # "_result":Landroid/os/Bundle;
    :pswitch_5
    invoke-virtual {p0}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->getSmallIconId()I

    move-result v2

    .line 120
    .local v2, "_result":I
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 121
    invoke-virtual {p3, v2}, Landroid/os/Parcel;->writeInt(I)V

    .line 122
    goto :goto_0

    .line 105
    .end local v2    # "_result":I
    :pswitch_6
    sget-object v2, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v2}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/os/Bundle;

    .line 106
    .local v2, "_arg0":Landroid/os/Bundle;
    invoke-virtual {p0, v2}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->cancelNotification(Landroid/os/Bundle;)V

    .line 107
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 108
    goto :goto_0

    .line 96
    .end local v2    # "_arg0":Landroid/os/Bundle;
    :pswitch_7
    sget-object v2, Landroid/os/Bundle;->CREATOR:Landroid/os/Parcelable$Creator;

    invoke-static {p2, v2}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$000(Landroid/os/Parcel;Landroid/os/Parcelable$Creator;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/os/Bundle;

    .line 97
    .restart local v2    # "_arg0":Landroid/os/Bundle;
    invoke-virtual {p0, v2}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$Stub;->notifyNotificationWithChannel(Landroid/os/Bundle;)Landroid/os/Bundle;

    move-result-object v3

    .line 98
    .restart local v3    # "_result":Landroid/os/Bundle;
    invoke-virtual {p3}, Landroid/os/Parcel;->writeNoException()V

    .line 99
    invoke-static {p3, v3, v1}, Landroid/support/customtabs/trusted/ITrustedWebActivityService$_Parcel;->access$100(Landroid/os/Parcel;Landroid/os/Parcelable;I)V

    .line 100
    nop

    .line 149
    .end local v2    # "_arg0":Landroid/os/Bundle;
    .end local v3    # "_result":Landroid/os/Bundle;
    :goto_0
    return v1

    :pswitch_data_0
    .packed-switch 0x2
        :pswitch_7
        :pswitch_6
        :pswitch_5
        :pswitch_4
        :pswitch_3
        :pswitch_2
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method
