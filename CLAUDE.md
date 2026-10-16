# 小小遊戲屋（smallgame）

給 5 歲左右孩子在平板上玩的小遊戲合集，由 `main` 分支透過 GitHub Pages 發布。
每款遊戲一個資料夾（memory/、whack/…），新增步驟見 README.md。

## 工作流程
- 修改在工作分支進行，開 PR 合併到 main。
- 我（擁有者）授權 Claude 自行合併它開的 PR，條件：
  - 已用 Playwright 完整試玩受影響的遊戲（可過關、無 JS 錯誤、無 404、手機寬度無橫向捲動）。
  - PR 說明列出變更與測試結果。
- 合併後確認 Actions 的 pages build and deployment 成功。
- 測試截圖等暫存檔不得 commit。
