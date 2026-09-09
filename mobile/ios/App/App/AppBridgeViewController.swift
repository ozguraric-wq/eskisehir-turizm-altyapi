import Capacitor
import UIKit
import AVFoundation
import Security

struct ExportedPageRouter: Router {
    var basePath: String = ""
    func route(for path: String) -> String {
        let url = URL(fileURLWithPath: path)
        if url.pathExtension.isEmpty {
            let route = path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
            return basePath + (route.isEmpty ? "/index.html" : "/" + route + "/index.html")
        }
        return basePath + path
    }
}
class AppBridgeViewController: CAPBridgeViewController {
    override func router() -> Router { return ExportedPageRouter() }
    override func capacitorDidLoad() { bridge?.registerPluginInstance(TripPrintPlugin()); bridge?.registerPluginInstance(GuideSpeechPlugin()); bridge?.registerPluginInstance(CommunityVaultPlugin()) }
}
@objc(TripPrintPlugin)
public class TripPrintPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TripPrintPlugin"
    public let jsName = "TripPrint"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "print", returnType: CAPPluginReturnPromise)]
    @objc func print(_ call: CAPPluginCall) {
        guard let html = call.getString("html"), html.count < 1500000 else { call.reject("Invalid document"); return }
        DispatchQueue.main.async {
            let controller = UIPrintInteractionController.shared
            let info = UIPrintInfo(dictionary: nil)
            info.jobName = call.getString("title") ?? "Eskişehir"
            info.outputType = .general
            controller.printInfo = info
            controller.printFormatter = UIMarkupTextPrintFormatter(markupText: html)
            controller.present(animated: true) { _, _, error in
                if let error = error { call.reject(error.localizedDescription) } else { call.resolve() }
            }
        }
    }
}

@objc(GuideSpeechPlugin)
public class GuideSpeechPlugin: CAPPlugin, CAPBridgedPlugin, AVSpeechSynthesizerDelegate {
    public let identifier = "GuideSpeechPlugin"
    public let jsName = "GuideSpeech"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name:"speak",returnType:CAPPluginReturnPromise), CAPPluginMethod(name:"stop",returnType:CAPPluginReturnPromise)]
    private let synthesizer = AVSpeechSynthesizer()
    private var activeCall: CAPPluginCall?
    private var activeUtterance: AVSpeechUtterance?
    @objc func speak(_ call: CAPPluginCall) {
        guard let text=call.getString("text"), !text.isEmpty, text.count<=3900, let language=call.getString("language"), ["tr-TR","en-GB","de-DE","fr-FR","ar-SA"].contains(language) else { call.reject("Invalid speech");return }
        DispatchQueue.main.async {
            self.stopCurrent()
            guard let voice=AVSpeechSynthesisVoice(language:language) else { call.reject("Voice unavailable");return }
            let utterance=AVSpeechUtterance(string:text)
            utterance.voice=voice;utterance.rate=AVSpeechUtteranceDefaultSpeechRate * 0.94
            self.activeCall=call;self.activeUtterance=utterance;self.synthesizer.delegate=self;self.synthesizer.speak(utterance)
        }
    }
    private func stopCurrent(){synthesizer.stopSpeaking(at:.immediate);activeCall?.resolve();activeCall=nil;activeUtterance=nil}
    @objc func stop(_ call:CAPPluginCall){DispatchQueue.main.async{self.stopCurrent();call.resolve()}}
    public func speechSynthesizer(_ synthesizer:AVSpeechSynthesizer,didFinish utterance:AVSpeechUtterance){if utterance===activeUtterance{activeCall?.resolve();activeCall=nil;activeUtterance=nil}}
    public func speechSynthesizer(_ synthesizer:AVSpeechSynthesizer,didCancel utterance:AVSpeechUtterance){if utterance===activeUtterance{activeCall?.resolve();activeCall=nil;activeUtterance=nil}}
}

@objc(CommunityVaultPlugin)
public class CommunityVaultPlugin: CAPPlugin, CAPBridgedPlugin {
 public let identifier="CommunityVaultPlugin"
 public let jsName="CommunityVault"
 public let pluginMethods:[CAPPluginMethod]=[CAPPluginMethod(name:"get",returnType:CAPPluginReturnPromise),CAPPluginMethod(name:"set",returnType:CAPPluginReturnPromise),CAPPluginMethod(name:"remove",returnType:CAPPluginReturnPromise)]
 private func query(_ call:CAPPluginCall)->[String:Any]? {guard let key=call.getString("key"),["session","oauth"].contains(key) else{return nil};return [kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:"com.rateldijital.etahb.community",kSecAttrAccount as String:key]}
 @objc func get(_ call:CAPPluginCall){guard var q=query(call) else{call.reject("Invalid key");return};q[kSecReturnData as String]=true;q[kSecMatchLimit as String]=kSecMatchLimitOne;var value:CFTypeRef?;let status=SecItemCopyMatching(q as CFDictionary,&value);if status==errSecItemNotFound{call.resolve(["value":NSNull()]);return};guard status==errSecSuccess,let bytes=value as? Data,let text=String(data:bytes,encoding:.utf8) else{call.reject("Secure storage unavailable");return};call.resolve(["value":text])}
 @objc func set(_ call:CAPPluginCall){guard let q=query(call),let value=call.getString("value"),value.count<8192,let data=value.data(using:.utf8) else{call.reject("Invalid value");return};let fields:[String:Any]=[kSecValueData as String:data,kSecAttrAccessible as String:kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly];let status=SecItemUpdate(q as CFDictionary,fields as CFDictionary);if status==errSecItemNotFound{var insert=q;for(k,v)in fields{insert[k]=v};guard SecItemAdd(insert as CFDictionary,nil)==errSecSuccess else{call.reject("Secure storage unavailable");return}}else if status != errSecSuccess{call.reject("Secure storage unavailable");return};call.resolve()}
 @objc func remove(_ call:CAPPluginCall){guard let q=query(call)else{call.reject("Invalid key");return};let status=SecItemDelete(q as CFDictionary);if status==errSecSuccess || status==errSecItemNotFound{call.resolve()}else{call.reject("Secure storage unavailable")}}
}
