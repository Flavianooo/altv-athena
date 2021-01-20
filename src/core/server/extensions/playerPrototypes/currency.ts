import * as alt from 'alt-server';
import { CurrencyTypes } from '../../../shared/enums/currency';

/**
 * Add currency type to the player.
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean} Success?
 * @memberof CurrencyPrototype
 */
export function add(type: CurrencyTypes, amount: number): boolean {
    const p: alt.Player = this as alt.Player;

    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        p.data[type] += amount;
        p.emitMeta(type, p.data[type]);
        p.saveField(type, p.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Remove currency type from the player.
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean} Success?
 * @memberof CurrencyPrototype
 */
export function sub(type: CurrencyTypes, amount: number): boolean {
    const p: alt.Player = this as alt.Player;

    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        p.data[type] -= amount;
        p.emitMeta(type, p.data[type]);
        p.saveField(type, p.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Replace the current currency type value with this exact value.
 * @param {CurrencyTypes} type Type of currency we are modifying.
 * @param {number} amount The amount we want to set that type to.
 * @return {*}  {boolean}
 * @memberof CurrencyPrototype
 */
export function setCurrency(type: CurrencyTypes, amount: number): boolean {
    const p: alt.Player = this as alt.Player;

    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        p.data[type] = amount;
        p.emitMeta(type, p.data[type]);
        p.saveField(type, p.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}
