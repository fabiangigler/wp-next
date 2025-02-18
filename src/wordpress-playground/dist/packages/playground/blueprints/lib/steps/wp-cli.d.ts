import { PHPResponse } from '../../../../../php-wasm/universal/src/index.ts';
import { StepHandler } from '.';
/**
 * @inheritDoc wpCLI
 * @hasRunnableExample
 * @example
 *
 * <code>
 * {
 * 		"step": "wp-cli",
 * 		"command": "wp post create --post_title='Test post' --post_excerpt='Some content'"
 * }
 * </code>
 */
export interface WPCLIStep {
    /** The step identifier. */
    step: 'wp-cli';
    /** The WP CLI command to run. */
    command: string | string[];
    /** wp-cli.phar path */
    wpCliPath?: string;
}
/**
 * Runs PHP code using [WP-CLI](https://developer.wordpress.org/cli/commands/).
 */
export declare const wpCLI: StepHandler<WPCLIStep, Promise<PHPResponse>>;
/**
 * Naive shell command parser.
 * Ensures that commands like `wp option set blogname "My blog name"` are split into
 * `['wp', 'option', 'set', 'blogname', 'My blog name']` instead of
 * `['wp', 'option', 'set', 'blogname', 'My', 'blog', 'name']`.
 *
 * @param command
 * @returns
 */
export declare function splitShellCommand(command: string): string[];
