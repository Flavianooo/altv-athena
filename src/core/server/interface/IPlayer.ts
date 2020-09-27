import * as alt from 'alt-server';
import { ICharacter, ICharacterDefaults } from './ICharacter';
import { IDiscordUser } from './IDiscordUser';
import { Database, getDatabase } from 'simplymongo';
import { CurrencyTypes } from '../enums/currency';

const db: Database = getDatabase();

declare module 'alt-server' {
    export interface Player {
        // First Join Data
        pendingLogin?: boolean; // Used when a player is pending login.
        discordToken?: string; // Used to assist with loggin in a player through oAuth2.
        hasModel?: boolean;
        pendingCharacterEdit?: boolean;

        // Account Data
        account?: string;

        // Player Data
        discord?: IDiscordUser;
        data?: ICharacter;

        // Anti
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        // Functions

        /**
         * emits data to the player's client-side.
         * @param  {string} eventName
         * @param  {any[]} ...args
         */
        emit(eventName: string, ...args: any[]);

        /**
         * emits meta to the players client-side. Accessible through 'alt.Player.local.meta'
         * @param  {string} key
         * @param  {any} value
         * @returns void
         */
        emitMeta(key: string, value: any): void;

        /**
         * Add currency from this player based on currency type and amount.
         * @param  {CurrencyTypes} type
         * @param  {number} amount
         * @returns boolean
         */
        currencyAdd(type: CurrencyTypes, amount: number): boolean;

        /**
         * Set a currency type for this player to a specific value.
         * @param  {CurrencyTypes} type
         * @param  {number} amount
         * @returns boolean
         */
        currencySet(type: CurrencyTypes, amount: number): boolean;

        /**
         * Remove currecny from this player based on currency type and amount.
         * @param  {CurrencyTypes} type
         * @param  {number} amount
         * @returns boolean
         */
        currencySub(type: CurrencyTypes, amount: number): boolean;

        /**
         * Initialize default values for player.data
         * @returns void
         */
        init(): void;

        /**
         * Bind database character data to this player.
         * @param  {ICharacter} data
         * @returns void
         */
        initData(data: ICharacter): void;

        /**
         * Safely set this player's position.
         * @param  {number} x
         * @param  {number} y
         * @param  {number} z
         * @returns void
         */
        safeSetPosition(x: number, y: number, z: number): void;

        /**
         * Safelty set this player's health value.
         * @param  {number} value
         * @returns void
         */
        safeAddHealth(value: number): void;

        /**
         * Safely set this player's armour value.
         * @param  {number} value
         * @returns void
         */
        safeAddArmour(value: number): void;

        /**
         * Save specific data for this player. Update `player.data` first.
         * @param  {string} fieldName
         * @param  {any} fieldValue
         * @returns void
         */
        saveField(fieldName: string, fieldValue: any): void;

        /**
         * Save multiple fields of data for this
         * @param  {ICharacter} dataObject
         * @returns void
         */
        savePartial(dataObject: ICharacter): void;
    }
}

alt.Player.prototype.emit = function emit(eventName: string, ...args: any[]) {
    alt.emitClient(this, eventName, ...args);
};

alt.Player.prototype.emitMeta = function emitMeta(key: string, value: any) {
    alt.emitClient(this, 'meta:Set', key, value);
};

alt.Player.prototype.saveField = async function saveField(fieldName: string, fieldValue: any) {
    await db.updatePartialData(this.data._id, { [fieldName]: fieldValue }, 'characters');
};

alt.Player.prototype.savePartial = async function savePartial(dataObject: ICharacter) {
    await db.updatePartialData(this.data._id, { ...dataObject }, 'characters');
};

alt.Player.prototype.init = function init() {
    this.data = Object.assign({}, ICharacterDefaults);
};

alt.Player.prototype.initData = function initData(data: ICharacter) {
    Object.keys(data).forEach((key) => {
        this.data[key] = data[key];
    });
};

alt.Player.prototype.currencyAdd = function currencyAdd(type: CurrencyTypes, amount: number) {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] += amount;
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
};

alt.Player.prototype.currencySub = function currencySub(type: CurrencyTypes, amount: number) {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] -= amount;
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
};

alt.Player.prototype.currencySet = function currencySet(type: CurrencyTypes, amount: number) {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] = amount;
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
};

alt.Player.prototype.safeSetPosition = function safeSetPosition(x: number, y: number, z: number) {
    if (!this.hasModel) {
        this.hasModel = true;
        this.spawn(x, y, z, 0);
        this.model = `mp_m_freemode_01`;
    }

    this.acPosition = { x, y, z };
    this.pos = { x, y, z };
};

alt.Player.prototype.safeAddHealth = function safeAddHealth(value: number) {
    if (this.health + value > 200) {
        this.acHealth = 200;
        this.health = 200;
        return;
    }

    this.acHealth = this.health + value;
    this.health += value;
};

alt.Player.prototype.safeAddArmour = function safeAddArmour(value: number) {
    if (this.armour + value > 100) {
        this.acArmour = 100;
        this.armour = 100;
        return;
    }

    this.acArmour = this.armour + value;
    this.armour += value;
};
