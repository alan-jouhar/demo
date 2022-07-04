import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import "./nav.css";
type NavProps = {
	pages: NavItem[];
};
type NavItem = {
	path: string;
	name: string;
};
const Nav: React.FC<NavProps> = (props: NavProps) => {
	const animateItem: React.MouseEventHandler<HTMLLIElement> = (e) => {
		let traget = e.currentTarget as HTMLLIElement;
		traget.animate(keyFrameObjects,{
			duration: 500,
			iterations:1
		})
		traget.classList.toggle("Nav-Item_magnified");
	};

	const keyFrameObjects: Keyframe[] = [
		{
			transform: "scale(0.5)",
		},
		{
			transform: "scale(1)",
		},
		{
			transform: "scale(0.8)",
		},
		{
			transform: "scale(1)",
		},
	];

	return (
		<nav className="Nav">
			<ul className="Nav-List">
				{props.pages.map((page) => (
					<li key={page.name} className="Nav-Item" onClick={animateItem}>
						<Link to={page.path} className="Nav-Link">
							{page.name.toUpperCase()}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
export default Nav;
