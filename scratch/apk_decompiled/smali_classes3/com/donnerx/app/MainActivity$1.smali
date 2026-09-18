.class Lcom/donnerx/app/MainActivity$1;
.super Landroid/webkit/WebChromeClient;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/donnerx/app/MainActivity;->onCreate(Landroid/os/Bundle;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/donnerx/app/MainActivity;


# direct methods
.method constructor <init>(Lcom/donnerx/app/MainActivity;)V
    .locals 0
    .param p1, "this$0"    # Lcom/donnerx/app/MainActivity;
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010
        }
        names = {
            null
        }
    .end annotation

    .line 61
    iput-object p1, p0, Lcom/donnerx/app/MainActivity$1;->this$0:Lcom/donnerx/app/MainActivity;

    invoke-direct {p0}, Landroid/webkit/WebChromeClient;-><init>()V

    return-void
.end method


# virtual methods
.method public onProgressChanged(Landroid/webkit/WebView;I)V
    .locals 2
    .param p1, "view"    # Landroid/webkit/WebView;
    .param p2, "newProgress"    # I

    .line 64
    iget-object v0, p0, Lcom/donnerx/app/MainActivity$1;->this$0:Lcom/donnerx/app/MainActivity;

    invoke-static {v0}, Lcom/donnerx/app/MainActivity;->-$$Nest$fgetprogressBar(Lcom/donnerx/app/MainActivity;)Landroid/widget/ProgressBar;

    move-result-object v0

    invoke-virtual {v0, p2}, Landroid/widget/ProgressBar;->setProgress(I)V

    .line 65
    const/16 v0, 0x64

    if-ne p2, v0, :cond_0

    .line 66
    iget-object v0, p0, Lcom/donnerx/app/MainActivity$1;->this$0:Lcom/donnerx/app/MainActivity;

    invoke-static {v0}, Lcom/donnerx/app/MainActivity;->-$$Nest$fgetprogressBar(Lcom/donnerx/app/MainActivity;)Landroid/widget/ProgressBar;

    move-result-object v0

    const/16 v1, 0x8

    invoke-virtual {v0, v1}, Landroid/widget/ProgressBar;->setVisibility(I)V

    goto :goto_0

    .line 68
    :cond_0
    iget-object v0, p0, Lcom/donnerx/app/MainActivity$1;->this$0:Lcom/donnerx/app/MainActivity;

    invoke-static {v0}, Lcom/donnerx/app/MainActivity;->-$$Nest$fgetprogressBar(Lcom/donnerx/app/MainActivity;)Landroid/widget/ProgressBar;

    move-result-object v0

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/widget/ProgressBar;->setVisibility(I)V

    .line 70
    :goto_0
    return-void
.end method
