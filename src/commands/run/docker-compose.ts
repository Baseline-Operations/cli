/**
 * CLI wrapper for docker-compose command
 */
import { dockerCompose, DockerComposeOptions } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function dockerComposeCommand(
	subcommand: "up" | "down" | "start" | "stop" | "ps" | "logs",
	options: DockerComposeOptions = {}
): Promise<void> {
	await wrapCommand(
		`Docker Compose: ${subcommand}`,
		() => dockerCompose(subcommand, options)
	);
}

