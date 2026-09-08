import type { CapacitorConfig } from "@capacitor/cli";
const config:CapacitorConfig={
  appId:"com.rateldijital.etahb",
  appName:"Eskişehir Cebimde",
  webDir:"mobile/www",
  backgroundColor:"#ffffff",
  server:{hostname:"localhost",androidScheme:"https"},
  android:{path:"mobile/android",allowMixedContent:false},
  ios:{path:"mobile/ios",contentInset:"automatic",scheme:"App"},
};
export default config;
