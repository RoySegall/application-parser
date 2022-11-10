import {getApplicationMetadata} from "./src";

type Attribute = {
    namespaceURI: string,
    nodeType: number,
    nodeName: string,
    name: string,
    value: any,
    typedValue: {
        value: number, type: string, rawType: number
    }
}
type ChildNode = {
    namespaceURI: string,
    nodeType: number,
    nodeName: string,
    attributes: Attribute[],
    childNodes: ChildChildNode[]
}

type ChildChildNode = {
    namespaceURI: string,
    nodeType: number,
    nodeName: string,
    attributes: Attribute[],
    childNodes: ChildNode[]
};

function getObjectFromAttributes(attributes: Attribute[]) {
    const xmlAttributeAndValuePairs = Object.values(attributes);
    const keyValuePairs = xmlAttributeAndValuePairs.map((attribute) => [attribute.name, attribute.typedValue.value]);
    return Object.fromEntries(keyValuePairs)
}

function processApplicationNamespace(childNodes: ChildNode[]) {
    const data = {};

    childNodes.forEach(childNode => {
        if (!Object.keys(data).includes(childNode.nodeName)) {
            data[childNode.nodeName] = [];
        }

        data[childNode.nodeName].push(getObjectFromAttributes(childNode.attributes))

        if (childNode.childNodes) {
            const innerData = processApplicationNamespace(childNode.childNodes);
            if (Object.keys(innerData).length) {
                data[childNode.nodeName].push(innerData)
            }
        }
    });

    return data;
}

function processChildNode(childNode: ChildNode, data: object) {
    if (childNode.attributes) {
        if (childNode.nodeName === 'uses-sdk') {
            data['uses-sdk'] = getObjectFromAttributes(childNode.attributes);
        }

        if (childNode.nodeName === 'uses-permission') {
            data['uses-permission'].push(getObjectFromAttributes(childNode.attributes).name);
        }

        if (childNode.nodeName === 'uses-feature') {
            data['uses-feature'].push(getObjectFromAttributes(childNode.attributes).name);
        }

        if (childNode.nodeName == 'application') {
            data['application'] = getObjectFromAttributes(childNode.attributes);
            data['applicationChildNodes'] = processApplicationNamespace(childNode.childNodes);
        }
    }
}

type AndroidManifestData = {namespaceURI: string, nodeType: number, nodeName: string, childNodes: ChildNode[], attributes: Attribute[]};

function parseAndroidManifestData(parsedData: AndroidManifestData) {
    const data = {
        'uses-sdk': {},
        'uses-permission': [],
        'uses-feature': [],
        'application': [],
    };
    parsedData.childNodes.forEach((childNode: ChildNode) => {
        processChildNode(childNode, data)
    });

    return {
        ...getObjectFromAttributes(parsedData.attributes),
        ...data
    };
}

