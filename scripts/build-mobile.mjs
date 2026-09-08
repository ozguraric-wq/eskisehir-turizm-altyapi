import { spawnSync } from "node:child_process";
const build=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build"],{stdio:"inherit",env:{...process.env,GITHUB_PAGES:"false",NEXT_PUBLIC_GITHUB_PAGES:"false",MOBILE_APP:"true",NEXT_PUBLIC_MOBILE_APP:"true",NEXT_PUBLIC_BASE_PATH:""}});
if(build.status!==0)process.exit(build.status??1);
const prepare=spawnSync(process.execPath,["scripts/prepare-app-assets.mjs","native"],{stdio:"inherit"});
process.exit(prepare.status??1);
