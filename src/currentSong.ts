import { readFileSync } from "fs";
import { resolve } from "path";
import execa from "execa";

export type PlayerStatus = "Playing" | "Paused" | "Off" | "Stopped";

export interface IAppleMusicData {
    type: PlayerStatus;
    name: string;
    artist: string;
    album: string;
    duration: number;
    position: number;
}

/**
 * Runs the `./lib/get_current_song.js` file through Apple Script to get
 * the current state and track from Apple Music and falls back iTunes
 * @returns Current Track Information
 */
export const current_song = async (): Promise<IAppleMusicData> => {
    const get_current_song = readFileSync(
        resolve(__dirname, "./../lib/get_current_song.js"),
        "utf8"
    );

    const { stdout } = await execa("osascript", ["-l", "JavaScript", "-e", get_current_song]);

    return JSON.parse(stdout) as IAppleMusicData;
};
