import { readFile } from "fs/promises";
import { resolve } from "path";
import JSZip from "jszip";
import findFiles from "./findfiles";

/**
 * Adds files from a directory to a zip file
 * @param directory - Directory to add files from
 * @param zip - JSZip instance
 * @param baseDir - Base directory for relative paths
 */
async function bundleFiles(
  directory: string,
  zip: JSZip,
  baseDir?: string
): Promise<void> {
  const files = await findFiles(directory, { basePath: baseDir || process.cwd() });

  // Process all files in parallel
  await Promise.all(
    files.map(async (file) => {
      const buffer = await readFile(baseDir != undefined ? resolve(baseDir, file) : file);
      zip.file(
        file,
        new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
      );
    })
  );
}

export default bundleFiles;
