import { readdir } from "node:fs/promises";
import { exiftool } from "exiftool-vendored";
import { program } from "commander";

// const directory = "/mnt/new/nepic";

program.argument("pictures path");
program.parse();
// console.log(program.args)
const directory = program.args;

async function getFiles() {
  try {
    const data = await readdir(directory[0]);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function unixParser() {
  try {
    const files = await getFiles();
    // console.log(files);
    const date = new Date(parseInt(files[0]) * 1000);
    // console.log(files[0].split('.')[0].length)
    // console.log(files[0])
    // console.log(exifDateStr);

    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      const elemetUnix = element.split(".")[0];
      const elementFileLength = elemetUnix.length;
      const multiPlier = elementFileLength === 13 ? 1 : 1000;

      if (!/^\d+$/.test(elemetUnix)) {
        console.log(`${element} doesn't have a unix timestamp as it's name`)
        break;
      }

      if (elementFileLength !== 13 && elementFileLength !== 10) {
        console.log(`${element} name length not 13 or 10`)
        break;
      }

      

      const date = new Date(parseInt(element) * multiPlier);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const exifDateStr = `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
      //   console.log(exifDateStr);

      await exiftool.write(directory + "/" + element, {
        DateTimeOriginal: exifDateStr,
        CreateDate: exifDateStr,
      });

      console.log(element);
    }
    await exiftool.end();
    console.log("success");
  } catch (error) {
    console.log(error);
  }
}

unixParser();

