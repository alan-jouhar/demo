import React from "react";
import {Link} from 'react-router-dom'
type NavProps = {
	pages: NavItem[];
};
type NavItem = {
	path: string;
	name: string;
};
const Nav: React.FC<NavProps> = (props: NavProps) => {
	return (
		<nav>
			<ul>
				{props.pages.map((page) => (
					<li key={page.name}>
						<Link to={page.path}>{page.name}</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
export default Nav;
