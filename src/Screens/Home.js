var React = require('react');

var AppActions = require('../Actions/AppActions');
var GameStore = require('../Stores/GameStore');

var EconomicCycleChart = require("../Components/EconomicCycleChart");
var MarketedPropertiesList = require("../Components/MarketedPropertiesList");
var OwnedPropertiesList = require("../Components/OwnedPropertiesList");

var m   = require('object-assign');
var plStyles = require("../Lib/PropertyListStyles.js");
var numberWithCommas = require("../Lib/NumberWithCommas.js");

//var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//var paycheck = 500;

/*
function nextPriceIndex(oldPriceIndex){
	var volatility = 0.05;
	var rnd = Math.random();
	var changePercent = 2*volatility*rnd;
	var changeAmount;

	if(changePercent > volatility){
		changePercent -= (2*volatility);
	}

	changeAmount = oldPriceIndex*changePercent;
	return oldPriceIndex+changeAmount;
}

function generateEconomicCycle(){
	var index = 100;
	var result = [];

	for(var i=0;i<12000;i++){
		index = nextPriceIndex(index);
		result.push(index);
	}

	return result;
}
*/
var PauseButton = React.createClass({
	getInitialState: function(){
		return{
			scale: 1,
		};
	},

	onMouseDown: function(){
		this.setState({scale: 0.9});
		document.addEventListener('mouseup', this.onMouseUp);
	},

	onMouseUp: function(){
		this.setState({scale: 1});
		document.removeEventListener('mouseup', this.onMouseUp);
	},

	onClick: function(){
		//alert("Pause");
		this.props.isRunning ? AppActions.stopGame() : AppActions.startGame();
	},

	render: function(){
		return 	<div 	style={ m({}, styles.pauseBtn, {userSelect: "none", transform: "scale("+this.state.scale+","+this.state.scale+")"}) } 
						onMouseDown={this.onMouseDown} 
						onMouseUp={this.onMouseUp} 
						onClick={this.onClick}
						onSelect={function(e){e.preventDefault(); e.stopPropagation(); }}
					>
					{
						this.props.isRunning ?
						<span><i className="fa fa-pause"/> Pause</span> :
						<span><i className="fa fa-play"/> Resume</span>
					}
				</div>
	}
});

var AddNewsButton = React.createClass({

	onClick: function(){
		//alert("Pause");
		AppActions.addNews();
	},

	render: function(){
		//return <div style={styles.pauseBtn} onClick={this.onClick}>Add News</div>
		return null;
	}
});

