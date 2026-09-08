import { Capacitor,registerPlugin } from "@capacitor/core";
import type { Locale } from "../routing/types";
const Speech=registerPlugin<{speak(options:{text:string;language:string}):Promise<void>;stop():Promise<void>}>("GuideSpeech");
const languages={tr:"tr-TR",en:"en-GB",de:"de-DE",fr:"fr-FR",ar:"ar-SA"};
export async function speakGuide(text:string,locale:Locale,onEnd:()=>void){
  if(Capacitor.isNativePlatform()){await Speech.speak({text:text.slice(0,3900),language:languages[locale]});onEnd();return;}
  if(typeof speechSynthesis==="undefined")throw Error("Voice unavailable");
  const voices=speechSynthesis.getVoices(),voice=voices.find(v=>v.lang.toLowerCase().startsWith(locale));
  if(!voice)throw Error("Voice unavailable");
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text.slice(0,3900));utterance.lang=languages[locale];utterance.voice=voice;utterance.rate=.94;utterance.onend=onEnd;utterance.onerror=onEnd;speechSynthesis.speak(utterance);
}
export function stopGuide(){if(Capacitor.isNativePlatform())return Speech.stop().catch(()=>{});if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();}
