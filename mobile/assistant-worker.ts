import {handleAssistantApi,type AssistantEnv} from "../lib/mobile/assistant-server";
import {handleSocialApi} from "../lib/social/server";
import type {SocialEnv} from "../lib/social/server-contract";
// Standalone entrypoint never trusts dispatcher identity headers supplied by a visitor.
export default {fetch:(request:Request,env:AssistantEnv&SocialEnv)=>new URL(request.url).pathname.startsWith("/api/community/")?handleSocialApi(request,env,"standalone"):handleAssistantApi(request,env)};
