/**
 * CLI wrapper for plugin commands
 */
import { PluginInstallOptions } from "@baseline/core/commands";
export declare function pluginInstallCommand(pluginId: string, options?: PluginInstallOptions): Promise<void>;
export declare function pluginListCommand(options?: {
    workspaceRoot?: string;
}): Promise<void>;
export declare function pluginRemoveCommand(pluginId: string, options?: {
    removeFromConfig?: boolean;
    workspaceRoot?: string;
}): Promise<void>;
export declare function pluginInstallAllCommand(options?: {
    workspaceRoot?: string;
}): Promise<void>;
export declare function pluginSearchCommand(query: string, options?: {
    registry?: boolean;
    workspaceRoot?: string;
}): Promise<void>;
//# sourceMappingURL=plugin.d.ts.map