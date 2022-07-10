import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./pages.css";
import { CoinResponse, CoinType, SingleCoinReponse } from "../types/types";
import Graph from "../components/Graph/Graph";
const Assets: React.FC = () => {
	let { id } = useParams<{ id: string }>();
	let [asset, setAsset] = useState<CoinType>({
		id: "",
		rank: "",
		symbol: "",
		supply: "",
		maxSupply: "",
		marketCapUsd: "",
		volumeUsd24Hr: "",
		priceUsd: "",
		changePercent24Hr: "",
		vwap24Hr: "",
	});

	const formatString = (str: string) => {
		if (str.length < 4) {
			return str;
		}
		let units = ["K", "M", "B", "T", "Q"];
		let [intgerStr] = str.split(".");
		let digits = parseInt(intgerStr.length / 3 + "");
		let remainder = intgerStr.length % 3;
		if (intgerStr.length % 3 === 0) {
			return str.slice(0, 3) + units[digits - 2];
		}
		return str.slice(0, remainder) + units[digits - 1];
	};

	const fetchAsset = async () => {
		let response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
		let json = response.json() as Promise<SingleCoinReponse>;
		let data = (await json).data;
		setAsset(data);
	};

	useEffect(() => {
		fetchAsset();
	}, []);

	useEffect(() => {
		let pricesWs = new WebSocket(`wss://ws.coincap.io/prices?assets=${id}`);
		pricesWs.onmessage = function (msg: { data: string }) {
			let json = JSON.parse(msg.data);
			if (Object.keys(json).includes(id)) {
				let value = json[id];
				// let newAsset = {...asset,priceUsd:value}
				// console.log(newAsset)
				setAsset((newAsset) => ({ ...newAsset, priceUsd: value }));
			}
		};
		return () => {
			if (pricesWs.readyState === 0) {
				pricesWs.addEventListener("open", () => {
					pricesWs.close();
				});
			} else {
				pricesWs.close();
			}
		};
	}, []);

	return (
		<div className="Asset mt-3">
			<div className="Asset-Header mb-3">
				<div>
					<p className="Asset-Property">Name</p>
					<span className="Asset-Value">{asset.id.toLocaleUpperCase()}</span>
				</div>
				<div>
					<p className="Asset-Property">Rank</p>
					<span className="Asset-Value">{asset.rank}</span>
				</div>
				<div>
					<p className="Asset-Property">Symbol</p>
					<span className="Asset-Value">{asset.symbol}</span>
				</div>
			</div>

			<div className="Asset-Price mb-3">
				{parseFloat(asset.priceUsd) > 1 ? (
					<p className="Asset-Price_formatted p-3" key={asset.priceUsd}>
						{parseFloat(asset.priceUsd).toFixed(2)}{" "}
						<small className="Asset-Sign">$</small>
					</p>
				) : (
					<p className="Asset-Price_formatted p-3" key={asset.priceUsd}>
						{parseFloat(asset.priceUsd).toFixed(8)}{" "}
						<small className="Asset-Sign">$</small>
					</p>
				)}
			</div>
			<div className="Asset-Figure mb-3">
				<img
					className="Asset-Image"
					src={`https://cryptoicons.org/api/icon/${asset.symbol.toLocaleLowerCase()}/200`}
				/>
				<div className="text-end">
					<p className="Asset-Title">24H %</p>
					{asset.changePercent24Hr.startsWith("-") ? (
						<span className="Asset-Price_red">
							{parseFloat(asset.changePercent24Hr).toFixed(2)}
						</span>
					) : (
						<span className="Asset-Price_green">
							{parseFloat(asset.changePercent24Hr).toFixed(2)}
						</span>
					)}
				</div>
			</div>
			<div className="Asset-Stats mb-3">
				<div
					className="Asset-Item p-1 text-center"
					title={`Market Cap in USD:${asset.marketCapUsd}`}
				>
					<p className="Asset-Title">Mcap</p>
					<span>{formatString(asset.marketCapUsd)}</span>
				</div>
				<div
					className="Asset-Item p-1 text-center"
					title={`Supply:${asset.supply}`}
				>
					<p className="Asset-Title">Supp</p>
					<span>{formatString(asset.supply)}</span>
				</div>
				<div
					className="Asset-Item p-1 text-center"
					title={`Max Supply:${asset.maxSupply}`}
				>
					<p className="Asset-Title">M.Supp</p>
					<span>{formatString(asset.maxSupply || "N/A")}</span>
				</div>
				<div
					className="Asset-Item p-1 text-center"
					title={`Volume 24H:${asset.volumeUsd24Hr}`}
				>
					<p className="Asset-Title">Vol.24</p>
					<span>{formatString(asset.volumeUsd24Hr)}</span>
				</div>
			</div>
            <Graph id={id}/>
		</div>
	);
};

export default Assets;
