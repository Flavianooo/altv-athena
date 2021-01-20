import * as alt from 'alt-server';
import { Character } from '../../../shared/interfaces/Character';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';

export async function character(characterData: Partial<Character>): Promise<void> {
    const p: alt.Player = this as alt.Player;

    p.data = { ...characterData };
    p.syncAppearance();
    p.emitEvent(SYSTEM_EVENTS.TICKS_START);

    // Set player dimension to zero.
    p.dimension = 0;
    p.setFrozen(true);

    alt.setTimeout(() => {
        p.setPosition(p.data.pos.x, p.data.pos.y, p.data.pos.z);
        p.addHealth(p.data.health, true);
        p.addArmour(p.data.armour, true);
        p.syncCurrencyData();
        p.syncWeather();
        p.syncTime();
        p.syncInventory();

        // Resets their death status and logs them in as dead.
        if (p.data.isDead) {
            p.nextDeathSpawn = Date.now() + 30000;
            p.data.isDead = false;
            p.addHealth(0, true);
            p.emitMeta('isDead', true);
        } else {
            p.data.isDead = false;
            p.emitMeta('isDead', false);
        }

        alt.emit(SYSTEM_EVENTS.VOICE_ADD, p);
    }, 500);

    // Delete unused data from the Player.
    delete p.currentCharacters;
}
