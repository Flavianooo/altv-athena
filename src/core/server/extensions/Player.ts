import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { DiscordUser } from '../interface/DiscordUser';
import { Account } from '../interface/Account';

import * as currency from './playerPrototypes/currency';
import * as dataUpdater from './playerPrototypes/dataUpdater';
import * as emit from './playerPrototypes/emit';
import * as newProto from './playerPrototypes/new';
import * as safe from './playerPrototypes/safe';
import * as save from './playerPrototypes/save';
import * as select from './playerPrototypes/select';
import * as set from './playerPrototypes/set';
import * as sync from './playerPrototypes/sync';
import { Appearance } from '../../shared/interfaces/Appearance';
import { CharacterInfo } from '../../shared/interfaces/CharacterInfo';
import { CurrencyTypes } from '../../shared/enums/currency';
import { AnimationFlags } from '../../shared/flags/animation';

declare module 'alt-server' {
    export interface Player {
        // First Join Data
        pendingLogin?: boolean; // Used when a player is pending login.
        discordToken?: string; // Used to assist with loggin in a player through oAuth2.
        needsQT?: boolean;
        hasModel?: boolean;
        currentCharacters: Array<Character>;
        pendingCharacterEdit?: boolean;
        pendingNewCharacter?: boolean;
        pendingCharacterSelect?: boolean;

        // Player Data
        accountData?: Partial<Account>; // Account Identifiers for Discord
        discord?: DiscordUser; // Discord Information
        data?: Partial<Character>; // Currently Selected Character

        // Anti
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        // Status Effects
        nextDeathSpawn: number;
        nextPingTime: number;

        // World Data
        gridSpace: number;
        currentWeather: string;

        // Currency
        /**
         * Add a currency type to this player.
         * @param {CurrencyTypes} type
         * @param {number} amount
         * @return {*}  {boolean}
         * @memberof CurrencyPrototype
         */
        currencyAdd(type: CurrencyTypes, amount: number): boolean;

        /**
         * Subtract a currency type from this player.
         * @param {CurrencyTypes} type
         * @param {number} amount
         * @return {*}  {boolean}
         * @memberof CurrencyPrototype
         */
        currencySub(type: CurrencyTypes, amount: number): boolean;

        /**
         * Set this player's currency type to a specific value.
         * @param {CurrencyTypes} type
         * @param {number} amount
         * @return {*}  {boolean}
         * @memberof CurrencyPrototype
         */
        currencySet(type: CurrencyTypes, amount: number): boolean;

        // dataUpdater

        /**
         * Used to give default values to this player on connect.
         * @param {(Character | null)} data
         * @memberof DataUpdaterPrototype
         */
        dataInit(data: Character | null);

        /**
         * Update this player's data property with bulk data.
         * @param {{ [key: string]: any }} dataObject
         * @param {string} targetDataName
         * @memberof DataUpdaterPrototype
         */
        dataUpdateByKeys(dataObject: { [key: string]: any }, targetDataName: string);

        // Emit

        /**
         * Make this player play an animation.
         * @param {string} dictionary
         * @param {string} name
         * @param {AnimationFlags} flags Use a Bitwise Flag to Combine
         * @param {number} duration
         * @memberof EmitPrototype
         */
        emitAnimation(dictionary: string, name: string, flags: AnimationFlags, duration: number): void;

        /**
         * Emit Data to this player only.
         * @param {string} key
         * @param {*} value
         * @memberof EmitPrototype
         */
        emitMeta(key: string, value: any): void;

        /**
         * Send an event to this player.
         * @param {string} eventName
         * @param {...any[]} args
         * @memberof EmitPrototype
         */
        emitEvent(eventName: string, ...args: any[]): void;

        /**
         * Send a message to this player's chatbox.
         * @param {string} message
         * @memberof EmitPrototype
         */
        emitMessage(message: string): void;

        /**
         * Send a native GTA:V notification to this player.
         * @param {string} message
         * @memberof EmitPrototype
         */
        emitNotification(message: string): void;

        /**
         * Play a custom sound in a 3D space for this player.
         * @param {string} audioName
         * @param {alt.Entity} target A vehicle, player, etc.
         * @memberof EmitPrototype
         */
        emitSound3D(audioName: string, target: alt.Entity): void;

        /**
         * Play a native frontend sound for this player.
         * @param {string} audioName
         * @param {string} ref
         * @memberof EmitPrototype
         */
        emitSoundFrontend(audioName: string, ref: string): void;

        /**
         * Creates a new character and binds it to their account.
         * @param {Partial<Appearance>} appearance
         * @param {Partial<CharacterInfo>} info
         * @param {string} name
         * @return {*}  {Promise<void>}
         * @memberof NewDataPrototype
         */
        newCharacter(appearance: Partial<Appearance>, info: Partial<CharacterInfo>, name: string): Promise<void>;

        // Safe Sets

        /**
         * Safely set a player's position.
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @memberof SafePrototype
         */
        setPosition(x: number, y: number, z: number): void;

        /**
         * Safely add health to this player.
         * @param {number} value 99-200
         * @param {boolean} exactValue
         * @memberof SafePrototype
         */
        addHealth(value: number, exactValue: boolean): void;

