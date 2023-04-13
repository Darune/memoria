import { APIEvent, json } from "solid-start/api";
import { getAllClips, getAllMusics } from "~/data/utils";
import generate from "~/generator/generate";
import fs from 'fs';

export async function GET({ params }: APIEvent) {
  const dbClips = await getAllClips();
  const dbMusics = await getAllMusics();
  const memory = generate(dbClips, dbMusics);
  return json(memory);
}