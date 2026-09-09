package com.rateldijital.etahb;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.content.Context;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.charset.StandardCharsets;
@CapacitorPlugin(name="CommunityVault")
public class CommunityVaultPlugin extends Plugin {
 private static final String ALIAS="etahb.community.v1";
 private String key(PluginCall c){String k=c.getString("key");if(!"session".equals(k)&&!"oauth".equals(k))throw new IllegalArgumentException("Invalid key");return k;}
 private SecretKey secret() throws Exception {KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);if(store.containsAlias(ALIAS))return (SecretKey)store.getKey(ALIAS,null);KeyGenerator g=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");g.init(new KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build());return g.generateKey();}
 @PluginMethod public void set(PluginCall call){try{String k=key(call),v=call.getString("value");if(v==null||v.length()>8192)throw new IllegalArgumentException("Invalid value");Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,secret());String result=Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)+":"+Base64.encodeToString(cipher.doFinal(v.getBytes(StandardCharsets.UTF_8)),Base64.NO_WRAP);if(!getContext().getSharedPreferences("community_vault",Context.MODE_PRIVATE).edit().putString(k,result).commit())throw new Exception("Storage error");call.resolve();}catch(Exception e){call.reject("Secure storage unavailable");}}
 @PluginMethod public void get(PluginCall call){try{String k=key(call),v=getContext().getSharedPreferences("community_vault",Context.MODE_PRIVATE).getString(k,null);JSObject result=new JSObject();if(v==null){result.put("value",org.json.JSONObject.NULL);}else{String[] parts=v.split(":",2);Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,secret(),new GCMParameterSpec(128,Base64.decode(parts[0],Base64.NO_WRAP)));result.put("value",new String(cipher.doFinal(Base64.decode(parts[1],Base64.NO_WRAP)),StandardCharsets.UTF_8));}call.resolve(result);}catch(Exception e){call.reject("Secure storage unavailable");}}
 @PluginMethod public void remove(PluginCall call){try{if(!getContext().getSharedPreferences("community_vault",Context.MODE_PRIVATE).edit().remove(key(call)).commit())throw new Exception("Storage error");call.resolve();}catch(Exception e){call.reject("Secure storage unavailable");}}
}
