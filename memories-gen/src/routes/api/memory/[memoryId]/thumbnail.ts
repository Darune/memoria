import { APIEvent } from "solid-start/api";
import { getMemoryThumbNail } from "~/data/utils";

import { promisify } from 'util';

export function GET({ params }: APIEvent) {
  const imageDataUrl = getMemoryThumbNail(params.memoryId);
  const [type, b64] = imageDataUrl.split(',')
  const contentType = type.replace('data:', '').replace(';base64', '');

  return new Response(
    Buffer.from(b64, 'base64'), {
      headers: {
        "Content-Type": contentType
      }
    }
  );
}