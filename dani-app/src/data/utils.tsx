import sqlite3 from "sqlite3";
import settings from "~/settings";
import { join } from "path";
import { Video } from "./model";


export function getDatabase() {
  console.log(join(settings.APP_ROJECT_DIR, "db/database.sqlite"));
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
    (err) => console.log(err)
  );
  return db
}


export function replaceMovies(videoFiles: Video[]) {
  const db = getDatabase();
  db.run('DELETE FROM AvailableClips;', (err) => console.log(err));
  let placeholders = videoFiles.map((videoFile) => '(?, ?, ?)').join(',');
  let sql = 'INSERT INTO AvailableClips(name, duration, path) VALUES ' + placeholders;
  db.run(
    sql,
    videoFiles.flatMap((videofile) => [videofile.name, videofile.duration, videofile.path]),
    (err) => {
    if (err) {
      return console.error('query ', err.message);
    }
  });
  db.close();
}