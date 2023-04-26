import { APIEvent } from "solid-start/api";
import { getMusicFilePath  } from "~/data/utils";

import { promisify } from 'util';
import fs from 'fs';
const fileInfo = promisify(fs.stat)

export async function GET({ request, params }: APIEvent) {
  const range = request.headers.get('range');
  const music = getMusicFilePath(params.musicId);
  const { size: musicSize } = await fileInfo(music.path);


  if (range) {
    /** Extracting Start and End value from Range Header */
    let [start, end]: any = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : musicSize - 1;

    if (!isNaN(start) && isNaN(end)) {
      start = start;
      end = musicSize - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
      start = musicSize - end;
      end = musicSize - 1;
    }

    // Handle unavailable range request
    if (start >= musicSize || end >= musicSize) {
      // Return the 416 Range Not Satisfiable.
      new Response()
      return new Response("", {
        headers: {
          "Content-Range": `bytes */${musicSize}`
        },
        status: 416
      } )
    }

    let readable = fs.createReadStream(music.path, { start: start, end: end });
    return new Response(
      readable, {
        headers: {
          "Content-Range": `bytes ${start}-${end}/${musicSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": end - start + 1,
          "Content-Type": "video/mp4"
        },
        status: 206,
      },
    )
  } else {
    let readable = fs.createReadStream(music.path);
    return new Response(
      readable, {
        headers: {
          "Content-Length": musicSize,
          "Content-Type": "video/mp4",
          "Content-Range": `bytes 0-${musicSize-1}/${musicSize}`,
        },
        status: 206,
      },
    );
  }
}