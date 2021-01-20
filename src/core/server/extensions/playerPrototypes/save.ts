import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/Character';

const db: Database = getDatabase();

export async function field(fieldName: string, fieldValue: any): Promise<void> {
    const p: alt.Player = this as alt.Player;
    await db.updatePartialData(p.data._id, { [fieldName]: fieldValue }, 'characters');
}

export async function partial(dataObject: Partial<Character>): Promise<void> {
    const p: alt.Player = this as alt.Player;
    await db.updatePartialData(p.data._id, { ...dataObject }, 'characters');
}

export async function onTick(): Promise<void> {
    const p: alt.Player = this as alt.Player;

    // Update Server Data First
    p.data.pos = p.pos;
    p.data.health = p.health;
    p.data.armour = p.armour;

    // Update Database
    p.saveField('pos', p.data.pos);
    p.saveField('health', p.data.health);
    p.saveField('armour', p.data.armour);
}