(async () => {
    const parsedData: any = {
        "namespaceURI": null,
        "nodeType": 1,
        "nodeName": "manifest",
        "attributes": [
            {
                "namespaceURI": "http://schemas.android.com/apk/res/android",
                "nodeType": 2,
                "nodeName": "versionCode",
                "name": "versionCode",
                "value": null,
                "typedValue": {
                    "value": 20,
                    "type": "int_dec",
                    "rawType": 16
                }
            },
            {
                "namespaceURI": "http://schemas.android.com/apk/res/android",
                "nodeType": 2,
                "nodeName": "versionName",
                "name": "versionName",
                "value": "2.3.0",
                "typedValue": {
                    "value": "2.3.0",
                    "type": "string",
                    "rawType": 3
                }
            },
            {
                "namespaceURI": "http://schemas.android.com/apk/res/android",
                "nodeType": 2,
                "nodeName": "compileSdkVersion",
                "name": "compileSdkVersion",
                "value": null,
                "typedValue": {
                    "value": 28,
                    "type": "int_dec",
                    "rawType": 16
                }
            },
            {
                "namespaceURI": "http://schemas.android.com/apk/res/android",
                "nodeType": 2,
                "nodeName": "compileSdkVersionCodename",
                "name": "compileSdkVersionCodename",
                "value": "9",
                "typedValue": {
                    "value": "9",
                    "type": "string",
                    "rawType": 3
                }
            },
            {
                "namespaceURI": null,
                "nodeType": 2,
                "nodeName": "package",
                "name": "package",
                "value": "com.swaglabsmobileapp",
                "typedValue": {
                    "value": "com.swaglabsmobileapp",
                    "type": "string",
                    "rawType": 3
                }
            },
            {
                "namespaceURI": null,
                "nodeType": 2,
                "nodeName": "platformBuildVersionCode",
                "name": "platformBuildVersionCode",
                "value": null,
                "typedValue": {
                    "value": 28,
                    "type": "int_dec",
                    "rawType": 16
                }
            },
            {
                "namespaceURI": null,
                "nodeType": 2,
                "nodeName": "platformBuildVersionName",
                "name": "platformBuildVersionName",
                "value": null,
                "typedValue": {
                    "value": 9,
                    "type": "int_dec",
                    "rawType": 16
                }
            }
        ],
        "childNodes": [
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-sdk",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "minSdkVersion",
                        "name": "minSdkVersion",
                        "value": null,
                        "typedValue": {
                            "value": 16,
                            "type": "int_dec",
                            "rawType": 16
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "targetSdkVersion",
                        "name": "targetSdkVersion",
                        "value": null,
                        "typedValue": {
                            "value": 28,
                            "type": "int_dec",
                            "rawType": 16
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-permission",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.permission.INTERNET",
                        "typedValue": {
                            "value": "android.permission.INTERNET",
                            "type": "string",
                            "rawType": 3
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-permission",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.permission.CAMERA",
                        "typedValue": {
                            "value": "android.permission.CAMERA",
                            "type": "string",
                            "rawType": 3
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-permission",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.permission.VIBRATE",
                        "typedValue": {
                            "value": "android.permission.VIBRATE",
                            "type": "string",
                            "rawType": 3
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-permission",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.permission.USE_BIOMETRIC",
                        "typedValue": {
                            "value": "android.permission.USE_BIOMETRIC",
                            "type": "string",
                            "rawType": 3
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-permission",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.permission.USE_FINGERPRINT",
                        "typedValue": {
                            "value": "android.permission.USE_FINGERPRINT",
                            "type": "string",
                            "rawType": 3
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-feature",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.hardware.camera",
                        "typedValue": {
                            "value": "android.hardware.camera",
                            "type": "string",
                            "rawType": 3
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "required",
                        "name": "required",
                        "value": null,
                        "typedValue": {
                            "value": false,
                            "type": "boolean",
                            "rawType": 18
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "uses-feature",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "android.hardware.camera.autofocus",
                        "typedValue": {
                            "value": "android.hardware.camera.autofocus",
                            "type": "string",
                            "rawType": 3
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "required",
                        "name": "required",
                        "value": null,
                        "typedValue": {
                            "value": false,
                            "type": "boolean",
                            "rawType": 18
                        }
                    }
                ],
                "childNodes": []
            },
            {
                "namespaceURI": null,
                "nodeType": 1,
                "nodeName": "application",
                "attributes": [
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "theme",
                        "name": "theme",
                        "value": null,
                        "typedValue": {
                            "value": "resourceId:0x7f0f0006",
                            "type": "reference",
                            "rawType": 1
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "label",
                        "name": "label",
                        "value": null,
                        "typedValue": {
                            "value": "resourceId:0x7f0e001d",
                            "type": "reference",
                            "rawType": 1
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "icon",
                        "name": "icon",
                        "value": null,
                        "typedValue": {
                            "value": "resourceId:0x7f0c0001",
                            "type": "reference",
                            "rawType": 1
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "name",
                        "name": "name",
                        "value": "com.swaglabsmobileapp.MainApplication",
                        "typedValue": {
                            "value": "com.swaglabsmobileapp.MainApplication",
                            "type": "string",
                            "rawType": 3
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "allowBackup",
                        "name": "allowBackup",
                        "value": null,
                        "typedValue": {
                            "value": false,
                            "type": "boolean",
                            "rawType": 18
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "roundIcon",
                        "name": "roundIcon",
                        "value": null,
                        "typedValue": {
                            "value": "resourceId:0x7f0c0002",
                            "type": "reference",
                            "rawType": 1
                        }
                    },
                    {
                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                        "nodeType": 2,
                        "nodeName": "appComponentFactory",
                        "name": "appComponentFactory",
                        "value": "androidx.core.app.CoreComponentFactory",
                        "typedValue": {
                            "value": "androidx.core.app.CoreComponentFactory",
                            "type": "string",
                            "rawType": 3
                        }
                    }
                ],
                "childNodes": [
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "activity",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "theme",
                                "name": "theme",
                                "value": null,
                                "typedValue": {
                                    "value": "resourceId:0x7f0f00cc",
                                    "type": "reference",
                                    "rawType": 1
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "label",
                                "name": "label",
                                "value": null,
                                "typedValue": {
                                    "value": "resourceId:0x7f0e001d",
                                    "type": "reference",
                                    "rawType": 1
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "com.swaglabsmobileapp.SplashActivity",
                                "typedValue": {
                                    "value": "com.swaglabsmobileapp.SplashActivity",
                                    "type": "string",
                                    "rawType": 3
                                }
                            }
                        ],
                        "childNodes": [
                            {
                                "namespaceURI": null,
                                "nodeType": 1,
                                "nodeName": "intent-filter",
                                "attributes": [],
                                "childNodes": [
                                    {
                                        "namespaceURI": null,
                                        "nodeType": 1,
                                        "nodeName": "action",
                                        "attributes": [
                                            {
                                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                                "nodeType": 2,
                                                "nodeName": "name",
                                                "name": "name",
                                                "value": "android.intent.action.MAIN",
                                                "typedValue": {
                                                    "value": "android.intent.action.MAIN",
                                                    "type": "string",
                                                    "rawType": 3
                                                }
                                            }
                                        ],
                                        "childNodes": []
                                    },
                                    {
                                        "namespaceURI": null,
                                        "nodeType": 1,
                                        "nodeName": "category",
                                        "attributes": [
                                            {
                                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                                "nodeType": 2,
                                                "nodeName": "name",
                                                "name": "name",
                                                "value": "android.intent.category.LAUNCHER",
                                                "typedValue": {
                                                    "value": "android.intent.category.LAUNCHER",
                                                    "type": "string",
                                                    "rawType": 3
                                                }
                                            }
                                        ],
                                        "childNodes": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "activity",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "label",
                                "name": "label",
                                "value": null,
                                "typedValue": {
                                    "value": "resourceId:0x7f0e001d",
                                    "type": "reference",
                                    "rawType": 1
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "com.swaglabsmobileapp.MainActivity",
                                "typedValue": {
                                    "value": "com.swaglabsmobileapp.MainActivity",
                                    "type": "string",
                                    "rawType": 3
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "exported",
                                "name": "exported",
                                "value": null,
                                "typedValue": {
                                    "value": true,
                                    "type": "boolean",
                                    "rawType": 18
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "launchMode",
                                "name": "launchMode",
                                "value": null,
                                "typedValue": {
                                    "value": 2,
                                    "type": "int_dec",
                                    "rawType": 16
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "screenOrientation",
                                "name": "screenOrientation",
                                "value": null,
                                "typedValue": {
                                    "value": 1,
                                    "type": "int_dec",
                                    "rawType": 16
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "configChanges",
                                "name": "configChanges",
                                "value": null,
                                "typedValue": {
                                    "value": 1200,
                                    "type": "int_hex",
                                    "rawType": 17
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "windowSoftInputMode",
                                "name": "windowSoftInputMode",
                                "value": null,
                                "typedValue": {
                                    "value": 16,
                                    "type": "int_hex",
                                    "rawType": 17
                                }
                            }
                        ],
                        "childNodes": [
                            {
                                "namespaceURI": null,
                                "nodeType": 1,
                                "nodeName": "intent-filter",
                                "attributes": [],
                                "childNodes": [
                                    {
                                        "namespaceURI": null,
                                        "nodeType": 1,
                                        "nodeName": "action",
                                        "attributes": [
                                            {
                                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                                "nodeType": 2,
                                                "nodeName": "name",
                                                "name": "name",
                                                "value": "android.intent.action.VIEW",
                                                "typedValue": {
                                                    "value": "android.intent.action.VIEW",
                                                    "type": "string",
                                                    "rawType": 3
                                                }
                                            }
                                        ],
                                        "childNodes": []
                                    },
                                    {
                                        "namespaceURI": null,
                                        "nodeType": 1,
                                        "nodeName": "category",
                                        "attributes": [
                                            {
                                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                                "nodeType": 2,
                                                "nodeName": "name",
                                                "name": "name",
                                                "value": "android.intent.category.DEFAULT",
                                                "typedValue": {
                                                    "value": "android.intent.category.DEFAULT",
                                                    "type": "string",
                                                    "rawType": 3
                                                }
                                            }
                                        ],
                                        "childNodes": []
                                    },
                                    {
                                        "namespaceURI": null,
                                        "nodeType": 1,
                                        "nodeName": "category",
                                        "attributes": [
                                            {
                                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                                "nodeType": 2,
                                                "nodeName": "name",
                                                "name": "name",
                                                "value": "android.intent.category.BROWSABLE",
                                                "typedValue": {
                                                    "value": "android.intent.category.BROWSABLE",
                                                    "type": "string",
                                                    "rawType": 3
                                                }
                                            }
                                        ],
                                        "childNodes": []
                                    },
                                    {
                                        "namespaceURI": null,
                                        "nodeType": 1,
                                        "nodeName": "data",
                                        "attributes": [
                                            {
                                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                                "nodeType": 2,
                                                "nodeName": "scheme",
                                                "name": "scheme",
                                                "value": "swaglabs",
                                                "typedValue": {
                                                    "value": "swaglabs",
                                                    "type": "string",
                                                    "rawType": 3
                                                }
                                            }
                                        ],
                                        "childNodes": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "activity",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "com.facebook.react.devsupport.DevSettingsActivity",
                                "typedValue": {
                                    "value": "com.facebook.react.devsupport.DevSettingsActivity",
                                    "type": "string",
                                    "rawType": 3
                                }
                            }
                        ],
                        "childNodes": []
                    },
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "provider",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "com.reactnativecommunity.webview.RNCWebViewFileProvider",
                                "typedValue": {
                                    "value": "com.reactnativecommunity.webview.RNCWebViewFileProvider",
                                    "type": "string",
                                    "rawType": 3
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "exported",
                                "name": "exported",
                                "value": null,
                                "typedValue": {
                                    "value": false,
                                    "type": "boolean",
                                    "rawType": 18
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "authorities",
                                "name": "authorities",
                                "value": "com.swaglabsmobileapp.fileprovider",
                                "typedValue": {
                                    "value": "com.swaglabsmobileapp.fileprovider",
                                    "type": "string",
                                    "rawType": 3
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "grantUriPermissions",
                                "name": "grantUriPermissions",
                                "value": null,
                                "typedValue": {
                                    "value": true,
                                    "type": "boolean",
                                    "rawType": 18
                                }
                            }
                        ],
                        "childNodes": [
                            {
                                "namespaceURI": null,
                                "nodeType": 1,
                                "nodeName": "meta-data",
                                "attributes": [
                                    {
                                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                                        "nodeType": 2,
                                        "nodeName": "name",
                                        "name": "name",
                                        "value": "android.support.FILE_PROVIDER_PATHS",
                                        "typedValue": {
                                            "value": "android.support.FILE_PROVIDER_PATHS",
                                            "type": "string",
                                            "rawType": 3
                                        }
                                    },
                                    {
                                        "namespaceURI": "http://schemas.android.com/apk/res/android",
                                        "nodeType": 2,
                                        "nodeName": "resource",
                                        "name": "resource",
                                        "value": null,
                                        "typedValue": {
                                            "value": "resourceId:0x7f110000",
                                            "type": "reference",
                                            "rawType": 1
                                        }
                                    }
                                ],
                                "childNodes": []
                            }
                        ]
                    },
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "activity",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "theme",
                                "name": "theme",
                                "value": null,
                                "typedValue": {
                                    "value": "resourceId:0x7f0f00a7",
                                    "type": "reference",
                                    "rawType": 1
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "androidx.biometric.DeviceCredentialHandlerActivity",
                                "typedValue": {
                                    "value": "androidx.biometric.DeviceCredentialHandlerActivity",
                                    "type": "string",
                                    "rawType": 3
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "exported",
                                "name": "exported",
                                "value": null,
                                "typedValue": {
                                    "value": true,
                                    "type": "boolean",
                                    "rawType": 18
                                }
                            }
                        ],
                        "childNodes": []
                    },
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "activity",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "theme",
                                "name": "theme",
                                "value": null,
                                "typedValue": {
                                    "value": "resourceId:0x1030010",
                                    "type": "reference",
                                    "rawType": 1
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "com.google.android.gms.common.api.GoogleApiActivity",
                                "typedValue": {
                                    "value": "com.google.android.gms.common.api.GoogleApiActivity",
                                    "type": "string",
                                    "rawType": 3
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "exported",
                                "name": "exported",
                                "value": null,
                                "typedValue": {
                                    "value": false,
                                    "type": "boolean",
                                    "rawType": 18
                                }
                            }
                        ],
                        "childNodes": []
                    },
                    {
                        "namespaceURI": null,
                        "nodeType": 1,
                        "nodeName": "meta-data",
                        "attributes": [
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "name",
                                "name": "name",
                                "value": "com.google.android.gms.version",
                                "typedValue": {
                                    "value": "com.google.android.gms.version",
                                    "type": "string",
                                    "rawType": 3
                                }
                            },
                            {
                                "namespaceURI": "http://schemas.android.com/apk/res/android",
                                "nodeType": 2,
                                "nodeName": "value",
                                "name": "value",
                                "value": null,
                                "typedValue": {
                                    "value": "resourceId:0x7f090004",
                                    "type": "reference",
                                    "rawType": 1
                                }
                            }
                        ],
                        "childNodes": []
                    }
                ]
            }
        ]
    };


    console.log(JSON.stringify(parseAndroidManifestData(parsedData)))

})();