import { handleAssistantApi,type AssistantEnv } from "../lib/mobile/assistant-server";
// Optional independent backend for the Android/iOS binaries and GitHub Pages.
// Use an HTTPS API origin under the institution's hosting account.
export default {fetch:(request:Request,env:AssistantEnv)=>handleAssistantApi(request,env)};
