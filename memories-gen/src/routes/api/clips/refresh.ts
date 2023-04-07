import fs from 'fs';
import { join } from "path";

import { APIEvent, json } from "solid-start/api";
import { getClipFilePath  } from "~/data/utils";
import ffprobe from "ffprobe";
import which from "which";

import { Clip } from "~/data/model";
import { replaceClips } from "~/data/utils";
import settings from "~/settings";


export async function GET({ params }: APIEvent) {
  const clips: Clip[] = [];
  try {
    const files = await fs.promises.readdir(settings.VIDEO_FOLDER);
    for (const file of files) {
      const filePath = join(settings.VIDEO_FOLDER, file);
      const probe = await ffprobe(
        filePath, { path: await which('ffprobe') }
      );
      clips.push({
        name: file,
        duration: probe.streams[0].duration || 0,
        path: filePath,
      });
    };
  } catch (err) {
    console.error(err);
  }
  replaceClips(clips);
  console.log(clips);
  return json(clips);
}