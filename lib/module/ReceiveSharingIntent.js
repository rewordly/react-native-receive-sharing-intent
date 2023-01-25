function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { Platform, Linking, AppState, NativeModules } from "react-native";
import Utils from "./utils";
const {
  ReceiveSharingIntent
} = NativeModules;
class ReceiveSharingIntentModule {
  constructor() {
    _defineProperty(this, "isIos", Platform.OS === "ios");
    _defineProperty(this, "utils", new Utils());
    _defineProperty(this, "isClear", false);
  }
  getReceivedFiles(handler, errorHandler) {
    let protocol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "ShareMedia";
    if (this.isIos) {
      Linking.getInitialURL().then(res => {
        if (res && res.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
          this.getFileNames(handler, errorHandler, res);
        }
      }).catch(() => {});
      Linking.addEventListener("url", res => {
        const url = res ? res.url : "";
        if (url.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
          this.getFileNames(handler, errorHandler, res.url);
        }
      });
    } else {
      AppState.addEventListener('change', status => {
        if (status === 'active' && !this.isClear) {
          this.getFileNames(handler, errorHandler, "");
        }
      });
      if (!this.isClear) this.getFileNames(handler, errorHandler, "");
    }
  }
  clearReceivedFiles() {
    this.isClear = true;
  }
  getFileNames(handler, errorHandler, url) {
    if (this.isIos) {
      ReceiveSharingIntent.getFileNames(url).then(data => {
        let files = this.utils.sortData(data);
        handler(files);
      }).catch(e => errorHandler(e));
    } else {
      ReceiveSharingIntent.getFileNames().then(fileObject => {
        let files = Object.keys(fileObject).map(k => fileObject[k]);
        handler(files);
      }).catch(e => errorHandler(e));
    }
  }
}
export default ReceiveSharingIntentModule;
//# sourceMappingURL=ReceiveSharingIntent.js.map