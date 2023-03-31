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
    db.get(sql, [videoName], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row as Clip);
    });
    db.close();
  });
}