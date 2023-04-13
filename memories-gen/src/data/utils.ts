import sqlite3 from "sqlite3";
import settings from "~/settings";
import { join } from "path";
import { Clip, Audio } from "./model";


export function getDatabase() {
  let db = new sqlite3.Database(
    join(settings.APP_ROJECT_DIR, "db/database.sqlite"),
    (err) => {
      if (err) {
        console.error('create', err.message);
      }
    },
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS AvailableClips(name TEXT, duration REAL, path TEXT);',
    (err) => {if (err) { console.log(err);}}
  );

  db.run(
    'CREATE TABLE IF NOT EXISTS AvailableSounds(name TEXT, path TEXT);',
    (err) => {if (err) { console.log(err);}}
  );

  return db
}


export function replaceClips(clips: Clip[]) {
  const db = getDatabase();
  db.run('DELETE FROM AvailableClips;', (err) => {if (err) {console.log(err);}});
  let placeholders = clips.map((clip) => '(?, ?, ?)').join(',');
  let sql = 'INSERT INTO AvailableClips(name, duration, path) VALUES ' + placeholders;
  db.run(
    sql,
    clips.flatMap((clip) => [clip.name, clip.duration, clip.path]),
    (err) => {
    if (err) {
      return console.error('query ', err.message);
    }
  });
  db.close();
}

export function getClipFilePath(videoName: string) : Promise<Clip> {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableClips WHERE name == ?";
  return new Promise((resolve, reject) => {
    db.get(sql, [videoName], (err, row: {name: string, duration: number, path: string}) => {
      if (err) {
        reject(err);
      }
      resolve(new Clip(row.name, row.duration, row.path));
    });
    db.close();
  });
}

export function getAllClips() : Promise<Array<Clip>> {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableClips";
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows: Array<{name: string, duration: number, path: string}>) => {
      if (err) {
        reject(err);
      }
      const clips = new Array<Clip>()
      for (const row of rows) {
        clips.push(new Clip(row.name, row.duration, row.path, `/api/clip/${row.name}`));
      }
      resolve(clips);
    });
    db.close();
  });
}


export function getAllMusics() : Promise<Array<Audio>> {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableSounds";
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows: Array<{name: string, duration: number, path: string}>) => {
      if (err) {
        reject(err);
      }
      const musics = new Array<Audio>()
      for (const row of rows) {
        musics.push(new Audio(row.name, row.path));
      }
      resolve(musics);
    });
    db.close();
  });
}

export function replaceAllMusics(musics: Audio[]) {
  const db = getDatabase();
  db.run('DELETE FROM AvailableSounds;', (err) => {if (err) {console.log(err);}});
  let placeholders = musics.map((music) => '(?, ?)').join(',');
  let sql = 'INSERT INTO AvailableSounds(name, path) VALUES ' + placeholders;
  db.run(
    sql,
    musics.flatMap((music) => [music.name, music.path]),
    (err) => {
    if (err) {
      return console.error('query ', err.message);
    }
  });
  db.close();
}

export function getMusicFilePath(musicName: string) : Promise<Audio> {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableSounds WHERE name == ?";
  return new Promise((resolve, reject) => {
    db.get(sql, [musicName], (err, row: {name: string, path: string}) => {
      if (err) {
        reject(err);
      }
      resolve(new Audio(row.name, row.path));
    });
    db.close();
  });
}

export function getRandomInt(max: number) : number {
  return Math.floor(Math.random() * max);
}