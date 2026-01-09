/**
 * CLI wrapper for docker-compose command
 */
import { DockerComposeOptions } from "@baseline/core/commands";
export declare function dockerComposeCommand(subcommand: "up" | "down" | "start" | "stop" | "ps" | "logs", options?: DockerComposeOptions): Promise<void>;
//# sourceMappingURL=docker-compose.d.ts.map