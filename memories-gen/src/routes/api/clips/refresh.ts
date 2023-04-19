import fs from 'fs';
import { join } from "path";

import { APIEvent, json } from "solid-start/api";
import { getClipFilePath  } from "~/data/utils";
import ffprobe from "ffprobe";
import which from "which";

import { Clip, Audio } from "~/data/model";
import { replaceClips, replaceAllMusics } from "~/data/utils";
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
        url: `api/clip/${file}`,
      });
    };
  } catch (err) {
    console.error(err);
  }
  replaceClips(clips);
  const music_files = await fs.promises.readdir(settings.MUSIC_FOLDER);
  const musics: Audio[] = [];
  for (const file of music_files) {
    const filePath = join(settings.MUSIC_FOLDER, file);
    musics.push(new Audio(
      file,
      filePath,
    ))
  }
  replaceAllMusics(musics)
  return json({ clips, musics });
}