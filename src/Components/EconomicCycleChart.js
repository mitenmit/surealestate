var React = require('react');

var d3 = require("d3");

var Chart = React.createClass({
  render: function() {
    return (
      <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
    );
  }
});

var Line = React.createClass({
  getDefaultProps: function() {
    return {
      path: '',
      color: 'blue',
      width: 1
    }
  },

  render: function() {
	
    return (
      <path d={this.props.path} stroke={this.props.color} strokeWidth={this.props.width} fill="none" />
    );
	
  }
});

var DataSeries = React.createClass({
  getDefaultProps: function() {
    return {
      data: [],
      interpolate: 'linear'
    }
  },

  render: function() {
    var self = this,
        props = this.props,
        yScale = props.yScale,
        xScale = props.xScale;
    
    var path = d3.svg.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .interpolate(this.props.interpolate);
	
    return (
      <Line path={path(this.props.data)} color={this.props.color} />
    );
	
  }
});

var EconomicCycleChart = React.createClass({
  getDefaultProps: function() {
    return {
      width: 300,
      height: 58
    }
  },
  
  render: function() {
	/*  
	var list = this.props.indexData.map(function(item, index){
		return <div>{item}</div>
	});
	*/
	
	var size = { width: this.props.width, height: this.props.height };
	/*
    var max = _.chain(this.props.indexData)
      .zip()
      .map(function(values) {
		
        return _.reduce(values, function(memo, value) { return Math.max(memo, value.y); }, 0);
      })
      .max()
      .value();
	*/
	
	var indexDataLength = this.props.indexData.length;
	var shownMonths = 600;
	
    var xScale = d3.scale.linear()
      .domain([indexDataLength < shownMonths ? 0 : (indexDataLength-shownMonths), indexDataLength<shownMonths ? shownMonths : indexDataLength ])
      .range([0, this.props.width]);

    var yScale = d3.scale.linear()
      .domain([0, 3])
      .range([this.props.height, 0]);
	
	//
	
	var path = d3.svg.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .interpolate('linear');
	
    return (
		<div>
			<Chart width={this.props.width} height={this.props.height}>
				<Line path={path([{x: 0, y: 0.5}, {x: 1200, y: 0.5}])} color="#DFDFDF" />
				<Line path={path([{x: 0, y: 1.0}, {x: 1200, y: 1.0}])} color="#DFDFDF" />
				<Line path={path([{x: 0, y: 1.5}, {x: 1200, y: 1.5}])} color="#DFDFDF" />
				<Line path={path([{x: 0, y: 2.0}, {x: 1200, y: 2.0}])} color="#DFDFDF" />
				<Line path={path([{x: 0, y: 0}, {x: 0, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 120, y: 0}, {x: 120, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 240, y: 0}, {x: 240, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 360, y: 0}, {x: 360, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 480, y: 0}, {x: 480, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 600, y: 0}, {x: 600, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 720, y: 0}, {x: 720, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 840, y: 0}, {x: 840, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 960, y: 0}, {x: 960, y: 3}])} color="#DFDFDF" />
				<Line path={path([{x: 1080, y: 0}, {x: 1080, y: 3}])} color="#DFDFDF" />
				
				<DataSeries data={this.props.indexData} size={size} xScale={xScale} yScale={yScale} ref="series" color="cornflowerblue" />
			</Chart>
		</div>
    );
  }
});

module.exports = EconomicCycleChart;