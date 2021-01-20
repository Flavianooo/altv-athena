import * as alt from 'alt-server';
import { AnimationFlags } from '../../../shared/flags/animation';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Chat } from '../../../shared/enums/views';

/**
 * Play an animation on this player.
 * @param {string} dictionary
 * @param {string} name
 * @param {AnimationFlags} flags
 * @param {number} [duration=-1]
 * @return {*}  {void}
 * @memberof EmitPrototype
 */
export function animation(dictionary: string, name: string, flags: AnimationFlags, duration: number = -1): void {
    const p: alt.Player = this as alt.Player;

    if (p.data.isDead) {
        alt.logWarning(`[Athena] Cannot play ${dictionary}@${name} while player is dead.`);
        return;
    }

    p.emitEvent(SYSTEM_EVENTS.PLAYER_EMIT_ANIMATION, dictionary, name, flags, duration);
}

/**
 * Synchronize a local variable to access locally for this player.
 * @param {string} key
 * @param {*} value
 * @memberof EmitPrototype
 */
export function meta(key: string, value: any): void {
    const p: alt.Player = this as alt.Player;

    alt.nextTick(() => {
        alt.emitClient(p, SYSTEM_EVENTS.META_SET, key, value);
    });
}

/**
 * Call a client-side event for this player.
 * @param {string} eventName
 * @param {...any[]} args
 * @memberof EmitPrototype
 */
export function event(eventName: string, ...args: any[]): void {
    const p: alt.Player = this as alt.Player;

    alt.nextTick(() => {
        alt.emitClient(p, eventName, ...args);
    });
}

/**
 * Send a message to this player's chat box.
 * @param {string} message
 * @memberof EmitPrototype
 */
export function message(message: string): void {
    const p: alt.Player = this as alt.Player;
    p.emitEvent(View_Events_Chat.Append, message);
}

/**
 * Send a notification to this player.
 * @param {string} message
 * @memberof EmitPrototype
 */
export function notification(message: string): void {
    const p: alt.Player = this as alt.Player;
    p.emitEvent(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message);
}

/**
 * Play a sound from at a target's location for this player.
 * @param {string} audioName
 * @param {alt.Entity} target
 * @memberof EmitPrototype
 */
export function sound3D(audioName: string, target: alt.Entity): void {
    const p: alt.Player = this as alt.Player;
    p.emitEvent(SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, target, audioName);
}

/**
 * Play a frontend sound for this player.
 * @param {string} audioName
 * @param {string} ref
 * @memberof EmitPrototype
 */
export function soundFrontend(audioName: string, ref: string): void {
    const p: alt.Player = this as alt.Player;
    p.emitEvent(SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
}
