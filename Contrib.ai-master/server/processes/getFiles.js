import path from 'node:path';
import fs from 'node:fs/promises';

export async function getFiles(dir) {
    // the fs.readdir() will only read the given folder path. and returns all the files and folders name. but unable to read nested folders so you have to use recursion.
    // note that fs.readdir() will give you folder and file name as an object 
//     {
//   name: 'file1.txt',
//   isFile(): true,
//   isDirectory(): false
// }
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}