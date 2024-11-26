import { join, relative } from "path";
import { readdir } from "fs/promises";

/**
 * Recursively searches for files in a directory and returns their relative paths
 * @param directory - The directory to search in
 * @param options - Optional configuration
 * @returns Array of relative file paths from the base directory
 */
async function findFiles(
  directory: string,
  options: {
    ignore?: string[];      // Patterns to ignore
    extensions?: string[];  // File extensions to include
    basePath?: string;     // Base path to calculate relative paths from
  } = {}
): Promise<string[]> {
  const results: string[] = [];
  const basePath = options.basePath || process.cwd();
  
  // Helper function to check if a path should be ignored
  const shouldIgnore = (path: string): boolean => {
    if (!options.ignore) return false;
    return options.ignore.some(pattern => {
      if (pattern.startsWith("*")) {
        return path.endsWith(pattern.slice(1));
      }
      return path.includes(pattern);
    });
  };

  // Helper function to check file extension
  const hasValidExtension = (path: string): boolean => {
    if (!options.extensions || options.extensions.length === 0) return true;
    return options.extensions.some(ext => path.endsWith(ext));
  };

  async function scan(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = relative(basePath, fullPath);
      
      if (shouldIgnore(relativePath)) continue;
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && hasValidExtension(entry.name)) {
        results.push(relativePath);
      }
    }
  }

  await scan(directory);
  return results;
}

export default findFiles;