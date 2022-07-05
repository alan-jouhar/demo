import React, { PropsWithChildren, ReactNode, useState } from "react";
import "./coinwrapper.css";

interface CoinsWarrperProps {
	children: ReactNode[];
}
const CoinsWrapper: React.FC<CoinsWarrperProps> = ({ children }) => {
	return (
		<>
			<div className="CoinsWrapper">{children}</div>
			
		</>
	);
};

export default CoinsWrapper;
