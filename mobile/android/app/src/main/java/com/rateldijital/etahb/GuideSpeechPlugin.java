package com.rateldijital.etahb;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Locale;
import java.util.UUID;

@CapacitorPlugin(name="GuideSpeech")
public class GuideSpeechPlugin extends Plugin {
    private TextToSpeech engine;
    private boolean ready=false;
    private PluginCall pending;
    private String utteranceId;
    @PluginMethod public void speak(PluginCall call) {
        String text=call.getString("text", ""), language=call.getString("language", "tr-TR");
        if(text.isEmpty()||text.length()>3900||!language.matches("tr-TR|en-GB|de-DE|fr-FR|ar-SA")){call.reject("Invalid speech");return;}
        getActivity().runOnUiThread(()->{
            stopCurrent();pending=call;
            if(engine!=null){if(ready)startPending();return;}
            engine=new TextToSpeech(getContext(),status->getActivity().runOnUiThread(()->{
                if(engine==null)return;
                ready=status==TextToSpeech.SUCCESS;
                if(!ready){if(pending!=null){pending.reject("Voice unavailable");pending=null;}engine.shutdown();engine=null;return;}
                engine.setOnUtteranceProgressListener(new UtteranceProgressListener(){
                    public void onStart(String id){}
                    public void onDone(String id){getActivity().runOnUiThread(()->finish(id,false));}
                    public void onError(String id){getActivity().runOnUiThread(()->finish(id,true));}
                });
                startPending();
            }));
        });
    }
    private void startPending(){
        if(pending==null||engine==null||!ready)return;
        Locale locale=Locale.forLanguageTag(pending.getString("language","tr-TR"));
        if(engine.setLanguage(locale)<TextToSpeech.LANG_AVAILABLE){pending.reject("Voice unavailable");pending=null;return;}
        Voice voice=engine.getVoice();
        if(voice==null||voice.isNetworkConnectionRequired()){
            voice=null;
            if(engine.getVoices()!=null)for(Voice candidate:engine.getVoices())if(!candidate.isNetworkConnectionRequired()&&candidate.getLocale().getLanguage().equals(locale.getLanguage())){voice=candidate;break;}
            if(voice==null){pending.reject("Offline voice unavailable");pending=null;return;}
            engine.setVoice(voice);
        }
        engine.setSpeechRate(.94f);utteranceId=UUID.randomUUID().toString();
        if(engine.speak(pending.getString("text",""),TextToSpeech.QUEUE_FLUSH,null,utteranceId)==TextToSpeech.ERROR)finish(utteranceId,true);
    }
    private void finish(String id,boolean failed){if(id==null||!id.equals(utteranceId)||pending==null)return;PluginCall call=pending;pending=null;utteranceId=null;if(failed)call.reject("Speech unavailable");else call.resolve();}
    private void stopCurrent(){utteranceId=null;if(engine!=null)engine.stop();if(pending!=null){pending.resolve();pending=null;}}
    @PluginMethod public void stop(PluginCall call){getActivity().runOnUiThread(()->{stopCurrent();call.resolve();});}
    @Override protected void handleOnPause(){stopCurrent();}
    @Override protected void handleOnDestroy(){stopCurrent();if(engine!=null)engine.shutdown();engine=null;ready=false;}
}
