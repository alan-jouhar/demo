import React, { useEffect, useState } from "react";
import { CoinType, CoinResponse } from "../types/types";
import CoinsWrapper from "../components/CoinsWarrper/CoinsWrapper";
import Coin from "../components/Coin/Coin";
const Main: React.FC = (props) => {
	const [assets, setAssets] = useState<CoinType[]>([]);
	const [curr, setCurr] = useState<CoinType[]>([]);

	const fetchAssets =async () => {
		let response = await fetch("https://api.coincap.io/v2/assets")
		let json = response.json() as Promise<CoinResponse>
		setAssets((await json).data)
		setCurr((await json).data.slice(0, 9));
	}

	useEffect(() => {
		fetchAssets()
	}, []);

	useEffect(() => {
		let coins = curr.map((c) => c.id).join(",");
		let pricesWs = new WebSocket(
			`wss://ws.coincap.io/prices?assets=${coins}`
		);
		pricesWs.onmessage = function (msg:{data:string}) {
			let newCurr : CoinType[] = curr.concat()
			Object.entries( JSON.parse( msg.data)).forEach((entry) => {
				let key = entry[0];
				let value = entry[1] as string;
				let index = curr.findIndex((e) => e.id === key);
				let coinAtIndex = {...curr[index]}
				newCurr.splice(index, 1, {
					...coinAtIndex,
					priceUsd:value
				});
			});
			setCurr(newCurr)
		};
		return () => {
			if(pricesWs.readyState === 0){
				pricesWs.addEventListener('open',() => {
					pricesWs.close()
				})
			}
			else{
				pricesWs.close()
			}
		}
	}, [curr.length]);

	return (
		<main className="mt-3">
			<CoinsWrapper>
				{curr.map((coin) => (
					<Coin coin={coin} key={coin.id} />
				))}
			</CoinsWrapper>
			{curr.length < assets.length && (
				<button
					className="mt-3 btn btn-primary btn-lg btn-block w-100"
					onClick={() =>
						setCurr((c) => c.concat(assets.slice(c.length, c.length + 9)))
					}
				>
					Load More
				</button>
			)}
		</main>
	);
};

export default Main;
