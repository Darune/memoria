FROM node:lts

# build
RUN apt update && apt install -y ffmpeg sqlite3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
# RUN npm run build
# start
# EXPOSE 8443
EXPOSE 3000
CMD npm run dev