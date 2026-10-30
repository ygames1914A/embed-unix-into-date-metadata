import { readdir } from "node:fs/promises";
import { exiftool } from "exiftool-vendored";
import { setTimeout } from "node:timers/promises";
import path from "node:path";
import process from "node:process";
import commandLineArgs from "command-line-args";

//  const directory = "/mnt/new/nepic";

const optionDefinitions = [
  { name: "src", type: String, multiple: true, defaultOption: true },
  { name: "whatsapp", alias: "w", type: Boolean },
];

const args = commandLineArgs(optionDefinitions);

if (!args.src) {
  console.log("src doesn't exist");
  process.exit(1);
}

// const exiftool = new ExifTool({
//     exiftoolPath: "exiftool",
// });

const exifExistanceCheck = async () => {
  const version = exiftool.version();

  await setTimeout(1000);

  if (!version) {
    process.exit(1);
  }
  return version;
};

async function multipleSourceHelper() {
  try {
    const data = await Promise.all(
      args.src.map(async (directory) => {
        const data = await readdir(directory);
        // console.log(await readdir(directory))
        const out = data.map((item) => path.join(directory, item));

        return out;
      }),
    );

    const parsed = data.flat(1);

    // const dataPlusDirectory = path.join(args.src[0],data)
    // console.log(parsed);
    return parsed;
  } catch (error) {
    console.log(error);
  }
}

async function unixParser() {
  try {
    const versionCheckValue = await exifExistanceCheck();
    console.log(versionCheckValue);

    // file = ['/path/to/file1','/path/to/file2']
    const files = await multipleSourceHelper();
    const date = new Date(parseInt(files[0]) * 1000);

    for (let i = 0; i < files.length; i++) {
      // files[i] = /path/to/photos
      // path.basename used to get the filename only
      const element = path.basename(files[i]);
      const elemetUnix = element
        .split(".")[0]
        .split(" ")[0]
        .split("_")[0]
        .split("(")[0];
      const elementFileLength = elemetUnix.length;
      const multiPlier = elementFileLength === 13 ? 1 : 1000;
      // console.log(elemetUnix)

      if (!/^\d+$/.test(elemetUnix)) {
        console.log(`${element} doesn't have a unix timestamp as it's name`);
        continue;
      }

      if (elementFileLength !== 13 && elementFileLength !== 10) {
        console.log(`${element} name length not 13 or 10`);
        continue;
      }

      const date = new Date(parseInt(elemetUnix) * multiPlier);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const exifDateStr = `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
      //   console.log(exifDateStr);

      await exiftool.write(files[i], {
        DateTimeOriginal: exifDateStr,
        CreateDate: exifDateStr,
      });
      //console.log("ExifTool version:", await exiftool.version());
      // console.log(element);
      console.log(files[i]);
    }

    console.log("success");
  } catch (error) {
    console.log(error);
  } finally {
    await exiftool.end();
  }
}

unixParser();
