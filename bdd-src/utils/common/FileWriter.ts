// const mkdirp = require('mkdirp');
// const fs = require('fs');
// const abs = require('abs');
// const typpy = require('typpy');
// const path = require('path');

// export class FileWriter {
//     /**
//      * FileWriter
//      * Create the directory structure and then create the file.
//      *
//      * @name FileWriter
//      * @function
//      * @param {String} outputPath The path to the file you want to create.
//      * @param {String|Object} data The file content. If an Array/Object is provided, it will be stringified.
//      * @param {Function} cb The callback function.
//      */
//     constructor(outputPath: string, data: string | object, cb: any) {
//       outputPath = abs(outputPath);
//       const dirname = path.dirname(outputPath);
//       mkdirp(dirname, (err: any) => {
//         if (err) {
//           return cb(err);
//         }
//         let str = data;
//         if (typpy(data, Array) || typpy(data, Object)) {
//           str = JSON.stringify(data, null, 2);
//         }
//         fs.writeFile(outputPath, str, (error: any) => cb(error, data));
//       });
//     }
  
    
//     /**
//      * FileWriter.sync
//      * The sync version of the function.
//      *
//      * @name FileWriter.sync
//      * @function
//      * @param {String} outputPath The path to the file you want to create.
//      * @param {String|Object} data The file content. If an Array/Object is provided, it will be stringified.
//      * @param {Boolean} isAppend Specify if file needs to be appended or overwritten
//      * @returns {String|Object} The content written in the file. If an object was provided, the stringified version will *not* be returned but the raw value.
//      */
//     static sync(outputPath: string, data: string | object, isAppend: boolean) {
//       outputPath = abs(outputPath);
//       const dirname = path.dirname(outputPath);
//       mkdirp.sync(dirname);
//       let str = data;
//       if (typpy(data, Array) || typpy(data, Object)) {
//         str = JSON.stringify(data, null, 2);
//       }
//       if (isAppend) fs.appendFileSync(outputPath, str);
//       else fs.writeFileSync(outputPath, str);
//       return data;
//     }
//   }
  