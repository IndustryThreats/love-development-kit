import type { PathLike } from "fs";

interface ProjectData {
	name: string;
	luaversion: string;
	luarocks: boolean;
	path: PathLike;
};
