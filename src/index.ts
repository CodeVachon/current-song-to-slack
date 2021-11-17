import ms from "ms";
import dayjs from "dayjs";
import { EMOJI } from "./emoji";
import { current_song, PlayerStatus } from "./currentSong";
import { setProfileStatus } from "./slackAPI";
import { selectRandom } from "./utl";
import { getStoredValues, setStoredValues, IStoredValues } from "./storedValues";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import figlet from "figlet";
import chalk from "chalk";

/**
 * Time Between Loop Iterations
 */
let sleep = "5s";
/**
 * oAuth Token for Slack
 */
let slackToken = "";
/**
 * Send Data to Slack?
 */
let dryRun = true;
/**
 * Console Log Everything?
 */
let verbose = true;

/**
 * List of Emogis to Randomly Select From
 */
const playingEmojis: EMOJI[] = [EMOJI.HeadPhones, EMOJI.LoudSound, EMOJI.Radio, EMOJI.MusicalNote];

/**
 * The Previous Value of State from Current Song
 */
let previousState: PlayerStatus = "Off";
/**
 * The Previous Status Sent to Slack
 */
let previousStatus: string = "";
/**
 * The Previous Emoji Sent to Slack
 */
let previousEmoji: EMOJI = EMOJI.Mute;

/**
 * Console Log if Verbose is True
 * @param args console output
 * @returns
 */
const verboseLog = (...args: any[]) => (verbose ? console.info(...args) : undefined);

interface IOptions {
    "dry-run": boolean;
    verbose: boolean;
    sleep: string;
    "slack-token": string;
}

/**
 * Get all the Prerun Information
 * @returns
 */
const preRun = (): Promise<void> =>
    new Promise(async (resolve, reject) => {
        console.info();
        console.info();
        console.info(chalk.green(figlet.textSync("Current Song to Slack")));
        console.info();
        console.info();

        const yargsOptions: Record<string, yargs.Options> = {
            "slack-token": {
                type: "string",
                alias: "t",
                describe: "Slack oAuth Token"
            },
            verbose: {
                type: "boolean",
                alias: "v",
                describe: "Run Verbosely"
            },
            "dry-run": {
                type: "boolean",
                alias: "d",
                describe: "Do Not Post to Slack"
            },
            sleep: {
                type: "string",
                alias: "s",
                describe: "pause between rotations"
            }
        };
        const args: IOptions = (await yargs(hideBin(process.argv)).options(yargsOptions)
            .argv) as unknown as IOptions;

        const stored = await getStoredValues();

        const setValues: IStoredValues = {
            sleep,
            slackToken,
            dryRun,
            verbose,
            ...stored
        };

        if (args["dry-run"] !== undefined) {
            setValues.dryRun = args["dry-run"];
        }
        if (args.sleep !== undefined) {
            setValues.sleep = args.sleep;
        }
        if (args.verbose !== undefined) {
            setValues.verbose = args.verbose;
        }
        if (args["slack-token"] !== undefined) {
            setValues.slackToken = args["slack-token"];
        }

        if (!setValues.slackToken || setValues.slackToken.length === 0) {
            const answer = await inquirer.prompt([
                { name: "slackToken", message: "Slack oAuth Token" }
            ]);
            setValues.slackToken = answer.slackToken;
        }

        sleep = setValues.sleep;
        slackToken = setValues.slackToken;
        dryRun = setValues.dryRun;
        verbose = setValues.verbose;

        await setStoredValues(setValues).catch(reject);

        verboseLog("");
        verboseLog(`slackToken: ${chalk.cyan(slackToken)}`);
        verboseLog(`sleep:      ${chalk.cyan(sleep)}`);
        if (verbose === false && dryRun) {
            console.info();
            console.info(chalk.red("DRY RUN MODE"));
            console.info(`use the ${chalk.red("--dry-run=false")} to reset`);
            console.info();
        } else {
            verboseLog(`dryRun:     ${chalk.cyan(dryRun)}`);
        }
        verboseLog(`verbose:    ${chalk.cyan(verbose)}`);
        verboseLog("");

        resolve();
    });

/**
 * Main Loop Action
 */
const main = async (): Promise<PlayerStatus> => {
    verboseLog("Get Current Song");
    const current = await current_song();
    verboseLog("Current Song", current);

    if (current.type === "Playing") {
        const status = `Listening to: ${current.name} by ${current.artist} off ${current.album}`;
        if (status !== previousStatus) {
            console.info("SET NEW STATUS:", status);
            previousStatus = status;

            if (!dryRun) {
                await setProfileStatus(
                    {
                        status_text: status.substring(0, 95),
                        status_emoji: selectRandom(playingEmojis, previousEmoji),
                        status_expiration: dayjs()
                            .add(current.duration || 300, "seconds")
                            .add(1, "min")
                            .unix()
                    },
                    slackToken
                );
            }
        } else {
            verboseLog("No State Changed");
        }
    } else {
        if (previousState === "Playing") {
            const status = "Music Paused";
            console.info("Clear Status");
            previousStatus = status;

            if (!dryRun) {
                await setProfileStatus(
                    {
                        status_text: status,
                        status_emoji: EMOJI.Mute,
                        status_expiration: dayjs().subtract(1, "min").unix()
                    },
                    slackToken
                );
            }
        }
    }

    previousState = current.type;
    return current.type;
};

/**
 * Run the Loop and Keep Running until the State is Not Playing or Paused
 * @returns
 */
const run = () =>
    main().then((state) => {
        // If the State is Playing or Paused, then set the next loop
        if (state === "Playing" || state === "Paused") {
            return new Promise((resolve, reject) => {
                verboseLog(`sleep for ${sleep}`);
                setTimeout(() => {
                    run().catch(reject).then(resolve);
                }, ms(sleep));
            });
        } else {
            // ...Otherwise the Player is Stopped or Closed, so Exit
            return Promise.resolve();
        }
    });

/**
 * Execute the Application
 */
preRun()
    .then(run)
    .then(() => {
        console.info();
        console.info(`Work Complete`);
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
