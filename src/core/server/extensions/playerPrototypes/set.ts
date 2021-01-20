import * as alt from 'alt-server';
import { Account } from '../../interface/Account';
import { Permissions } from '../../../shared/flags/permissions';
import { getUniquePlayerHash } from '../../utility/encryption';
import { Database, getDatabase } from 'simplymongo';
import { DEFAULT_CONFIG } from '../../athena/main';
import { distance2d } from '../../../shared/utility/vector';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';

const db: Database = getDatabase();

/**
 * Set the current account data for this player.
 * @param {Partial<Account>} accountData
 * @return {*}  {Promise<void>}
 * @memberof SetPrototype
 */
export async function account(accountData: Partial<Account>): Promise<void> {
    const p: alt.Player = this as alt.Player;

    if (!accountData.permissionLevel) {
        accountData.permissionLevel = Permissions.None;
        db.updatePartialData(accountData._id, { permissionLevel: Permissions.None }, 'accounts');
    }

    if (!accountData.quickToken || Date.now() > accountData.quickTokenExpiration || p.needsQT) {
        const qt: string = getUniquePlayerHash(p, p.discord.id);

        db.updatePartialData(
            accountData._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48 // 48 Hours
            },
            'accounts'
        );

        p.emitEvent(SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, p.discord.id);
    }

    p.emitMeta('permissionLevel', accountData.permissionLevel);
    p.accountData = accountData;
}

export function dead(killer: alt.Player = null, weaponHash: any = null): void {
    const p: alt.Player = this as alt.Player;
    p.spawn(p.pos.x, p.pos.y, p.pos.z, 0);

    if (!p.data.isDead) {
        p.data.isDead = true;
        p.emitMeta('isDead', true);
        p.saveField('isDead', true);
        alt.log(`(${p.id}) ${p.data.name} has died.`);
    }

    if (!p.nextDeathSpawn) {
        p.nextDeathSpawn = Date.now() + DEFAULT_CONFIG.RESPAWN_TIME;
    }
}

export async function firstConnect(): Promise<void> {
    const p: alt.Player = this as alt.Player;

    if (!p || !p.valid) {
        return;
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    p.dimension = p.id + 1; // First ID is 0. We add 1 so everyone gets a unique dimension.
    p.pendingLogin = true;

    p.dataInit(null);
    p.setPosition(pos.x, pos.y, pos.z);
    p.syncTime();
    p.syncWeather();
    p.emitEvent(SYSTEM_EVENTS.QUICK_TOKEN_FETCH);
}

/**
 * Set this player as frozen or unfrozen.
 * @param {boolean} value
 * @memberof SetPrototype
 */
export function frozen(value: boolean): void {
    const p: alt.Player = this as alt.Player;
    p.emitEvent(SYSTEM_EVENTS.PLAYER_SET_FREEZE, value);
}

/**
 * Set this player as respawned.
 * Add a position if you want to override hospital spawn.
 * @param {alt.Vector3} [position=null]
 * @memberof SetPrototype
 */
export function respawned(position: alt.Vector3 = null): void {
    const p: alt.Player = this as alt.Player;

    p.nextDeathSpawn = null;
    p.data.isDead = false;
    p.emitMeta('isDead', false);
    p.saveField('isDead', false);

    if (DEFAULT_CONFIG.RESPAWN_LOSE_WEAPONS) {
        p.removeAllWeapons();
    }

    let nearestHopsital = position;
    if (!position) {
        const hospitals = [...DEFAULT_CONFIG.VALID_HOSPITALS];
        let index = 0;
        let lastDistance = distance2d(p.pos, hospitals[0]);

        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(p.pos, hospitals[i]);
            if (distanceCalc > lastDistance) {
                continue;
            }

            lastDistance = distanceCalc;
            index = i;
        }

        nearestHopsital = hospitals[index] as alt.Vector3;
    }

    p.setPosition(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    p.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    p.addHealth(DEFAULT_CONFIG.RESPAWN_HEALTH, true);
    p.addArmour(DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
}
