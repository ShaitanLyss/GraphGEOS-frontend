// import fs module
import * as fs from 'fs';
// import path module
import * as path from 'path';

/// Recursive search on files and directories and apply a callack on each file
/// @param dir Directory to search
/// @param filelist List of files
/// @returns List of files
export function walkSync(dir: string, prefix: string, filelist: string[]): string[] {
	const files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			filelist = walkSync(path.join(dir, file), path.join(prefix, file), filelist);
		} else {
			filelist.push((path.join(prefix, file)));
		}
	});
	return filelist;
}

export function searchFilesRecursive(
	directory: string,
	callback: (filePath: string) => void
): void {
	fs.readdir(directory, (error, files) => {
		if (error) {
			console.error(`Error reading directory: ${directory}`, error);
			return;
		}

		files.forEach((file) => {
			const filePath = path.join(directory, file);

			fs.stat(filePath, (error, stats) => {
				if (error) {
					console.error(`Error retrieving stats for file: ${filePath}`, error);
					return;
				}

				if (stats.isDirectory()) {
					searchFilesRecursive(filePath, callback);
				} else if (stats.isFile()) {
					if (path.parse(file).name.endsWith('Node')) {
						callback(filePath);
					}
				}
			});
		});
	});
}

// walkSync("src/rete/node", []).forEach((file) => {console.log(file)});
