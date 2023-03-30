import fs from "fs";
import { join } from "path";

import { For } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import ffprobe from "ffprobe";
import which from "which";

import { Video } from "~/data/model";
import { replaceMovies } from "~/data/utils";
import settings from "~/settings";


export function routeData() {
  return createServerData$(async () => {
    const videoFiles: Video[] = [];
    try {
      const files = await fs.promises.readdir(settings.VIDEO_FOLDER);
      for (const file of files) {
        const filePath = join(settings.VIDEO_FOLDER, file);
        const probe = await ffprobe(
          filePath, { path: await which('ffprobe') }
        );
        videoFiles.push({
          name: file,
          duration: parseFloat(probe.streams[0].duration),
          path: filePath,
        });
      };
    } catch (err) {
      console.error(err);
    }
    replaceMovies(videoFiles);
    return videoFiles;
  });
}

export default function RefreshVideoView() {
  const myVideos = useRouteData<typeof routeData>();
  return (
    <ul>
      <For each={myVideos()}>{(video) => <li>{video.name} - {video.duration}</li>}</For>
    </ul>
  );
}
