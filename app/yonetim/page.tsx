import {SocialAdmin} from '@/components/social-admin';
import {chatGPTSignInPath} from '@/app/chatgpt-auth';
export const metadata={title:'İçerik yönetimi',robots:{index:false,follow:false}};
export default function Page(){return <SocialAdmin signInPath={chatGPTSignInPath('/yonetim/')}/>;}
