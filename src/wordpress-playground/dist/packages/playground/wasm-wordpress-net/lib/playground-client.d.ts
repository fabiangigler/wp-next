/**
 * Imports required for the Playground Client.
 */
import { ProgressReceiver } from '../../../../php-wasm/progress/src/index.ts';
import { UniversalPHP } from '../../../../php-wasm/universal/src/index.ts';
import { RemoteAPI, SyncProgressCallback } from '../../../../php-wasm/web/src/index.ts';
import { ProgressBarOptions } from './progress-bar';
import type { PlaygroundWorkerEndpoint } from './worker-thread';
import type { BindOpfsOptions } from './opfs/bind-opfs';
export interface WebClientMixin extends ProgressReceiver {
    /**
     * Sets the progress bar options.
     * @param options The progress bar options.
     */
    setProgress(options: ProgressBarOptions): Promise<void>;
    /**
     * Sets the loaded state.
     */
    setLoaded(): Promise<void>;
    /**
     * Sets the navigation event listener.
     * @param fn The function to be called when a navigation event occurs.
     */
    onNavigation(fn: (url: string) => void): Promise<void>;
    /**
     * Navigates to the requested path.
     * @param requestedPath The requested path.
     */
    goTo(requestedPath: string): Promise<void>;
    /**
     * Gets the current URL.
     */
    getCurrentURL(): Promise<string>;
    /**
     * Sets the iframe sandbox flags.
     * @param flags The iframe sandbox flags.
     */
    setIframeSandboxFlags(flags: string[]): Promise<void>;
    /**
     * The onDownloadProgress event listener.
     */
    onDownloadProgress: PlaygroundWorkerEndpoint['onDownloadProgress'];
    journalFSEvents: PlaygroundWorkerEndpoint['journalFSEvents'];
    replayFSJournal: PlaygroundWorkerEndpoint['replayFSJournal'];
    addEventListener: PlaygroundWorkerEndpoint['addEventListener'];
    removeEventListener: PlaygroundWorkerEndpoint['removeEventListener'];
    /** @inheritDoc @php-wasm/universal!UniversalPHP.onMessage */
    onMessage: PlaygroundWorkerEndpoint['onMessage'];
    bindOpfs(options: Omit<BindOpfsOptions, 'php' | 'onProgress'>, onProgress?: SyncProgressCallback): Promise<void>;
}
/**
 * The Playground Client interface.
 */
export interface PlaygroundClient extends RemoteAPI<PlaygroundWorkerEndpoint & WebClientMixin> {
}
export declare const assertion: UniversalPHP;
