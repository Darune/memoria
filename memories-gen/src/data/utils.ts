import Database from "better-sqlite3";
import settings from "~/settings";
import { join } from "path";
import { Clip, Audio, MemoryType, Memory } from "./model";


export function getDatabase() {
  const db = new Database(
    join(settings.APP_ROJECT_DIR, "db/database.sqlite"), {
      nativeBinding:
        "./node_modules/better-sqlite3/build/Release/better_sqlite3.node",
    },
  );
  db.prepare('CREATE TABLE IF NOT EXISTS AvailableClips(name TEXT, duration REAL, path TEXT);').run();
  db.prepare('CREATE TABLE IF NOT EXISTS AvailableSounds(name TEXT, path TEXT);').run();
  db.prepare('CREATE TABLE IF NOT EXISTS ArchivedMemories(id INTEGER PRIMARY KEY AUTOINCREMENT, thumbnail TEXT, memory TEXT);').run();
  return db;
}


export function replaceClips(clips: Clip[]) {
  const db = getDatabase();
  db.prepare('DELETE FROM AvailableClips;').run();
  let placeholders = clips.map((clip) => '(?, ?, ?)').join(',');
  let sql = 'INSERT INTO AvailableClips(name, duration, path) VALUES ' + placeholders;
  db.prepare(sql).run(...clips.flatMap((clip) => [clip.name, clip.duration, clip.path]));
  db.close();
}

export function getClipFilePath(videoName: string) : Clip {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableClips WHERE name == ?";
  const row = db.prepare(sql).get(videoName);
  db.close();
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
  db.close();
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
  db.close();
  return musics;
}

export function replaceAllMusics(musics: Audio[]) {
  const db = getDatabase();
  db.prepare('DELETE FROM AvailableSounds;').run();
  let placeholders = musics.map((music) => '(?, ?)').join(',');
  let sql = 'INSERT INTO AvailableSounds(name, path) VALUES ' + placeholders;
  db.prepare(sql).run(...musics.flatMap((music) => [music.name, music.path]));
  db.close();
}

export function getMusicFilePath(musicName: string) : Audio {
  const db = getDatabase();
  const sql = "SELECT * FROM AvailableSounds WHERE name == ?";

  const row = db.prepare(sql).get(musicName);
  db.close();
  return new Audio(row.name, row.path);
}

export function archiveMemory(memory: MemoryType) {
  const db = getDatabase();
  const id = db.prepare('INSERT into ArchivedMemories(memory, thumbnail) VALUES (?, ?)').run(
    JSON.stringify(memory), memory.thumbnailImage
  );
  // const id = db.prepare('SELECT last_insert_rowid()').run();
  console.log(id);
  return id.lastInsertRowid;
}

export function getAllMemories() : Array<{id: string, name: string}> {
  const db = getDatabase();
  const sql = "SELECT id FROM ArchivedMemories";
  const rows: Array<any> = db.prepare(sql).all();
  const memories = new Array<{id: string, name: string}>();

  for (const row of rows) {
    memories.push({
      id: row.id,
      name: `cecilia ${row.id}`
    })
  }
  db.close();
  return memories;
}

export function getMemory(id: string) : MemoryType {
  const db = getDatabase();
  const sql = "SELECT id, memory FROM ArchivedMemories where id = ?";
  const row: any = db.prepare(sql).get(id);
  db.close();
  return {
    id: row.id,
    name: `cecilia ${row.id}`,
    ...JSON.parse(row.memory),
  };
}

export function getMemoryThumbNail(id: string) : string {
  const db = getDatabase();
  const sql = "SELECT thumbnail FROM ArchivedMemories where id = ?";
  const row = db.prepare(sql).get(id);
  db.close();
  return row.thumbnail;
}

export function getWords(): {videoWords: Array<string>, soundWords: Array<string>} {
  const db = getDatabase();
  const sql = "SELECT name from AvailableClips";
  const videoWords = db.prepare(sql).all().map((row) => row.name);
  const sqlSounds = "SELECT name from AvailableSounds";
  const soundWords = db.prepare(sqlSounds).all().map((row) => row.name);
  return {videoWords, soundWords};
}