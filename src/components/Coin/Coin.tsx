import React from "react";
import "./coin.css";
import { Link } from "react-router-dom";
import { CoinType } from "../../types/types";
interface CoinProps {
	coin: CoinType;
}
const Coin: React.FC<CoinProps> = ({ coin }) => {
	return (
		<div className="Coin">
			<Link to={`/assets/${coin.id}`} className="Coin-Link">
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
					<p className="Coin-Price">{parseFloat(coin.priceUsd).toFixed(4)}</p>
				</div>
			</Link>
		</div>
	);
};

export default Coin;
