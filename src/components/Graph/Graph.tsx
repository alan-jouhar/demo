import React, { useState, useEffect, useRef, MouseEventHandler } from "react";
import { CoinType, Price, PriceResponse } from "../../types/types";
import funObject, { day, month, year, getIntervalFromTimeRange } from "./utils";
import * as d3 from "d3";
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
	useEffect(() => {
		console.log(data)
	},[data])
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

		// append the svg object to the body of the page
		var svg = d3
			.select(graphRef.current)
			.attr("width", bodyWidth)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("width", bodyWidth)
			.attr("height", height + margin.top + margin.bottom)
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
			.call(d3.axisBottom(x).ticks(5))
			.selectAll(".tick");

		// Add Y axis
		var y = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d) => parseFloat(d.priceUsd))! * 0.995,
				d3.max(data, (d) => parseFloat(d.priceUsd))! * 1.005,
			])
			.range([height, 0]);

		svg.append("g").call(d3.axisLeft(y));
		// Add the area

		svg
			.append("path")
			.datum(
				data.map((e) => [e.time, parseFloat(e.priceUsd)] as [number, number])
			)
			.attr("id", "path")
			.attr("fill", "#cce5df")
			.attr("stroke", "#69b3a2")
			.attr("stroke-width", 1.5)
			.attr(
				"d",
				d3
					.area()
					.curve(d3.curveCardinal)
					.x(function (d) {
						return x(d[0]);
					})
					.y0(y(d3.min(data, (d) => parseFloat(d.priceUsd) * 0.995) as number))
					.y1(function (d) {
						return y(d[1]);
					})
			);
		svg
			.append("rect")
			.attr("id", "wrapper")
			.attr("width", width)
			.attr("height", height)
			.attr("fill", "none")
			.attr("pointer-events", "all");

		const dateBisector = d3.bisector((d: Price) => d.time).center;
		svg.select("#wrapper").on("mouseenter", (e: MouseEvent) => {
			const pos = (e.currentTarget as SVGElement).getBoundingClientRect();
			if (svg.select("#toolTip").empty()) {
				var path = d3.path();
				path.moveTo(
					0,
					y(d3.min(data, (d) => parseFloat(d.priceUsd) * 0.995) as number)
				);
				path.lineTo(0, 75);
				path.closePath();
				svg
					.append("text")
					.attr("id", "text")
					.text(`${Math.floor(e.clientX - 10)} - ${Math.floor(e.clientY)}`);
				svg
					.append("path")
					.attr("d", path.toString())
					.attr("id", "toolTip")
					.attr("stroke", "red");
			}
		});
		svg.select("#wrapper").on("mousemove", (e: MouseEvent) => {
			let index = dateBisector(data, x.invert(e.offsetX - 50));
			let price = data[index].priceUsd;
			let pathData = svg.select("#toolTip").attr("d");
			let newPath = pathData.replace(/\d+Z/,`${Math.floor(y(parseFloat(price)))}Z`)
			svg
				.select("#text")
				.text(`${parseInt(data[index].priceUsd)} - ${d3.timeFormat('%B %d, %Y    %H:%M:%S')(new Date(data[index].time))}`)
				.attr("transform", `translate(${e.offsetX - 50},${Math.floor(y(parseFloat(price)))})`)
			
			svg
				.select("#toolTip")
				.attr("d", newPath)
				.attr("transform", `translate(${e.clientX - 66},0)`);
		});
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
