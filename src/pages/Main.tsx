import React, { useEffect, useState } from "react";
import { CoinType, CoinResponse } from "../types/types";
import CoinsWrapper from "../components/CoinsWarrper/CoinsWrapper";
import Coin from "../components/Coin/Coin";
const Main: React.FC = (props) => {
	const [assets, setAssets] = useState<CoinType[]>([]);
	const [curr, setCurr] = useState<CoinType[]>([]);
	const pricesWs = null
	useEffect(() => {
		
		fetch("https://api.coincap.io/v2/assets")
			.then((res) => res.json())
			.then((d) => {
				setAssets(d.data);
				setCurr(d.data.slice(0, 9));
			});
	}, []);

	useEffect(() => {
		let coins = curr.map((c) => c.id).join(",");
		console.log(coins);
		const pricesWs = new WebSocket(
			`wss://ws.coincap.io/prices?assets=${coins}`
		);
		pricesWs.onmessage = function (msg:{data:string}) {
			console.log(msg.data);
			let newCurr : CoinType[] = curr.concat()
			// console.log(Object.entries( JSON.parse( msg.data) ))
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
			pricesWs.close()
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
