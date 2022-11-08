import { resolve } from 'path';
import getApplicationMetadata from "./src";

(async () => {
    const ios = resolve(process.cwd(), 'testing', 'demo-applications', 'ios.ipa');
    const android = resolve(process.cwd(), 'testing', 'demo-applications', 'android.apk');

    const iosData = await getApplicationMetadata(ios, 'ios');
    const androidData = await getApplicationMetadata(android, 'android')

    console.log({iosData, androidData});
})();