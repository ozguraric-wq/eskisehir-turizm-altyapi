import {randomBytes,scryptSync} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const [username,role='reviewer']=process.argv.slice(2);const password=process.env.EGFF_NEW_PASSWORD;
if(!username||!['admin','reviewer'].includes(role)||!password||password.length<14)throw Error('Usage: EGFF_NEW_PASSWORD=<strong password> node server/create-user.mjs <username> <admin|reviewer>. At least 14 characters required.');
const path=resolve(process.env.STAFF_USERS_FILE||'data/staff-users.json');mkdirSync(dirname(path),{recursive:true,mode:0o700});const users=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):[];if(users.some(u=>u.username===username))throw Error('Account already exists; edit through the secured administration process.');const salt=randomBytes(24).toString('hex');users.push({username,role,salt,hash:scryptSync(password,salt,64).toString('hex')});writeFileSync(path,JSON.stringify(users,null,2)+'\n',{mode:0o600});console.log('Account created. No plaintext password stored.');
