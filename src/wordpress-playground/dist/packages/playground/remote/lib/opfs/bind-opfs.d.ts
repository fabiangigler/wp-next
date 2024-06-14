/**
 * Uses the FileSystem access API to synchronize MEMFS changes in a compliant
 * filesystem such as OPFS or local filesystem and restore them on page refresh:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 *
 * Many synchronous functions are await-ed here because some browsers did not
 * catch up yet with the latest spec and still return promises.
 */
import { PHP } from '../../../../../php-wasm/universal/src/index.ts';
import { MountOptions, SyncProgressCallback } from '../../../../../php-wasm/web/src/index.ts';
export type BindOpfsOptions = {
    php: PHP;
    opfs: FileSystemDirectoryHandle;
    initialSyncDirection?: MountOptions['initialSync']['direction'];
    onProgress?: SyncProgressCallback;
    mountpoint: string;
};
export declare function bindOpfs({ php, opfs, initialSyncDirection, mountpoint, onProgress, }: BindOpfsOptions): Promise<void>;
export declare function playgroundAvailableInOpfs(opfs: FileSystemDirectoryHandle): Promise<boolean>;
