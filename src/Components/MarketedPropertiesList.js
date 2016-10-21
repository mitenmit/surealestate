var React = require('react');

var AppActions = require('../Actions/AppActions');

var plStyles = require("../Lib/PropertyListStyles.js");
var Credit = require("../Models/Credit");

var m = require("object-assign");

var numberWithCommas = require("../Lib/NumberWithCommas.js");

function monthlyPayment(principal, rate, period){
	var n = period*12;
	var i = rate/1200;
	
	return principal*i*Math.pow(1+i, n)/(Math.pow(1+i, n) - 1);
}

var MarketedPropertiesList = React.createClass({
	getInitialState: function(){		
		return {
			propertyIndex: 0,
			priceIndex: 0,
			marketInterestRate: 0,
			creditPeriod: 30,
		};
	},
	
	getDefaultProps: function() {
		return {
		  game: null,
		}
	},
	
	lockForBuying: function(index){
		AppActions.stopGame();
		this.setState({
			propertyIndex: index,
			priceIndex: this.props.game.getPriceIndex(),
			marketInterestRate: this.props.game.getMarketInterestRate(),
		});
	},
	
	closeModal: function(){
		if(this.props.game && !this.props.game.isRunning()){
			AppActions.startGame();
		}
			
		this.setState({
			propertyIndex: 0,
			priceIndex: 0,
			marketInterestRate: 0,
		});
	},
  
	buyProperty: function(){	
		if(this.state.priceIndex){
			
			AppActions.buyProperty(
				this.state.propertyIndex, 
				this.state.priceIndex, 
				this.state.marketInterestRate,
				this.state.creditPeriod
			);
			if(this.props.game && !this.props.game.isRunning()){
				AppActions.startGame();
			}
			this.closeModal();
		}	
	},
  
	render: function() {
		if(this.props.game!==null){
			var that = this;
			var priceIndex = this.props.game.getPriceIndex();
			var savings = this.props.game.savings;
			
			var pList = this.props.game.marketedProperties;
			
			var aquisitionInfo={};
			var credit;
			
			if(this.state.priceIndex){
				aquisitionInfo.price = pList[this.state.propertyIndex].getMarketPrice(this.state.priceIndex);
				aquisitionInfo.rent = pList[this.state.propertyIndex].getMarketRent(this.state.priceIndex);
				aquisitionInfo.downpayment = pList[this.state.propertyIndex].getDownpayment(this.state.priceIndex);
				
				aquisitionInfo.creditAmount = aquisitionInfo.price - aquisitionInfo.downpayment;
				credit = new Credit({ammount: aquisitionInfo.creditAmount, interestRate: this.state.marketInterestRate, period: this.state.creditPeriod});
			}
			
			var properties = pList.map(function(item, index){
				return 	<div key={index} className="clearfix" style={plStyles.container}>
							<div style={plStyles.imgWrapper}><img src={"public/img/properties/"+item.picture} width="180"/></div>
							<div style={plStyles.priceWrapper}>
								<div style={plStyles.propertyPrice}>${numberWithCommas( item.currentPrice )}</div>
								<div style={plStyles.propertyPrice}>
									{
									savings > item.currentDownpayment ?
									<button style={plStyles.buyBtn} onClick={function(){ that.lockForBuying(index); }}>Buy</button>
									: null
									}
								</div>
							</div>
							
							<div style={plStyles.infoWrapper}>
								<div style={plStyles.propertyName}>{item.propertyName}</div>
								<div style={plStyles.propertyDescription}>{item.propertyDescription}</div>
								
								<div style={{marginTop: 10}}>
									<div style={plStyles.propertyDescription}>{item.address}</div>
									<div style={plStyles.propertyDescription}>{item.city}</div>
								</div>
								
								<div style={{marginTop: 10}}>
									<div style={plStyles.propertyDescription}>Down payment ({item.downpaymentRatio*100}%): <span style={{color: savings > item.currentDownpayment ? 'green' : 'red'}}>${numberWithCommas( item.currentDownpayment )}</span></div>
									<div style={plStyles.propertyDescription}>Expected Rent: ${numberWithCommas( item.currentRent )}</div>
									
								</div>
							</div>
						</div>;
			});
			
			return 	<div>
						{properties}
						{this.state.priceIndex ? 
							<table style={plStyles.modalWrapper} onClick={this.closeModal}>
								<tbody><tr><td><div style={plStyles.modal} onClick={function(e){e.preventDefault(); e.stopPropagation();}}>
									<h3><i className="fa fa-home"/> Property</h3>
									{pList[this.state.propertyIndex].propertyName}
									<div>Price: ${numberWithCommas( aquisitionInfo.price )}</div>
									<div>Down Payment: ${numberWithCommas( aquisitionInfo.downpayment )}</div>
									<div>Rent: ${numberWithCommas( aquisitionInfo.rent )}</div>
									
									<h3><i className="fa fa-bank"/> Loan</h3>
									<div>Loan Amount: ${numberWithCommas( aquisitionInfo.creditAmount )}</div>
									<div>
										Loan Period: 
										<span style={ m({}, plStyles.periodItem, that.state.creditPeriod == 10 ? plStyles.periodItemSelected : null ) } onClick={ function(){that.setState({creditPeriod: 10});} }>10</span> 
										<span style={ m({}, plStyles.periodItem, that.state.creditPeriod == 15 ? plStyles.periodItemSelected : null ) } onClick={ function(){that.setState({creditPeriod: 15});} }>15</span> 
										<span style={ m({}, plStyles.periodItem, that.state.creditPeriod == 20 ? plStyles.periodItemSelected : null) } onClick={ function(){that.setState({creditPeriod: 20});} }>20</span> 
										<span style={ m({}, plStyles.periodItem, that.state.creditPeriod == 25 ? plStyles.periodItemSelected : null) } onClick={ function(){that.setState({creditPeriod: 25});} }>25</span> 
										<span style={ m({}, plStyles.periodItem, that.state.creditPeriod == 30 ? plStyles.periodItemSelected : null) } onClick={ function(){that.setState({creditPeriod: 30});} }>30</span> 
										 years
									</div>
									<div>Interest Rate: {this.state.marketInterestRate}%</div>
									<div>Monthly Payment: ${numberWithCommas( credit.monthlyPayment )}</div>
									<div className="clearfix" style={{margin: "10px 0", textAlign: "center"}}><button style={plStyles.buyBtn} onClick={this.buyProperty}>Buy</button></div>
								</div></td></tr></tbody>
							</table> 
						: null}
					</div>;
		}else{
			return <div>Loading properties for sale</div>;
		}
	}
});

module.exports = MarketedPropertiesList;