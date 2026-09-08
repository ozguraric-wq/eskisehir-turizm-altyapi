import Capacitor
import UIKit

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
    override func capacitorDidLoad() { bridge?.registerPluginInstance(TripPrintPlugin()) }
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
