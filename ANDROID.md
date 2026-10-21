# Android App 打包說明

小小遊戲屋以 [Capacitor](https://capacitorjs.com/) 把網頁遊戲包成 Android App。**網頁版完全不受影響**：GitHub Pages 仍然直接發布倉庫根目錄，App 則使用另外複製出來的 `www/`。

## 檔案說明

| 檔案 | 用途 |
|------|------|
| `package.json` | Capacitor 套件版本與指令（`npm run build`／`sync`／`open`） |
| `capacitor.config.json` | App ID（`io.github.syuming.smallgame`）、App 名稱、網頁目錄 |
| `scripts/build-web.mjs` | 把選單、共用檔案、隱私權政策與每個遊戲資料夾複製到 `www/` |
| `android/` | Android Studio 專案（已換成遊戲屋圖示與黃色啟動畫面） |
| `privacy.html` | 隱私權政策，上架時填入 https://syuming.github.io/smallgame/privacy.html |

`www/` 與 `node_modules/` 由指令產生，不放進 git。

## App 版與網頁版的差異

- **完全離線**：遊戲檔案內建在 App 中；打包時會移除 Google Fonts 連結，改用 Android 內建字型。
- **語音**：Android WebView 不支援網頁語音 API，`shared/kit.js` 偵測到 App 環境時會改用原生文字轉語音（`@capacitor-community/text-to-speech`）。平板需要有中文語音：設定 → 文字轉語音輸出 → Google 語音服務，下載「中文（台灣）」。
- **不備份資料**：`android:allowBackup="false"`，著色作品等本機資料不會上傳到雲端備份，與隱私權政策一致。

## 第一次建置

需要：Node.js 22 以上、[Android Studio](https://developer.android.com/studio)（內含 JDK 與 Android SDK）。

```bash
npm install        # 安裝 Capacitor
npm run sync       # 產生 www/ 並複製到 android/
npm run open       # 用 Android Studio 開啟 android/
```

在 Android Studio 按 ▶ Run，就能在模擬器或用 USB 連接的平板上試玩。

## 修改遊戲之後

每次修改或新增遊戲，都要重新同步再建置：

```bash
npm run sync
```

新增的遊戲資料夾（裡面有 `index.html`）會自動納入，不必修改腳本。

## 產生上架用的 AAB

1. **遞增版本號**：每次上傳 Google Play 前，修改 `android/app/build.gradle` 的 `versionCode`（整數，每次 +1）與 `versionName`（顯示用，例如 `1.1`）。
2. Android Studio → **Build → Generate Signed App Bundle or APK → Android App Bundle**。
3. 第一次會建立**上傳金鑰**（`.jks` 檔）。
   - 金鑰與密碼**務必備份**到安全的地方（例如密碼管理器加上離線備份）。
   - `.gitignore` 已排除 `*.jks`、`*.keystore`，請勿手動加入 git。
   - 建議啟用 Google Play 應用程式簽署（Play App Signing）：上傳金鑰若遺失，可以向 Google 申請重設。
4. 產生的 `app-release.aab` 上傳到 Play Console。

## Play Console 填寫重點

| 項目 | 建議填寫 |
|------|----------|
| 隱私權政策 | https://syuming.github.io/smallgame/privacy.html |
| 目標年齡層 | 5 歲以下、6–8 歲（會適用「家庭政策」） |
| 廣告 | 否，不含廣告 |
| 資料安全性 | 不收集、不分享任何使用者資料 |
| 應用程式存取權 | 所有功能都不需登入 |
| 內容分級問卷 | 無暴力、無使用者互動、無購買項目 |

## 注意事項

- **App ID 上架後無法變更**：`io.github.syuming.smallgame` 在 Google Play 是唯一識別，第一次上傳後就固定了。
- `npm audit` 會顯示 Capacitor CLI 相依套件（`uuid`，供 iOS 專案工具使用）的中度警告。CLI 只在開發電腦上執行，不會打包進 App，可以忽略，待 Capacitor 更新後再升級。
- 升級 Capacitor 時，`@capacitor/core`、`@capacitor/android`、`@capacitor/cli` 三者版本需一致。
