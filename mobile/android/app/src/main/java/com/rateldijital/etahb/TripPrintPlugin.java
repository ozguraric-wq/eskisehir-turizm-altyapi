package com.rateldijital.etahb;

import android.content.Context;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name="TripPrint")
public class TripPrintPlugin extends Plugin {
    private WebView printView;
    @PluginMethod public void print(PluginCall call) {
        String html=call.getString("html", "");
        String title=call.getString("title", "Eskişehir gezi planı");
        if(html.isEmpty() || html.length()>1500000){call.reject("Invalid document");return;}
        getActivity().runOnUiThread(()->{
            if(printView!=null){call.reject("A print job is already open");return;}
            printView=new WebView(getActivity());
            printView.getSettings().setJavaScriptEnabled(false);
            printView.getSettings().setAllowFileAccess(false);
            printView.getSettings().setBlockNetworkLoads(true);
            printView.setWebViewClient(new WebViewClient(){
                private boolean started=false;
                @Override public void onPageFinished(WebView view,String url){
                    if(started)return;started=true;
                    PrintManager manager=(PrintManager)getActivity().getSystemService(Context.PRINT_SERVICE);
                    if(manager==null){view.destroy();printView=null;call.reject("Printing unavailable");return;}
                    PrintDocumentAdapter delegate=view.createPrintDocumentAdapter(title);
                    PrintDocumentAdapter adapter=new PrintDocumentAdapter(){
                        @Override public void onStart(){delegate.onStart();}
                        @Override public void onLayout(PrintAttributes oldAttributes,PrintAttributes newAttributes,CancellationSignal cancellationSignal,LayoutResultCallback callback,Bundle extras){delegate.onLayout(oldAttributes,newAttributes,cancellationSignal,callback,extras);}
                        @Override public void onWrite(PageRange[] pages,ParcelFileDescriptor destination,CancellationSignal cancellationSignal,WriteResultCallback callback){delegate.onWrite(pages,destination,cancellationSignal,callback);}
                        @Override public void onFinish(){delegate.onFinish();view.destroy();printView=null;}
                    };
                    manager.print(title,adapter,new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
                    call.resolve();
                }
            });
            printView.loadDataWithBaseURL(null,html,"text/html","UTF-8",null);
        });
    }
}
