import type { CandlestickData, Time } from "lightweight-charts";
import { makeAutoObservable } from "mobx";

export class ChartStore {
	OHLC: CandlestickData<Time>[] = [];
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	setOHLC(OHLC: CandlestickData<Time>[]) {
		this.OHLC = Array.from(OHLC).concat(this.OHLC);
	}

	updateLastCandle(candle: CandlestickData<Time>) {
		this.OHLC[this.OHLC.length - 1] = candle;
	}
}
