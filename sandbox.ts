import { resolve } from 'path';
import * as StreamZip from 'node-stream-zip';
import * as xml from 'fast-xml-parser';
import * as BinaryXML from 'binary-xml';
import {AndroidMetadata, Device, IOSMetadata} from "./types";
import type {validationOptionsOptional} from "fast-xml-parser";

function parseData(device: Device, xmlData: string | Buffer, validationOptions?: validationOptionsOptional | boolean): IOSMetadata | AndroidMetadata {
    const xmlParser = new xml.XMLParser();
    const parsedData = xmlParser.parse(xmlData);

    if (device == 'ios') {
        const {key: keys, string: values} = parsedData.plist.dict;
        return Object.fromEntries(keys.map((key: string, i: number) => [key, values[i]])) as IOSMetadata
    }

    const reader = new BinaryXML(xmlData);
    const data = reader.parse(xmlData);

    const keyValuePairs = Object.values(data.attributes)
        .map((attribute: {name: string, value: string}) => [attribute.name, attribute.value]);
    return Object.fromEntries(keyValuePairs);
}

async function getApplicationMetadata(path: string, device: Device): Promise<IOSMetadata | AndroidMetadata> {
    const zip = new StreamZip.async({ file: path });
    const filesInZip = await zip.entries();

    const pathToMetadata = Object.keys(filesInZip).find(file => file.includes(device === 'ios' ? 'Info.plist' : 'AndroidManifest.xml'))

    if (!pathToMetadata) {
        throw new Error('We could not find the metadata file path');
    }

    const data = await zip.entryData(pathToMetadata);
    await zip.close();

    return parseData(device, data);
}

(async () => {
    const ios = resolve(process.cwd(), 'demo-applications', 'ios.ipa');
    const android = resolve(process.cwd(), 'demo-applications', 'android.apk');

    const iosData = await getApplicationMetadata(ios, 'ios');
    const androidData = await getApplicationMetadata(android, 'android')

    console.log({iosData, androidData});
})();