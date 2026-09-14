/* Eine Android-Updateversion aus derselben Projektversion wie die Webfassung. */
const fs=require('fs');
const [file,pkg]=process.argv.slice(2);
if(!file||!pkg)throw Error('Aufruf: android-version.cjs build.gradle package.json');
const version=JSON.parse(fs.readFileSync(pkg,'utf8')).version;
if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('Ungültige Projektversion');
const [major,minor,patch]=version.split('.').map(Number);
if(minor>999||patch>99)throw Error('Version außerhalb des vereinbarten Nummernschemas');
const code=major*100000+minor*100+patch;
if(!Number.isSafeInteger(code)||code<1||code>2100000000)throw Error('Android-Versioncode außerhalb des gültigen Bereichs');
const source=fs.readFileSync(file,'utf8');
if(!/versionCode\s+\d+/.test(source)||!/versionName\s+"[^"]*"/.test(source))throw Error('Android-Versionsfelder fehlen');
fs.writeFileSync(file,source.replace(/versionCode\s+\d+/,`versionCode ${code}`).replace(/versionName\s+"[^"]*"/,`versionName "${version}"`));
console.log(`Android: ${version}, versionCode ${code}. App-ID und Signatur bleiben unverändert.`);
