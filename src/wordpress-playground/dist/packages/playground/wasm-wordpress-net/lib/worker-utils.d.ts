import { PHPProcessManager, SupportedPHPVersion } from '../../../../php-wasm/universal/src/index.ts';
import { EmscriptenDownloadMonitor } from '../../../../php-wasm/progress/src/index.ts';
export type ReceivedStartupOptions = {
    wpVersion?: string;
    phpVersion?: string;
    sapiName?: string;
    storage?: string;
    phpExtensions?: string[];
    siteSlug?: string;
};
export type ParsedStartupOptions = {
    wpVersion: string;
    phpVersion: SupportedPHPVersion;
    sapiName: string;
    storage: string;
    phpExtensions: string[];
    siteSlug: string;
};
export declare const receivedParams: ReceivedStartupOptions;
export declare const requestedWPVersion: string;
export declare const startupOptions: ParsedStartupOptions;
export declare const downloadMonitor: EmscriptenDownloadMonitor;
export declare const monitoredFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export declare const createPhpRuntime: () => Promise<number>;
export declare function spawnHandlerFactory(processManager: PHPProcessManager): any;
