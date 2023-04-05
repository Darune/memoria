import fs from "fs";

import { For } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import ffprobe from "ffprobe";
import which from "which";

import { Clip } from "~/data/model";
import { replaceClips } from "~/data/utils";
import settings from "~/settings";


export function routeData() {
  return createRouteData(async () => {
    const response = await fetch('/api/clips/refresh')
    return response.json();
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
