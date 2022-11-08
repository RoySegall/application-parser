export type Device = 'ios' | 'android';

export interface IOSMetadata {
    DTCompiler: string;
    UIRequiredDeviceCapabilities: number;
    CFBundleInfoDictionaryVersion: number;
    DTPlatformVersion: string;
    CFBundleName: string;
    DTSDKName: string;
    UIViewControllerBasedStatusBarAppearance: string;
    CFBundleIcons: string;
    CFBundleDisplayName: string;
    LSRequiresIPhoneOS: string;
    NSLocationWhenInUseUsageDescription: string;
    DTSDKBuild: string;
    NSCameraUsageDescription: string;
    CFBundleShortVersionString: string;
    CFBundleSupportedPlatforms: string;
    UISupportedInterfaceOrientations: number;
    BuildMachineOSBuild: number;
    DTPlatformBuild: string;
    CFBundlePackageType: string;
    DTXcodeBuild: number;
    CFBundleDevelopmentRegion: string;
    MinimumOSVersion: string;
    CFBundleVersion: string;
    UIAppFonts: string;
    UIDeviceFamily: string;
}

export interface AndroidMetadata {
    versionCode?: any;
    versionName: string;
    compileSdkVersion?: any;
    compileSdkVersionCodename: string;
    package: string;
    platformBuildVersionCode?: any;
    platformBuildVersionName?: any;
}