module.exports = React.createClass({
	getInitialState: function(){
		return {
			game: null,
			secondsElapsed: 0,
			savings: 10000,
			welcome: 1,
		};
	},
	/*
	tick: function() {
		this.pIndex = nextPriceIndex(this.pIndex);
		this.economicCycle.push(this.pIndex);
		this.setState({secondsElapsed: this.state.secondsElapsed + 1, savings: this.state.savings+paycheck});
	},
	*/
	componentWillMount: function(){
		//this.economicCycle = [100]; //generateEconomicCycle();
		//this.pIndex = 100;
		AppActions.appLaunched();
	},

	componentDidMount: function(){
		//this.interval = setInterval(this.tick, 1000);
		GameStore.addChangeListener(this._onGameEvent);
		this.setState({game: GameStore.get()});
		//AppActions.startGame();
	},

	componentWillUnmount: function(){
		//clearInterval(this.interval);
		AppActions.stopGame();
		GameStore.removeChangeListener(this._onGameEvent);
	},

	_onGameEvent: function(){
		//console.log( "GameEvent" );
		this.setState({game: GameStore.get()});
	},

	closeWelcomeModal: function(){
		this.setState({welcome: 0});
		//AppActions.startGame();
	},

	render: function(){
		/*
		var month = (this.state.secondsElapsed % 12);
		var year = 2000+parseInt(this.state.secondsElapsed/12);

		var data = this.economicCycle.map(function(item, index){
			if(index<600)
				return <div key={index} style={{width:2, float: "left", height: item, marginTop: 300-item, background: "#0000FF"}}></div>;
			else
				return null;
		});

		return (<div style={{fontWeight: "bold", fontFamily: "arial"}}>
					<div>
						<div style={{textAlign: "left", float: "left", padding: 10, background: "#DFDFDF", borderRadius: 5}}>Savings: ${this.state.savings}</div>
						<div style={{textAlign: "left", float: "left", padding: 10, background: "#DFDFDF", borderRadius: 5}}>RE Index: {this.pIndex/100}</div>
						<div style={{textAlign: "right", float: "right", padding: 10, width: 150, background: "#DFDFDF", borderRadius: 5}}>{ months[month] } {year}</div>
						<div style={{clear: "both"}}></div>
					</div>
					<div>{data}</div>
				</div>);
		*/
		if(this.state.game != null){
			var news = this.state.game.getNews();
			return 	<div>
						<div style={styles.header} className="clearfix">
							<div style={{float: "left"}}>
								<div>Savings: <strong>${numberWithCommas( this.state.game.getSavings() ) }</strong></div>
								<div>Total Loans: ${numberWithCommas( this.state.game.totalLoans )}</div>

								<div>Total Monthly Income: ${numberWithCommas( this.state.game.monthlyIncome+this.state.game.monthlyLoanPayments )}</div>
								<div>Monthly Loan Pay: ${numberWithCommas(this.state.game.monthlyLoanPayments)}</div>
								<div>Net Monthly Income: ${numberWithCommas(this.state.game.monthlyIncome)}</div>
							</div>
							<div style={{float: "right"}}>
								<div className="clearfix">
									<div style={{fontSize: 11, fontWeight: "bold", color: "#333333", float: "left"}}>
										Real Estate Index (<span style={{color: "#000000"}}>{ (Math.round(this.state.game.getPriceIndex()*100)/100) }</span>)
									</div>
									
									<div style={{fontSize: 11, fontWeight: "bold", color: "#333333", float: "right"}}>
										Interest Rate: {this.state.game.getMarketInterestRate()}% 
									</div>
								</div>	
								<EconomicCycleChart indexData={this.state.game.getPriceIndexMap()} />
								<div style={{fontSize: 11, fontWeight: "bold"}}>{ news && news.length ? news[0].text : "The market has unknown direction"}</div>
							</div>
							<div className="clearfix" style={{width: 200, textAlign: "center", margin: "0 auto"}}>
								<div style={{fontSize: 16, fontWeight: "bold", textShadow:"1px 1px rgba(0, 0, 0, 0.1)", color: "#333333"}}>{this.state.game.getMonth()} {this.state.game.getYear()}</div>
								<PauseButton isRunning={this.state.game.isRunning()}/>
								<AddNewsButton />
							</div>
						</div>

						<div className="clearfix" style={{background: "#EFEFEF", padding: 10, marginTop: 110}}>
							<div style={{width: "49%", float: "left"}}>
								<h3>Properties for sale</h3>
								<MarketedPropertiesList game={this.state.game}/>
							</div>

							<div style={{width: "49%", float: "right"}}>
								<h3>Owned properties</h3>
								<OwnedPropertiesList game={this.state.game}/>
							</div>
						</div>

						{this.state.welcome ?
							<table style={plStyles.modalWrapper} onClick={this.closeWelcomeModal}>
								<tbody><tr><td><div style={m({}, plStyles.modal, {width:600, height: 400})} onClick={function(e){e.preventDefault(); e.stopPropagation();}}>
									<div style={{textAlign: "center"}}><img src="public/img/art/mogul.jpg" width="100"/></div>
									<h3>Welcome to surReal Estate</h3>
									<div>
									The game where you become a real estate investor.<br /><br />
									The goal is to <strong>become a billionaire in 100 years</strong>. Your journey of glory begins in January 2000, when you have saved enought to buy your first property. You pay 10% to 20% of the price(the downpayment) and the bank will lend you the rest. This property will provide a rent in return and you will also be paying loan monthly payments until you repay the debt.<br /><br />
									Beware of the economic cycle as real estate and rents will go up and down periodically, indicated by the Real Estate Index in the top right corner of the screen.<br /><br />
									The game will last around 40 minutes.
									<div style={{margin: "10px 0", textAlign: "center"}}><button style={plStyles.buyBtn} onClick={this.closeWelcomeModal}>OK, Let&#39;s make some money</button></div>
									</div>
								</div></td></tr></tbody>
							</table>
						: null}
					</div>;
		}else{
			return <div>Loading</div>;
		}
	}
});

var styles = {
	header: {
		borderBottom: "1px solid #DFDFDF",
		padding: 10,
		boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
		position: "fixed",
		left: 0,
		right: 0,
		top: 0,
		height: 95,
		background: "#FFFFFF",
		zIndex: 5,
	},

	pauseBtn: {
		//float: "left",
		//padding: "5px 10px",
		color: "#0d3c5f",
		//background: "#337ab7",
		//border: "1px solid #2e6da4",
		cursor: "pointer",
		//borderRadius: 5,
		marginRight: 10,
		transition: "all 0.05s ease-in",
	},

};