        /**
         * Safely add armour to this player.
         * @param {number} value 1-100
         * @param {boolean} exactValue
         * @memberof SafePrototype
         */
        addArmour(value: number, exactValue: boolean): void;

        // Saving
        /**
         * Save a specific field for the current character of this player.
         * player.data.cash = 25;
         * player.saveField('cash', player.data.cash);
         * @param {string} fieldName
         * @param {*} fieldValue
         * @return {*}  {Promise<void>}
         * @memberof SavePrototype
         */
        saveField(fieldName: string, fieldValue: any): Promise<void>;

        /**
         * Update a partial object of data for the current character of this player.
         * @param {Partial<Character>} dataObject
         * @return {*}  {Promise<void>}
         * @memberof SavePrototype
         */
        savePartial(dataObject: Partial<Character>): Promise<void>;

        /**
         * Call to manually save character data like position, health, etc.
         * @return {*}  {Promise<void>}
         * @memberof SavePrototype
         */
        saveOnTick(): Promise<void>;

        // Select
        /**
         * Select a character based on the character data provided.
         * @param {Partial<Character>} characterData
         * @return {*}  {Promise<void>}
         * @memberof SelectPrototype
         */
        selectCharacter(characterData: Partial<Character>): Promise<void>;

        /**
         * Set the account data for this player after they login.
         * @param {Partial<Account>} accountData
         * @return {*}  {Promise<void>}
         * @memberof SetPrototype
         */
        setAccount(accountData: Partial<Account>): Promise<void>;

        /**
         *
         * @param {alt.Player} killer
         * @param {*} weaponHash
         * @memberof SetPrototype
         */
        setDead(killer?: alt.Player, weaponHash?: any): void;

        /**
         * Called when a player does their first connection to the server.
         * @memberof SetPrototype
         */
        setFirstConnect(): void;

        /**
         * Set if this player should be frozen.
         * @param {boolean} value
         * @memberof SetPrototype
         */
        setFrozen(value: boolean): void;

        /**
         * Set this player as respawned.
         * @param {(alt.Vector3 | null)} position Use null to find closest hospital.
         * @memberof SetPrototype
         */
        setRespawned(position: alt.Vector3 | null): void;

        /**
         * Synchronize currency data like bank, cash, etc.
         * @memberof SyncPrototype
         */
        syncCurrencyData(): void;

        /**
         * Synchronize player appearance.
         * @memberof SyncPrototype
         */
        syncAppearance(): void;

        /**
         * Synchronize the player inventory, equipment, toolbar, etc.
         * @memberof SyncPrototype
         */
        syncInventory(): void;

        /**
         * Synchronize player data like ping, position, etc.
         * @memberof SyncPrototype
         */
        syncSyncedMeta(): void;

        /**
         * Update the player's time to match server time.
         * @memberof SyncPrototype
         */
        syncTime(): void;

        /**
         * Update the player's weather to match server weather based on grid space.
         * @memberof SyncPrototype
         */
        syncWeather(): void;
    }
}

// Currency Binds
alt.Player.prototype.currencyAdd = currency.add;
alt.Player.prototype.currencySub = currency.sub;
alt.Player.prototype.currencySet = currency.setCurrency;

// Data Updater
alt.Player.prototype.dataInit = dataUpdater.init;
alt.Player.prototype.dataUpdateByKeys = dataUpdater.updateByKeys;

// Emitters
alt.Player.prototype.emitAnimation = emit.animation;
alt.Player.prototype.emitMeta = emit.meta;
alt.Player.prototype.emitEvent = emit.event;
alt.Player.prototype.emitMessage = emit.message;
alt.Player.prototype.emitNotification = emit.notification;
alt.Player.prototype.emitSound3D = emit.sound3D;
alt.Player.prototype.emitSoundFrontend = emit.soundFrontend;

// New
alt.Player.prototype.newCharacter = newProto.character;

// Safe
alt.Player.prototype.addArmour = safe.addArmour;
alt.Player.prototype.addHealth = safe.addHealth;
alt.Player.prototype.setPosition = safe.setPosition;

// Saving
alt.Player.prototype.saveField = save.field;
alt.Player.prototype.savePartial = save.partial;
alt.Player.prototype.saveOnTick = save.onTick;

// Select
alt.Player.prototype.selectCharacter = select.character;

// Set
alt.Player.prototype.setAccount = set.account;
// setCharacter?
alt.Player.prototype.setDead = set.dead;
alt.Player.prototype.setFirstConnect = set.firstConnect;
alt.Player.prototype.setFrozen = set.frozen;
alt.Player.prototype.setRespawned = set.respawned;

// Sync
alt.Player.prototype.syncCurrencyData = sync.currencyData;
alt.Player.prototype.syncInventory = sync.inventory;
alt.Player.prototype.syncAppearance = sync.appearance;
alt.Player.prototype.syncSyncedMeta = sync.syncedMeta;
alt.Player.prototype.syncTime = sync.time;
alt.Player.prototype.syncWeather = sync.weather;
