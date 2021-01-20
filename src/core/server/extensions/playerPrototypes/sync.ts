import * as alt from 'alt-server';
import { View_Events_Creator } from '../../../shared/enums/views';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { World } from '../../systems/world';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';

/**
 * Synchronize and update currency balances for the player.
 * @memberof SyncPrototype
 */
export function currencyData(): void {
    const p: alt.Player = this as alt.Player;

    const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
    for (const key of keys) {
        const currencyName: string = CurrencyTypes[key];
        p.emitMeta(currencyName, p.data[currencyName]);
    }
}

/**
 * Synchronize the appearance of a player.
 * @memberof SyncPrototype
 */
export function appearance(): void {
    const p: alt.Player = this as alt.Player;

    if (p.data.appearance.sex === 0) {
        p.model = 'mp_f_freemode_01';
    } else {
        p.model = 'mp_m_freemode_01';
    }

    p.setSyncedMeta('Name', p.data.name);
    p.emitMeta('appearance', p.data.appearance);
    p.emitEvent(View_Events_Creator.Sync, p.data.appearance);
}

export function inventory(): void {
    const p: alt.Player = this as alt.Player;

    if (!p.data.inventory) {
        p.data.inventory = new Array(6);
        for (let i = 0; i < p.data.inventory.length; i++) {
            p.data.inventory[i] = [];
        }
    }

    if (!p.data.toolbar) {
        p.data.toolbar = [];
    }

    if (!p.data.equipment) {
        p.data.equipment = [];
    }

    p.emitMeta('inventory', p.data.inventory);
    p.emitMeta('equipment', p.data.equipment);
    p.emitMeta('toolbar', p.data.toolbar);
}

/**
 * Updates synced meta for the current player.
 * Basically updates data that may not be fully accessible everywhere.
 * @memberof SyncPrototype
 */
export function syncedMeta(): void {
    const p: alt.Player = this as alt.Player;

    p.setSyncedMeta('Ping', p.ping);
    p.setSyncedMeta('Position', p.pos);
}

export function time(): void {
    const p: alt.Player = this as alt.Player;
    p.emitEvent(SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.hour, World.minute);
}

export function weather(): void {
    const p: alt.Player = this as alt.Player;
    p.gridSpace = World.getGridSpace(p);
    p.currentWeather = World.getWeatherByGrid(p.gridSpace);
    p.emitMeta('gridSpace', p.gridSpace);
    p.emitEvent(SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, p.currentWeather);
}
