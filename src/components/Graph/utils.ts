import { timeIntervals, TimeRanges } from "../../types/types";
export const year = (years = 1) => {
	const yearInMilliSeconds = 360 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - yearInMilliSeconds * years, currentDate];
	return `start=${start}&end=${end}`;
};

export const month = (monthes = 1) => {
	const monthInMilliSeconds = 30 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - monthInMilliSeconds * monthes, currentDate];
	return `start=${start}&end=${end}`;
};

export const week = (weeks = 1) => {
	const weekInMilliSeconds = 7 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - weekInMilliSeconds * weeks, currentDate];
	return `start=${start}&end=${end}`;
};

export const day = (days = 1) => {
	const dayInMilliSeconds = 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - dayInMilliSeconds * days, currentDate];
	return `start=${start}&end=${end}`;
};
const max = () => {
	const yearInMilliSeconds = 11 * 360 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - yearInMilliSeconds, currentDate];
	return `start=${start}&end=${end}`;
};
export const getIntervalFromTimeRange = (timeRange: TimeRanges):timeIntervals => {
	switch (timeRange) {
		case "day":
			return "m1";
		case "week":
			return "m15";
		case "month":
			return "h1";
		case "year":
		case "max":
			return "d1";
	}
};
const defaultObj = { day, week, month, year, max };

export default defaultObj;
