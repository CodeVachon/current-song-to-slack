import { EMOJI } from "./emoji";
import axios from "axios";

/**
 * Update the Users Slack Profile Status
 * @param data Profile Data to Send to Slack API
 * @param slackToken The oAuth Token needed to Connect
 * @returns
 */
export const setProfileStatus = (
    data: {
        status_text: string;
        status_emoji?: EMOJI;
        status_expiration?: number;
    },
    slackToken: string
) =>
    axios({
        method: "POST",
        url: "https://slack.com/api/users.profile.set",
        headers: {
            AUTHORIZATION: `Bearer ${slackToken}`
        },
        data: {
            profile: data
        }
    });
