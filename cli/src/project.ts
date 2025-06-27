import path from "path";
import fs from "fs"
import type { ProjectData } from "./types";

export default class Project {
	public name: string;
	public luaversion: string;
	public luarocks: boolean;
	private path: fs.PathLike;

	constructor(name: string, luaversion: string, luarocks: boolean, path: fs.PathLike) {
		this.name = name;
		this.luaversion = luaversion;
		this.luarocks = luarocks;
		this.path = path;
	}

	/**
	 * fromString
	 * creates a project class with its raw data
	 */
	public static fromString(str: string): Project {
		const data: ProjectData = JSON.parse(str);
		return new Project(data.name, data.luaversion || "5.1", data.luarocks || false, data.path);
	}

	/**
	 * write
	 * saves changes to project and writes them back
	 */
	public write() {
		const data = {
			name: this.name,
			luaversion: this.luaversion,
			luarocks: this.luarocks
		}

		fs.writeFile(this.path, JSON.stringify(data), (err) => {
			if (err) {
				throw err;
			}
		});
	}
}
