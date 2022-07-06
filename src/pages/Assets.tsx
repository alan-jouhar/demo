import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './pages.css'
import { CoinResponse, CoinType, SingleCoinReponse } from "../types/types";
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

	const fetchAsset = async () => {
		let response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
		let json = response.json() as Promise<SingleCoinReponse>;
		let data = (await json).data;
		setAsset(data);
	};

	useEffect(() => {
		fetchAsset();
	}, []);

	return (
		<div className="Asset mt-3">
			<div className="Asset-Header">
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
			<div>{asset.supply}</div>
			<div>{asset.maxSupply}</div>
			<div>{asset.marketCapUsd}</div>
			<div>{asset.volumeUsd24Hr}</div>
			<div>{asset.priceUsd}</div>
			<div>{asset.changePercent24Hr}</div>
			<div>{asset.vwap24Hr}</div>
		</div>
	);
};

export default Assets;
