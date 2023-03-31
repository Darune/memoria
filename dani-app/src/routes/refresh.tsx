import fs from "fs";
import { join } from "path";

import { For } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import ffprobe from "ffprobe";
import which from "which";

import { Clip } from "~/data/model";
import { replaceClips } from "~/data/utils";
import settings from "~/settings";


export function routeData() {
  return createServerData$(async () => {
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
          duration: parseFloat(probe.streams[0].duration),
          path: filePath,
        });
      };
    } catch (err) {
      console.error(err);
    }
    replaceClips(clips);
    return clips;
  });
}

export default function RefreshClipsView() {
  const clips = useRouteData<typeof routeData>();
  return (
    <ul>
      <For each={clips()}>{(clip) => <li>{clip.name} - {clip.duration}</li>}</For>
    </ul>
  );
}
