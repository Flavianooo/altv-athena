import * as alt from 'alt-server';
import { CurrencyTypes } from '../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

const ActionHandlers = {
    deposit: handleDeposit,
    withdraw: handleWithdraw,
    transfer: handleTransfer
};

alt.onClient(SYSTEM_EVENTS.INTERACTION_ATM_ACTION, handleAction);

function handleAction(player: alt.Player, type: string, amount: string | number, id: null | number): void {
    if (isNaN(amount as number)) {
        player.syncCurrencyData();
        return;
    }

    amount = parseInt(amount as string);

    if (!amount || amount <= 0) {
        player.syncCurrencyData();
        return;
    }

    if (!ActionHandlers[type]) {
        player.syncCurrencyData();
        return;
    }

    const result = ActionHandlers[type](player, amount, id);
    player.syncCurrencyData();

    if (!result) {
        player.emitSoundFrontend('Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    } else {
        player.emitSoundFrontend('Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }
}

function handleDeposit(player: alt.Player, amount: number): boolean {
    if (player.data.cash <= amount) {
        return false;
    }

    player.currencySub(CurrencyTypes.CASH, amount);
    player.currencyAdd(CurrencyTypes.BANK, amount);

    return true;
}

function handleWithdraw(player: alt.Player, amount: number): boolean {
    if (player.data.bank < amount) {
        return false;
    }

    player.currencyAdd(CurrencyTypes.CASH, amount);
    player.currencySub(CurrencyTypes.BANK, amount);

    return true;
}

function handleTransfer(player: alt.Player, amount: number, id: string | number): boolean {
    const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
    if (!target) {
        return false;
    }

    if (target === player) {
        return false;
    }

    player.currencySub(CurrencyTypes.BANK, amount);
    target.currencyAdd(CurrencyTypes.BANK, amount);

    target.emitMessage(`You received: ${amount} from ${player.data.name}.`);

    return true;
}
