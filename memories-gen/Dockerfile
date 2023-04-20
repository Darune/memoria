FROM node:lts

ENV MUSIC_FOLDER=/sounds/
ENV VIDEO_FOLDER=/videos/

# build
RUN apt update && apt install -y ffmpeg sqlite3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN mkdir /videos/
RUN mkdir /sounds/

EXPOSE 3000
CMD npm run dev