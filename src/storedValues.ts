import { readFileSync, writeFile } from "fs";
import { resolve } from "path";
import { homedir } from "os";

export interface IStoredValues {
    sleep: string;
    slackToken: string;
    dryRun: boolean;
    verbose: boolean;
}

/**
 * The Location of the Stored Values
 */
const storedFileName = resolve(homedir(), ".currentSongToSlack");

/**
 * Get the Saved Settings from File
 * @returns the Stored Settings
 */
export const getStoredValues = async () => {
    let values: Partial<IStoredValues> = {};

    try {
        const data = readFileSync(storedFileName, "utf8");
        values = JSON.parse(data);
    } catch (error) {
        if (error instanceof Error) {
            if (new RegExp("no such file or directory", "i").test(error.message)) {
                console.error(`File Not Found: ${storedFileName}`);
            } else {
                // Assume somethign is horribly wrong and throw...
                throw error;
            }
        } else {
            throw error;
        }
    }

    return values;
};

/**
 * Save the Current Settings to File
 * @param data Data to Set
 * @returns
 */
export const setStoredValues = (data: IStoredValues): Promise<void> =>
    new Promise((resolve, reject) => {
        writeFile(
            storedFileName,
            JSON.stringify(data, null, "  "),
            {
                encoding: "utf8",
                flag: "w"
            },
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
