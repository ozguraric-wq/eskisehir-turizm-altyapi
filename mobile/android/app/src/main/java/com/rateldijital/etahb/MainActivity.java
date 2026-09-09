package com.rateldijital.etahb;

import android.os.Bundle;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.util.Map;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TripPrintPlugin.class);
        registerPlugin(GuideSpeechPlugin.class);
        registerPlugin(CommunityVaultPlugin.class);
        super.onCreate(savedInstanceState);
        // Next exports a real index.html per route. Keep clean URLs on reload,
        // after login and after an external navigation round trip.
        bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, final WebResourceRequest request) {
                final Uri original=request.getUrl();
                String path=original.getPath();
                if ("localhost".equals(original.getHost()) && "GET".equals(request.getMethod()) && path!=null && !path.equals("/") && !path.substring(path.lastIndexOf('/')+1).contains(".")) {
                    final Uri asset=original.buildUpon().path(path.replaceAll("/+$", "")+"/index.html").build();
                    return super.shouldInterceptRequest(view, new WebResourceRequest() {
                        public Uri getUrl(){return asset;}
                        public boolean isForMainFrame(){return request.isForMainFrame();}
                        public boolean isRedirect(){return android.os.Build.VERSION.SDK_INT>=24 && request.isRedirect();}
                        public boolean hasGesture(){return request.hasGesture();}
                        public String getMethod(){return request.getMethod();}
                        public Map<String,String> getRequestHeaders(){return request.getRequestHeaders();}
                    });
                }
                return super.shouldInterceptRequest(view,request);
            }
        });
    }
}
