import * as alt from 'alt-server';

alt.on('playerDeath', handleDeath);

function handleDeath(player: alt.Player, killer: alt.Player, weaponHash: any): void {
    if (!player || !player.valid) {
        return;
    }

    player.setDead(killer, weaponHash);
}
