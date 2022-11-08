import {AndroidMetadata, Device, IOSMetadata} from "../types";
import {validationOptionsOptional} from "fast-xml-parser";
import * as BinaryXML from 'binary-xml';
import * as xml from "fast-xml-parser";
import * as StreamZip from "node-stream-zip";

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

export default async function getApplicationMetadata(path: string, device: Device): Promise<IOSMetadata | AndroidMetadata> {
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