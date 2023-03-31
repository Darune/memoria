import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const file_dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROJECT_DIR = dirname(file_dirname)
const REPO_ROJECT_DIR = dirname(APP_ROJECT_DIR)

export default {
    REPO_ROJECT_DIR: REPO_ROJECT_DIR,
    APP_ROJECT_DIR: APP_ROJECT_DIR,
    VIDEO_FOLDER: process.env.VIDEO_FOLDER || join(REPO_ROJECT_DIR, 'sample_videos'),
}