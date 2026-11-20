const fs = require('fs');
const { execSync } = require('child_process');

// Define your 3 apps here
const apps = [
  { id: 'com.valetax.scalper', name: 'Valetax Scalper', accountId: '581022950' },
  { id: 'com.valetax.swing', name: 'Valetax Swing', accountId: '501148369' },
  { id: 'com.valetax.long', name: 'Valetax LongTerm', accountId: '999999999' }
];

// Create temp build directory
if (!fs.existsSync('build-temp')) fs.mkdirSync('build-temp');

apps.forEach(app => {
  console.log(`\n=========================================`);
  console.log(`🔨 Building ${app.name} (${app.id})`);
  console.log(`=========================================`);

  // 1. Read your original HTML file
  let html = fs.readFileSync('www/index.html', 'utf8');

  // 2. (OPTIONAL) Replace the Account ID so they show different balances.
  // If you want them ALL to show the same balance, comment out this line.
  html = html.replace(/({ id: ')[^']+/, `$1${app.accountId}`);

  // 3. Write the modified HTML to the temp folder
  fs.writeFileSync('build-temp/index.html', html);

  // 4. Set Environment variables for Capacitor
  process.env.CAPACITOR_APP_ID = app.id;
  process.env.CAPACITOR_APP_NAME = app.name;

  // 5. Sync to Android and Build
  try {
    execSync('npx cap sync android', { stdio: 'inherit' });
    execSync('cd android && ./gradlew assembleDebug', { stdio: 'inherit' });

    // 6. Rename the APK so they don't overwrite each other
    const originalApk = 'android/app/build/outputs/apk/debug/app-debug.apk';
    const newApk = `android/app/build/outputs/apk/debug/${app.name.replace(/\s+/g, '_')}.apk`;
    
    if (fs.existsSync(originalApk)) {
      fs.renameSync(originalApk, newApk);
      console.log(`✅ Successfully saved: ${newApk}`);
    }
  } catch (error) {
    console.error(`❌ Build failed for ${app.name}`, error);
  }
});
