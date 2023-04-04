#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$(dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJECT_DIR=$( dirname "${SCRIPT_DIR}")

YDL="yt-dlp"
DEST_FOLDER="${PROJECT_DIR}/sample_videos"

mkdir -p ${DEST_FOLDER}
${YDL} -a ${SCRIPT_DIR}/videos.txt -P ${DEST_FOLDER} -f 134 -o "%(id)s.%(ext)s"