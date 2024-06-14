import type { PlaygroundWorkerEndpoint } from './worker-thread';
import type { WebClientMixin } from './playground-client';
export declare const workerUrl: string;
export declare const serviceWorkerUrl: URL;
export declare function bootPlaygroundRemote(): Promise<import('../../../../php-wasm/web/src/index.ts').PublicAPI<WebClientMixin, import('../../../../php-wasm/web/src/index.ts').RemoteAPI<PlaygroundWorkerEndpoint>>>;
