import { APIEvent, json } from "solid-start/api";
import { getAllClips } from "~/data/utils";
import generate from "~/generator/generate";
import fs from 'fs';

export async function GET({ params }: APIEvent) {
  const dbClips = await getAllClips();
  const memory = generate(dbClips);
  return json(memory);
}