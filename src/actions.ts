import path from "path";
import Project from "./project";
import JSZip from "jszip";
import fs from "fs";
import fsp from "fs/promises"
import Logger from "./logger";
import chalk from "chalk";
import bundleFiles from "./bundlefiles";
import findFiles from "./findfiles";

/**
 * simple utility function to get the actual path of a file/folder
 * @param name filename
 * @returns resolved path with file/folder
 */
function f(name: string) {
	return path.resolve(process.cwd(), name)
}

export async function bundleProject(project: Project) {
	// create bundle folder
	const bundleFolder = f(".bundle")
	if (fs.existsSync(bundleFolder)) {
		fs.rmSync(bundleFolder, {recursive: true, force: true});
	}

	// create build folder
	const buildFolder = f("build/")
	if (!fs.existsSync(buildFolder)) {
		fs.mkdirSync(buildFolder)
	}

	// create zip file
	const zip = new JSZip();
	zip.folder("assets");

	// check if game.png exists
	const gameIcon = f("game.png");
	if (await fsp.exists(gameIcon)) {
		// write the icon to the zip file
		const contents = await fsp.readFile(gameIcon);
		zip.file("game.png", new Uint8Array(contents.buffer, contents.byteOffset, contents.length));
	}

	// add assets
	await bundleFiles("assets", zip).finally(() => {
		Logger.info("Bundled assets", chalk.greenBright("✔"))
	});

	// add src
	await bundleFiles("src", zip, "./src").finally(() => {
		Logger.info("Bundled src", chalk.greenBright("✔"))
	});

	// add local modules to lib
	const libFolder = f("lib/");
	if (await fsp.exists(libFolder)) {
		const locallibs = await findFiles(f(libFolder));
		if (locallibs.length != -1) {
			zip.folder("lib");
			await Promise.all(
				locallibs.map(async (lib) => {
					const filename = lib.substring(libFolder.length + libFolder.indexOf(libFolder));
					const contents = await fsp.readFile(f(`lib/${filename}`), {encoding: "utf8"});
					zip.file(`lib/${filename}`, contents);
				})
			).finally(() => {
				if (locallibs.length != -1) {
					Logger.info("Bundled local modules", chalk.greenBright("✔"));
				}
			});
		}
	}

	// check if this project uses luarocks
	const luaModulesFolder = f("lua_modules/");
	if (project.luarocks && fs.existsSync(luaModulesFolder)) {
		// add luarocks modules to lib
		zip.folder("lib");
		const modulepath = `lua_modules/share/lua/${project.luaversion}`;
		const files = await findFiles(`${process.cwd()}/${modulepath}/`)
		const fullpath = `${modulepath}/`;

		await Promise.all(
			files.map(async (file) => {
				// get information about the file
				const filename = file.substring(fullpath.length + file.indexOf(fullpath));
				const filepath = `${fullpath}${filename}`;
				const zippath = "lib/" + filename;

				// read its contents, then write it to the zip file
				const content = await fsp.readFile(f(filepath), {encoding: "utf8"});
				zip.file(zippath, content);
			})
		).finally(() => {
			Logger.info("Bundled luarocks modules", chalk.greenBright("✔"));
		});
	} else if (project.luarocks) {
		Logger.warn("Failed to detect luarocks modules.");
	}
	
	// write zip file
	await zip.generateAsync({type: "uint8array", compression: "DEFLATE", compressionOptions: {level: 9}}).then((content) => {
		fs.writeFile(f(`build/${project.name}.love`), content, {}, (err) => {
			if (err) {
				throw err;
			}

			fs.rm(f(".bundle"), {recursive: true, force: true}, (err) => {
				if (err) {
					throw err;
				}
			});
			Logger.info("Done bundling", project.name, chalk.greenBright("✔"));
		});
	});
}
