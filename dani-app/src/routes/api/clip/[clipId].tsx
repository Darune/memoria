import { APIEvent, json } from "solid-start/api";
import { getClipFilePath  } from "~/data/utils";
import fs from 'fs';

export async function GET({ params }: APIEvent) {
  const clip = await getClipFilePath(params.clipId);
  const readableStream = fs.createReadStream(clip.path);
  return new Response(
    readableStream, {
      headers: {
        "Content-Type": "video/mp4"
      },
    });
}