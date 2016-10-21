var React = require('react');

var AppActions = require('../Actions/AppActions');

var Credit = require("../Models/Credit");

var m = require("object-assign");
var plStyles = require("../Lib/PropertyListStyles.js");
var numberWithCommas = require("../Lib/NumberWithCommas.js");

var SliderBar = React.createClass({
	getInitialState: function(){		
		return {
			position: 0,
			start: 0,
			delta: 0,
			pos: 0,
			dragging: 0,
		};
	},
	
	getDefaultProps: function() {
		return {
		  width: 100,
		}
	},
	
	onMouseDown: function(e){
		this.setState({start: this.refs.container.getBoundingClientRect().x, dragging: 1,});
		
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	},
	
	onMouseMove: function(e){
		var value = e["clientX"] - this.state.start;
		if(this.state.dragging && value>=0 && value<=this.props.width){
			//console.log(value*100 / this.props.width );
			this.setState({pos: value,});
			this.props.onChange && this.props.onChange( Math.round(value*100/this.props.width)/100 );
		}
		
		if(this.state.dragging && value<0){
			this.setState({pos: 0,});
			this.props.onChange && this.props.onChange( 0 );
		}
		
		if(this.state.dragging && value>this.props.width){
			this.setState({pos: this.props.width,});
			this.props.onChange && this.props.onChange( 1 );
		}
		
	},
	
	onMouseUp: function(e){
		this.setState({dragging: 0, pos: this.state.pos+this.state.delta});
		
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	},
	
	position: function(e){
		var x = this.refs.slider.getBoundingClientRect().x; 
		return x;
	},
	
	render: function(){
		return 	<div ref="container" style={{width: this.props.width, height: 0, borderTop: "1px solid #000000", borderBottom: "1px solid #DFDFDF", margin: "10px 0px"}}>
					<div style={{
								position: "relative",
								left: this.state.pos,
								width: 20, 
								height: 20, 
								borderRadius: 10, 
								background: "#DFDFDF", 
								marginTop: -11, 
								marginLeft: -10,
								boxShadow: "1px 2px 2px rgba(0,0,0, 0.3)",
								border: "1px solid #AFAFAF"
								}}
						onMouseDown = {this.onMouseDown}
						ref="slider"
					>
					</div>
				</div>
	}
});

var RepayButton = React.createClass({
	getInitialState: function(){
		return {
			scale: 1,
		};
	},
	
	getDefaultProps: function(){
		return {
			propertyIndex: -1,
			repayLoan: 0,
		};
	},
	
	onMouseDown: function(){
		this.setState({scale: 0.9});
		document.addEventListener('dragend', this.onMouseUp);
	},

	onMouseUp: function(){
		this.setState({scale: 1});
		document.removeEventListener('dragend', this.onMouseUp);
	},

	onClick: function(){
		if(this.props.propertyIndex>-1 && this.props.repayLoan){
			AppActions.repayLoan(this.props.propertyIndex, this.props.repayLoan);
			//alert("Repay - Index: "+this.props.propertyIndex+" Ammount: "+this.props.repayLoan);
		}
		
	},
	
	render: function(){
		return 	<div style={{
					float: "left",
					transition: "all 0.05s ease-in",
					transform: "scale("+this.state.scale+","+this.state.scale+")",
				}}>
				<a 	href="javascript:" 
					style={{	
								textDecoration: "none", 
								color: "#0d3c5f", 
								fontWeight: "bold", 
								marginLeft: 10,
							}} 
					onClick={this.onClick}
					onMouseDown={this.onMouseDown}
					onMouseUp={this.onMouseUp}
				>
						<i className="fa fa-money"/> Repay
				</a>
				</div>
	}
});

