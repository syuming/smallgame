# 翻翻樂記憶卡

給 5 歲左右孩子玩的翻牌記憶配對遊戲，針對平板觸控設計。

## 怎麼玩

用瀏覽器開啟 `index.html` 即可，不需要安裝，也不需要連網（字型除外）。

- 點兩張卡片翻開，圖案一樣就配對成功，下方的托盤會收集找到的圖案。
- 配對成功時會唸出名稱（例如「小狗」），幫助孩子認識事物。
- 三種主題：動物、水果、交通工具。
- 三種難度：簡單（3 對）、普通（4 對）、挑戰（6 對）。
- 沒有失敗或扣分；全部找到後一定會得到至少 2 顆星。

## 放到平板上（GitHub Pages）

1. 將本分支合併到 `main`。
2. GitHub repository → **Settings → Pages** → Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
3. 約 1–2 分鐘後會出現網址：`https://syuming.github.io/smallgame/`。
4. 在平板上用該網址開啟，然後：
   - **iPad（Safari）**：分享按鈕 →「加入主畫面」
   - **Android（Chrome）**：右上角選單 →「加到主畫面」／「安裝應用程式」
5. 從主畫面的「翻翻樂」圖示開啟時，會以全螢幕方式執行，沒有網址列。

> 注意：免費帳號的 GitHub Pages 只支援 **public** repository；private repository 需要 GitHub Pro 以上方案。

主題、難度與音效設定會記在瀏覽器中。
