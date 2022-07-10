import React, { useState, useEffect, useRef } from "react";
import { CoinType, Price, PriceResponse } from "../../types/types";
import * as d3 from "d3";

const Graph: React.FC<{ id: string }> = ({ id }) => {
	const [data, setData] = useState<Price[]>([]);
	const graphRef = useRef<HTMLDivElement>(null);
	const fetchData = async () => {
		let response = await fetch(
			"https://api.coincap.io/v2/assets/bitcoin/history?interval=d1"
		);
		let json = response.json() as Promise<PriceResponse>;
		setData((await json).data);
	};
	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		if(data.length === 0)
			return
		// set the dimensions and margins of the graph
		var margin = { top: 10, right: 30, bottom: 30, left: 50 },
			width = 530 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3
			.select(graphRef.current)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var x = d3
			.scaleTime()
			.domain(
				d3.extent(data, function (d) {
					return new Date(d.time);
				}) as [Date, Date]
			)
			.range([0, width]);
		svg
			.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// Add Y axis
		var y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(data, function (d) {
					return parseFloat(d.priceUsd);
				}) as number,
			])
			.range([height, 0]);
		svg.append("g").call(d3.axisLeft(y));

		// Add the area
		svg
			.append("path")
			.datum(data.map(e => [e.time, parseFloat(e.priceUsd)] as [number,number]))
			.attr("fill", "#cce5df")
			.attr("stroke", "#69b3a2")
			.attr("stroke-width", 1.5)
			.attr(
				"d",
				d3
					.area()
					.x(function (d) {
						return x(d[0]);
					})
					.y0(y(0))
					.y1(function (d) {
						return y(d[1]);
					})
			);
		
	}, [data]);

	return <div className="Graph" ref={graphRef}></div>;
};

export default Graph;
