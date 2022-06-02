const fs = require('fs');
const fse = require('fs-extra');

import { ArrayUtils } from './ArrayUtils';


export class FileSystem {
  async deleteFile(filePath: string) {
    fs.unlink(filePath, (err: any) => {
      //if (err) throw err;

    });
  }

  async deleteFolder(folderPath: string) {
    fs.rmdir(folderPath, { recursive: false }, (err: any) => {
      //if (err) throw err;

    });
  }

  static readFileSync(filePath: string) {
    return fs.readFileSync(filePath, (er: any) => {
      //if (err) throw err;

    });
  }

  static deleteFolderRecursivelySync(folderPath: string) {
    fs.rmdirSync(folderPath, { recursive: true }, (err: any) => {
      //if (err) throw err;

    });
  }

  static fileExistsSync(filePath: string) {
    return fs.existsSync(filePath);
  }

  static async deleteFolderRecursively(folderPath: string) {
    fs.rmdir(folderPath, { recursive: true }, (err: any) => {
      //if (err) throw err;

    });
  }

  static deleteAllFilesInFolder(folderPath: string) {
    fse.emptyDirSync(folderPath);
  }

  async createFolder(folderPath: string) {

    fs.mkdir(folderPath, { recursive: false }, (err: any) => {
      //if (err) throw new Error(err);
    });
  }

  async createFolderRecursively(folderPath: string) {
    fs.mkdir(folderPath, { recursive: true }, (err: any) => {
      //if (err) throw err;
    });
  }

  static createFolderRecursivelySync(folderPath: string) {
    fs.mkdirSync(folderPath, { recursive: true });

  }

  async renameFile(srcFile: string, tgtFile: string) {
    fs.rename(srcFile, tgtFile, (err: any) => {
      //if (err) throw err;

    });
  }

  static getFiles(folderPath: string) {
    const lf = fs.readdirSync(folderPath);
    const files = ArrayUtils.removeNullAndUndefinedElements(lf);

    return files;
  }
}
