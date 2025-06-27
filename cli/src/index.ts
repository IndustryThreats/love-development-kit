import { program } from "commander";
import fs from "fs";
import path from "path";
import Project from "./project";
import { bundleProject } from "./actions";
import Logger from "./logger";
import chalk from "chalk";

program
	.name("ldk")
	.description("Bundle, test, and distribute LOVE2D games with ease.")
	.version("0.2.1");

	program.command("init")
	.description("Creates an empty LOVE2D project.")
	.argument("<project-name>", "name of the new project")
	.action((projectname) => {
		Bun.spawn(["npx", "--yes", "degit", "Rentless-Garage/ldk-project-template#main", projectname], {
			cwd: process.cwd(),
			env: {...process.env},
			stdout: "ignore",
			onExit(proc, exitCode, signalCode, error) {
				if (proc.exitCode == 0) {
					Logger.info("Created project", `'${projectname}'`, chalk.greenBright("✔"));
				} else {
					Logger.err("Failed to create project, is npm installed?");
				}
			}
		});
	});

program.command("bundle")
	.description("Bundles the current project into a .love file")
	.action(() => {
		fs.readFile(path.resolve(process.cwd(), "ldk.project.json"), (err, data) => {
			if (err) {
				throw err;
			}

			const project = Project.fromString(data.toString());
			bundleProject(project);
		});
	});

program.command("dev")
	.description("Bundles the current project, then runs it.")
	.action(() => {
		fs.readFile(path.resolve(process.cwd(), "ldk.project.json"), (err, data) => {
			if (err) {
				throw err;
			}

			const project = Project.fromString(data.toString());
			bundleProject(project).finally(() => {
				Logger.info("Running", `${project.name}...`, chalk.greenBright("✔"));
				Bun.spawn(["love", `./build/${project.name}.love`], {
					cwd: process.cwd(),
					env: {...process.env},
					stdout: "inherit"
				});
			})
		});
	});

program.parse()
