import React, { useState, useEffect, useRef } from "react";
import { Price, PriceResponse } from "../../types/types";
import funObject, { getIntervalFromTimeRange, renderGraph } from "./utils";
import "./graph.css";
import { TimeRanges, timeIntervals } from "../../types/types";
const Graph: React.FC<{ id: string }> = ({ id }) => {
	const [data, setData] = useState<Price[]>([]);
	const [timeRange, setTimeRange] = useState<TimeRanges>("day");
	const [timeInterval, setTimeInterval] = useState<timeIntervals>("m1");

	const graphRef = useRef<SVGSVGElement>(null);
	const sliderRef = useRef<HTMLDivElement>(null);
	const fetchData = async () => {
		let response = await fetch(
			`https://api.coincap.io/v2/assets/${id}/history?interval=${timeInterval}&${funObject[
				timeRange
			]()}`
		);
		let json = response.json() as Promise<PriceResponse>;
		setData((await json).data);
	};
	const changeInterval = (
		timeRange: TimeRanges,
		e: React.MouseEvent<HTMLDivElement>
	) => {
		let interval = getIntervalFromTimeRange(timeRange);
		setTimeInterval(interval);
		setTimeRange(timeRange);
		let target = e.target as HTMLDivElement;
		if (sliderRef.current !== null) {
			sliderRef.current.style.left = `${target.offsetLeft}px`;
		}
	};
	useEffect(() => {}, [data]);
	useEffect(() => {
		fetchData();
	}, [timeRange, timeInterval]);
	useEffect(() => {
		if (data.length === 0) return;
		if (graphRef.current?.childElementCount! > 0) {
			graphRef.current?.childNodes.forEach((e) => e.remove());
		}

		// set the dimensions and margins of the graph
		let bodyWidth =
			parseFloat(
				window.getComputedStyle(document.body).getPropertyValue("width")
			) -
			parseFloat(
				window.getComputedStyle(document.body).getPropertyValue("padding")
			) *
				2;
		let bodyHeight = bodyWidth * 0.75;
		var margin = { top: 10, right: 30, bottom: 30, left: 50 },
			width = bodyWidth - margin.left - margin.right,
			height = bodyHeight - margin.top - margin.bottom;
		renderGraph(graphRef, margin, bodyWidth, height, width, data);
	}, [data]);

	return (
		<div className="Graph">
			<div className="Graph-Controls-Wrapper">
				<div className="Graph-Slider" ref={sliderRef}></div>
				<div
					className="Graph-Control"
					onClick={(e) => changeInterval("day", e)}
				>
					Day
				</div>
				<div
					className="Graph-Control"
					onClick={(e) => changeInterval("week", e)}
				>
					Week
				</div>
				<div
					className="Graph-Control"
					onClick={(e) => changeInterval("month", e)}
				>
					Month
				</div>
				<div
					className="Graph-Control"
					onClick={(e) => changeInterval("year", e)}
				>
					Year
				</div>
				<div
					className="Graph-Control"
					onClick={(e) => changeInterval("max", e)}
				>
					Max
				</div>
			</div>
			<div className="Graph-Plot mt-5">
				<svg ref={graphRef}></svg>
			</div>
		</div>
	);
};

export default Graph;
