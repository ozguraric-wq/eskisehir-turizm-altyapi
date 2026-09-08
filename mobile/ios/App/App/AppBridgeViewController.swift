import Capacitor
import UIKit
import AVFoundation

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
    override func capacitorDidLoad() { bridge?.registerPluginInstance(TripPrintPlugin()); bridge?.registerPluginInstance(GuideSpeechPlugin()) }
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
