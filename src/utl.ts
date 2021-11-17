/**
 * Get a Random Integer between to provided values
 * @param min Low end of Range
 * @param max Top end of Range
 * @param inclusive Include Max Value as Selectable
 * @returns random Integer between provided values
 */
export const randomInt = (min: number, max: number, inclusive = false): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + (inclusive ? 1 : 0)) + min);
};

/**
 * randomly select an item from a list
 * @param list Items to Select Randomly From
 * @param not Option to exclude an item from that list
 * @returns
 */
export const selectRandom = <T>(list: T[], not?: T): T => {
    const thisList = not === undefined ? [...list] : [...list].filter((v) => v !== not);
    const randomIndex = randomInt(0, thisList.length);
    return thisList[randomIndex];
};
