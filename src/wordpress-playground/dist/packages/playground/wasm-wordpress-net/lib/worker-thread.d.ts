import { SyncProgressCallback } from '../../../../php-wasm/web/src/index.ts';
import { EmscriptenDownloadMonitor } from '../../../../php-wasm/progress/src/index.ts';
import { BindOpfsOptions } from './opfs/bind-opfs';
import { FilesystemOperation } from '../../../../php-wasm/fs-journal/src/index.ts';
import { PHPWorker } from '../../../../php-wasm/universal/src/index.ts';
/** @inheritDoc PHPClient */
export declare class PlaygroundWorkerEndpoint extends PHPWorker {
    /**
     * A string representing the scope of the Playground instance.
     */
    scope: string;
    /**
     * A string representing the version of WordPress being used.
     */
    wordPressVersion: string;
    constructor(monitor: EmscriptenDownloadMonitor, scope: string, wordPressVersion: string);
    /**
     * @returns WordPress module details, including the static assets directory and default theme.
     */
    getWordPressModuleDetails(): Promise<{
        majorVersion: string;
        staticAssetsDirectory: string;
    }>;
    getSupportedWordPressVersions(): Promise<{
        all: {
            nightly: string;
            beta: string;
            "6.5": string;
            "6.4": string;
            "6.3": string;
            "6.2": string;
        };
        latest: string;
    }>;
    resetVirtualOpfs(): Promise<void>;
    reloadFilesFromOpfs(): Promise<void>;
    bindOpfs(options: Omit<BindOpfsOptions, 'php' | 'onProgress'>, onProgress?: SyncProgressCallback): Promise<void>;
    journalFSEvents(root: string, callback: (op: FilesystemOperation) => void): Promise<() => any>;
    replayFSJournal(events: FilesystemOperation[]): Promise<void>;
}
