import React from 'react';
//var React = require('react');
var ReactDOM = require('react-dom');

var Home = require('./Screens/Home');

var App = React.createClass({
	
	render: function(){
		return <Home />
	}		
	
});


ReactDOM.render(<App/>, document.getElementById("app"));