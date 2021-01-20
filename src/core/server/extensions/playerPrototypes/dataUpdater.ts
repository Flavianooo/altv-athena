import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';

/**
 * Used to initialize player.data with all data from a Character object.
 * Overwrites all existing data on the player for their session.
 * @param {Character} data
 * @memberof DataUpdaterPrototype
 */
export function init(data: Character = null) {
    const p: alt.Player = this as alt.Player;

    p.data = Object.assign({}, CharacterDefaults);

    if (data) {
        Object.keys(data).forEach((key) => {
            p.data[key] = data[key];
        });
    }
}

/**
 * Used to set multiple keys in the player.data section of this player.
 * @param {{ [key: string]: any }} dataObject An object full of properties and values.
 * @param {string} [targetDataName=''] A property inside of player.data* OPTIONAL
 * @memberof DataUpdaterPrototype
 */
export function updateByKeys(dataObject: { [key: string]: any }, targetDataName: string = '') {
    const p: alt.Player = this as alt.Player;

    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '') {
            p.data[targetDataName][key] = dataObject[key];
        } else {
            p.data[key] = dataObject[key];
        }
    });
}
