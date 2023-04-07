import { APIEvent } from "solid-start/api";
import { getClipFilePath  } from "~/data/utils";

import { promisify } from 'util';
import fs from 'fs';
const fileInfo = promisify(fs.stat)

export async function GET({ request, params }: APIEvent) {
  const range = request.headers.range;
  const clip = await getClipFilePath(params.clipId);
  const { size: clipSize } = await fileInfo(clip.path);


  if (range) {
    /** Extracting Start and End value from Range Header */
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : clipSize - 1;

    if (!isNaN(start) && isNaN(end)) {
      start = start;
      end = clipSize - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
      start = clipSize - end;
      end = clipSize - 1;
    }

    // Handle unavailable range request
    if (start >= clipSize || end >= clipSize) {
      // Return the 416 Range Not Satisfiable.
      new Response()
      return new Response("", {
        headers: {
          "Content-Range": `bytes */${clipSize}`
        },
        status: 416
      } )
    }

    let readable = fs.createReadStream(clip.path, { start: start, end: end });
    return new Response(
      readable, {
        headers: {
          "Content-Range": `bytes ${start}-${end}/${clipSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": end - start + 1,
          "Content-Type": "video/mp4"
        },
        status: 206,
      },
    )
  } else {
    let readable = fs.createReadStream(clip.path);
    return new Response(
      readable, {
        headers: {
          "Content-Length": clipSize,
          "Content-Type": "video/mp4",
          "Content-Range": `bytes 0-${clipSize-1}/${clipSize}`,
        },
        status: 206,
      },
    );
  }
}