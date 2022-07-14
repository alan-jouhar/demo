// "id": "bitcoin",
//     "rank": "1",
//     "symbol": "BTC",
//     "name": "Bitcoin",
//     "supply": "17193925.0000000000000000",
//     "maxSupply": "21000000.0000000000000000",
//     "marketCapUsd": "119179791817.6740161068269075",
//     "volumeUsd24Hr": "2928356777.6066665425687196",
//     "priceUsd": "6931.5058555666618359",
//     "changePercent24Hr": "-0.8101417214350335",
//     "vwap24Hr": "7175.0663247679233209"
export type CoinType = {
	id: string;
	rank: string;
	symbol: string;
	supply: string;
	maxSupply: string;
	marketCapUsd: string;
	volumeUsd24Hr: string;
	priceUsd: string;
	changePercent24Hr: string;
	vwap24Hr: string;
};
export type Price = {
	priceUsd: string;
	time: number;
};
export type CoinResponse = {
	data: CoinType[];
};
export type SingleCoinReponse = {
	data: CoinType;
};
export type PriceResponse = {
	data: Price[];
};
export type TimeRanges = "day" | "week" | "month" | "year" | "max";
export type timeIntervals = "m1" | "m15" | "h1" | "h6" | "d1";