var OwnedPropertiesList = React.createClass({
	getInitialState: function(){		
		return {
			propertyIndex: -1,
			priceIndex: 0,
			marketInterestRate: 0,
			creditSlider: 0,
			hovered: -1,
		};
	},
	
	getDefaultProps: function() {
		return {
		  game: null,
		}
	},
	
	showInfo: function(index){
		this.setState({
			propertyIndex: index,
			priceIndex: this.props.game.getPriceIndex(),
			marketInterestRate: this.props.game.getMarketInterestRate(),
		});
	},
	
	closeModal: function(){
		this.setState({
			propertyIndex: -1,
			priceIndex: 0,
			marketInterestRate: 0,
			creditSlider: 0,
		});
	},
  
	sellProperty: function(propertyIndex){	
		AppActions.sellProperty(propertyIndex, this.props.game.getPriceIndex());
		//if(this.state.priceIndex){
			//this.closeModal();
		//}	
	},
	
	onCardOver: function(index){
		this.setState({hovered: index});
	},
	
	onCardOut: function(){
		this.setState({hovered: -1});
	},
  
	render: function() {
		if(this.props.game!==null){
			var that = this;
			var priceIndex = this.props.game.getPriceIndex();
			var savings = this.props.game.savings;
			
			var pList = this.props.game.properties;
			
			var repayLoan;
			
			if(this.state.propertyIndex>-1){
				repayLoan = Math.round(this.state.creditSlider*pList[this.state.propertyIndex].credit.getPrincipal()*100)/100.0;
			}else{
				repayLoan = 0;
			}	
			
			var properties = pList.map(function(item, index){
				var boxShadow = that.state.hovered==index ? "1px 2px 3px rgba(0,0,0, 0.1)" : "none";
				return 	<div key={index} className="clearfix" style={m({}, plStyles.container,{boxShadow: boxShadow, transition: "all 0.1s ease-in"}) } onMouseOver={function(){ that.onCardOver(index); }} onMouseOut={that.onCardOut}>
							<div style={plStyles.imgWrapper}>
								<a href="javascript:" onClick={function(){that.showInfo(index);} }><img src={"public/img/properties/"+item.picture} width="180"/></a>
							</div>
							<div style={plStyles.priceWrapper}>
								<div style={plStyles.propertyPrice}>${numberWithCommas( item.currentPrice )}</div>
								<div style={plStyles.propertyPrice}>
									<button style={plStyles.sellBtn} onClick={function(){ that.sellProperty(index); }}>Sell</button>
								</div>
							</div>
							
							<div style={plStyles.infoWrapper}>
								<div style={plStyles.propertyName}><a style={plStyles.propertyNameLink} href="javascript:" onClick={function(){that.showInfo(index);} }>{item.propertyName}</a></div>
								<div style={plStyles.propertyDescription}>{item.propertyDescription}</div>
								
								<div style={{marginTop: 10}}>
									<div style={plStyles.propertyDescription}>{item.address}</div>
									<div style={plStyles.propertyDescription}>{item.city}</div>
								</div>
								
								<div style={{marginTop: 10}}>
									<div style={plStyles.propertyDescription}>Aquisition price: ${numberWithCommas( item.aquisitionPrice )} (<span style={{color: item.currentPrice > item.aquisitionPrice ? 'green' : 'red'}}>{numberWithCommas( item.currentPrice - item.aquisitionPrice )}</span>)</div>
									<div style={plStyles.propertyDescription}>Current Rent: ${numberWithCommas( item.currentRent )}</div>
									<div style={plStyles.propertyDescription}>Monthly Loan Payment: {numberWithCommas( item.credit.getMonthlyPayment() )}</div>
									
								</div>
							</div>
						</div>;
			});
			
			if(pList.length == 0) return <div>You don't own properties yet. Buy your first property and start building your real estate business.</div>;
			
			return 	<div>
						{properties}
												
						{this.state.propertyIndex>-1 ? 
							<table style={plStyles.modalWrapper} onClick={this.closeModal}>
								<tbody><tr><td><div style={m({}, plStyles.modal, {height: "auto"})} onClick={function(e){e.preventDefault(); e.stopPropagation();}}>
									<div className="clearfix">
										<div style={{float: "left"}}><img src={"public/img/properties/"+pList[this.state.propertyIndex].picture} width="180"/></div>
										<div style={{float: "left", marginLeft: 10}}>
											<div><strong>{pList[this.state.propertyIndex].propertyName}</strong></div>
											<div>{pList[this.state.propertyIndex].propertyDescription}</div>
											
											<div>Value in the property: {
												numberWithCommas( Math.round( (pList[this.state.propertyIndex].currentPrice - pList[this.state.propertyIndex].credit.getPrincipal())*100 )/100 )}
											</div>
										</div>	
									</div>
									
									<h3><i className="fa fa-bank"/> Loan</h3>
									<div style={{borderBottom: "1px solid #DFDFDF"}}>Loan Principal: ${numberWithCommas( pList[this.state.propertyIndex].credit.getPrincipal() )}</div>
									<div className="clearfix">
										<div style={{float: "left", marginRight: 20, marginLeft: 10, marginTop: 5}}>
											<SliderBar onChange={function(value){ that.setState({creditSlider: value}); }}/> 
										</div>
										<div className="clearfix" style={{float: "left", marginTop: 3}}>
											<span style={{float: "left"}}>${numberWithCommas( repayLoan )}</span>
											{
												repayLoan <= this.props.game.savings ?
												<RepayButton propertyIndex={this.state.propertyIndex} repayLoan={repayLoan}/> : 
												null
											}
										</div>
									</div>	
									<div className="clearfix"><button style={m({float: "right"}, plStyles.buyBtn)} onClick={this.closeModal}>Close</button></div>
								</div></td></tr></tbody>
							</table> 
						: null}
					</div>;
		}else{
			return <div>Loading properties for sale</div>;
		}
	}
});

module.exports = OwnedPropertiesList;