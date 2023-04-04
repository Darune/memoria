import sqlite3 from "sqlite3";
import settings from "~/settings";
import { join } from "path";
import { Clip } from "./model";


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
        clips.push(new Clip(row.name, row.duration, row.path))
      }
      resolve(clips);
    });
    db.close();
  });
}


export function getRandomInt(max: number) : number {
  return Math.floor(Math.random() * max);
}