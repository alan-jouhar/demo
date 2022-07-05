import React from "react";
import "./coin.css";
import { CoinType } from "../../types/types";
interface CoinProps {
	coin: CoinType;
}
const Coin: React.FC<CoinProps> = ({ coin }) => {
	return (
		<div className="Coin">
			<div className="Coin-Header">
				<p className="Coin-Name">{coin.symbol}</p>
				{coin.changePercent24Hr.startsWith("-") ? (
					<span className="Coin-Percent Coin-Price_red">
						{parseFloat(coin.changePercent24Hr).toFixed(2)}
						<small>%</small>
					</span>
				) : (
					<span className="Coin-Percent Coin-Price_green">
						{parseFloat(coin.changePercent24Hr).toFixed(2)}
						<small>%</small>
					</span>
				)}
			</div>
			<div className="Coin-Body">
				<p className="Coin-Price">{parseFloat(coin.priceUsd).toFixed(5)}</p>
			</div>
		</div>
	);
};

export default Coin;
