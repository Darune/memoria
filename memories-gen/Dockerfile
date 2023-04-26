FROM node:lts

ENV SRC_MUSIC_FOLDER=/src_sounds/
ENV SRC_VIDEO_FOLDER=/src_videos/
ENV MUSIC_FOLDER=/sounds/
ENV VIDEO_FOLDER=/videos/
ENV COPY_VIDEOS=1

# build
RUN apt update && apt install -y ffmpeg sqlite3
RUN npm install -g pnpm
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY pnpm-lock.yaml /usr/src/app/
COPY patches/ /usr/src/app/patches/
RUN pnpm install
COPY . /usr/src/app
RUN mkdir /videos/
RUN mkdir /sounds/
RUN mkdir /src_videos/
RUN mkdir /src_sounds/
RUN pnpm run build
RUN rm db/database.sqlite

EXPOSE 3000
CMD ./docker-entry-point.sh