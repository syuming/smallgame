package io.github.syuming.smallgame;

import android.net.Uri;
import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Capacitor leaves the back key to Android, which closes the app from any page.
        // Inside a game (or the privacy page) it returns to the menu; on the menu it leaves the app as usual.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                String url = getBridge().getWebView().getUrl();
                String path = url == null ? null : Uri.parse(url).getPath();
                if (path == null || path.equals("/") || path.equals("/index.html")) {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                } else {
                    getBridge().getWebView().loadUrl(getBridge().getLocalUrl() + "/index.html");
                }
            }
        });
    }
}
