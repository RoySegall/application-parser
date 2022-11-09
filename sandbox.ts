import { resolve } from 'path';
import {getApplicationMetadata} from "./src";

(async () => {
    const android = resolve(process.cwd(), 'testing', 'demo-applications', 'lemonade.apk');

    const androidData = await getApplicationMetadata(android, 'android')

    console.log({ androidData});
})();