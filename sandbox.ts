import { resolve } from 'path';
import * as StreamZip from 'node-stream-zip';
import * as xml from 'fast-xml-parser';
import {validationOptionsOptional} from "fast-xml-parser";
import {AndroidMetadata, Device, IOSMetadata} from "./types";
import * as xml2js from 'xml2js'

const BinaryXML = require('binary-xml');

function parseData(device: Device, xmlData: string | Buffer, validationOptions?: validationOptionsOptional | boolean): IOSMetadata | AndroidMetadata {
    const xmlParser = new xml.XMLParser();
    const parsedData = xmlParser.parse(xmlData);

    if (device == 'ios') {
        const {key: keys, string: values} = parsedData.plist.dict;
        return Object.fromEntries(keys.map((key: string, i: number) => [key, values[i]]))
    }

    const reader = new BinaryXML(xmlData);
    return reader.parse(xmlData) as AndroidMetadata;
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
    // const ios = resolve(process.cwd(), 'demo-applications', 'ios.ipa');
    // const data = await getApplicationMetadata(ios, 'ios');

    const android = resolve(process.cwd(), 'demo-applications', 'android.apk');
    const data = await getApplicationMetadata(android, 'android')

    console.log(data);
})();