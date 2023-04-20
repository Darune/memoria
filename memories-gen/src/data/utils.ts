import Database from "better-sqlite3";
import settings from "~/settings";
import { join } from "path";
import { Clip, Audio } from "./model";


export function getDatabase() {
  let db;
  try {
    db = new Database(
      join(settings.APP_ROJECT_DIR, "db/database.sqlite"),
    );
  } catch (e) {
    console.log(e);
  }
  db.prepare('CREATE TABLE IF NOT EXISTS AvailableClips(name TEXT, duration REAL, path TEXT);').run();
  db.prepare('CREATE TABLE IF NOT EXISTS AvailableSounds(name TEXT, path TEXT);').run();
  return db
}


export function replaceClips(clips: Clip[]) {
  const db = getDatabase();
  db.prepare('DELETE FROM AvailableClips;').run();
  let placeholders = clips.map((clip) => '(?, ?, ?)').join(',');
  let sql = 'INSERT INTO AvailableClips(name, duration, path) VALUES ' + placeholders;
  db.prepare(sql).run(...clips.flatMap((clip) => [clip.name, clip.duration, clip.path]));
}

export function getClipFilePath(videoName: string) : Clip {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableClips WHERE name == ?";
  const row = db.prepare(sql).get(videoName);
  return new Clip(row.name, row.duration, row.path);
}

export function getAllClips() : Array<Clip> {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableClips";
  const rows = db.prepare(sql).all();
  const clips = new Array<Clip>()
  for (const row of rows) {
    clips.push(new Clip(row.name, row.duration, row.path, `/api/clip/${row.name}`));
  }
  return clips;
}


export function getAllMusics() : Array<Audio> {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableSounds";
  const rows = db.prepare(sql).all();
  const musics = new Array<Audio>()
  for (const row of rows) {
    musics.push(new Audio(row.name, row.path));
  }
  return musics;
}

export function replaceAllMusics(musics: Audio[]) {
  const db = getDatabase();
  db.prepare('DELETE FROM AvailableSounds;').run();
  let placeholders = musics.map((music) => '(?, ?)').join(',');
  let sql = 'INSERT INTO AvailableSounds(name, path) VALUES ' + placeholders;
  db.prepare(sql).run(...musics.flatMap((music) => [music.name, music.path]));
}

export function getMusicFilePath(musicName: string) : Audio {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableSounds WHERE name == ?";

  const row = db.prepare(sql).get(musicName);
  return new Audio(row.name, row.path);
}

export function getRandomInt(max: number) : number {
  return Math.floor(Math.random() * max);
}