import React, { useEffect, useState } from "react";
import { CoinType, CoinResponse } from "../types/types";
import CoinsWrapper from "../components/CoinsWarrper/CoinsWrapper";
import Coin from "../components/Coin/Coin";
const Main: React.FC = (props) => {
	const [assets, setAssets] = useState<CoinType[]>([]);
	
	useEffect(() => {
		fetch('https://api.coincap.io/v2/assets')
		.then(res => res.json())
		.then(d => setAssets(d.data))
	}, []);

	useEffect(() => {
		console.log(assets);
	}, [assets]);

	return (
		<main className="mt-3">
			<CoinsWrapper>
				{assets.map((coin) => (
					<Coin coin={coin} key={coin.id} />
				))}
			</CoinsWrapper>
		</main>
	);
};

export default Main;
