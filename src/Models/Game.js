var EconomicCycle = require("./EconomicCycle");
var Property = require("./Property");
var Credit = require("./Credit");

var AllProperties = require("../Lib/AllProperties");

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var Model = function() {
  this.months = 0;
  this.savings = 10000;
  this.paycheck = 500.0;
  this.totalLoans = 0;
  
  this.monthlyLoanPayments = 0;
  this.monthlyIncome = this.paycheck;
  
  this.running = false;
  
  this.interval = null;
  this.store = null;
  
  this.economicCycle = new EconomicCycle();
  this.priceIndexMap = [{x: 0, y: 1}];
  
  this.properties = [];
  
  this.marketedProperties = [];
  
  for(var i=0; i<AllProperties.length; i++){
	this.marketedProperties.push( new Property(AllProperties[i]) );
  }
  
  this.recalcMarketedProperties( this.getPriceIndex() );
  
  console.log(this.marketedProperties);
  
};

Model.prototype.nextTick = function(){
	if(this.months<=1200){
		this.months++;
		this.priceIndexMap.push( {x:this.months, y: this.economicCycle.nextPriceIndex()} );
		
		this.recalcMarketedProperties( this.getPriceIndex() );
		this.recalcProperties( this.getPriceIndex() );
		
		this.savings += this.monthlyIncome;
		
		this.store && this.store.emitChange();
	}	
}

Model.prototype.startGame = function(store){
	this.interval = setInterval(this.nextTick.bind(this), 1000);
	this.running = true;
	this.store = store ? store : null;
}

Model.prototype.pauseGame = function(){
	this.running = false;
	clearInterval(this.interval);
}

Model.prototype.stopGame = function(){
	this.running = false;
	clearInterval(this.interval);
}

Model.prototype.getMonth = function(){
	return monthNames[this.months%12];
}

Model.prototype.getYear = function(){
	return ( 2000 + parseInt(this.months/12) );
}

Model.prototype.isRunning = function(){
	return !!this.running;
}

Model.prototype.getPriceIndex = function(){
	return this.priceIndexMap[this.months].y;
}

Model.prototype.getSavings = function(){
	return Math.round(this.savings*100)/100;
}

Model.prototype.getPriceIndexMap = function(){
	return this.priceIndexMap;
}

Model.prototype.getMarketInterestRate = function(){
	
	return Math.round((this.economicCycle.getBaseRate() + 2)*100)/100;
}

Model.prototype.recalcMarketedProperties = function(priceIndex){
	for(var i=0; i<this.marketedProperties.length;i++){
		this.marketedProperties[i].currentPrice = this.marketedProperties[i].getMarketPrice(priceIndex);
		this.marketedProperties[i].currentRent = this.marketedProperties[i].getMarketRent(priceIndex);
		this.marketedProperties[i].currentDownpayment = this.marketedProperties[i].getDownpayment(priceIndex);
	}
}

Model.prototype.recalcProperties = function(priceIndex){
	this.monthlyIncome = this.paycheck;
	
	this.totalLoans = 0;
	this.monthlyLoanPayments = 0;
	
	for(var i=0; i<this.properties.length;i++){
		this.properties[i].currentPrice = this.properties[i].getMarketPrice(priceIndex);
		this.properties[i].currentRent = this.properties[i].getMarketRent(priceIndex);
		this.properties[i].currentDownpayment = this.properties[i].getDownpayment(priceIndex); //Math.round(this.properties[i].currentPrice*this.properties[i].downpaymentRatio);
		
		if(this.properties[i].credit && this.properties[i].credit.isActive()){
			this.properties[i].credit.amortize();
			
			this.totalLoans += this.properties[i].credit.getPrincipal();
			this.monthlyLoanPayments += this.properties[i].credit.getMonthlyPayment();
		}
		
		this.monthlyIncome += this.properties[i].currentRent-(this.properties[i].credit.isActive() ? this.properties[i].credit.getMonthlyPayment() : 0);
		
		//console.log("Monthly Payment - ", i,":", this.properties[i].credit.getMonthlyPayment());
	}
	//console.log("Monthly Income - ", this.monthlyIncome);
	this.totalLoans = Math.round(this.totalLoans*100)/100;
	this.monthlyLoanPayments = Math.round(this.monthlyLoanPayments*100)/100;
	this.monthlyIncome = Math.round(this.monthlyIncome*100)/100;
}

Model.prototype.buyProperty = function(propertyIndex, priceIndex, marketInterestRate, creditPeriod){
	var downpayment = this.marketedProperties[propertyIndex].getDownpayment(priceIndex); //this.marketedProperties[propertyIndex].getMarketPrice(priceIndex)*this.marketedProperties[propertyIndex].downpaymentRatio;
	var creditAmount;
	
	console.log("Credit period:", creditPeriod);
	
	if(this.savings > downpayment){
		this.savings -= downpayment;
		this.properties.push( new Property(this.marketedProperties[propertyIndex]) );
		
		var lastPropIndex = this.properties.length-1;
		this.properties[lastPropIndex].aquisitionPrice = this.properties[lastPropIndex].getMarketPrice(priceIndex);
		this.properties[lastPropIndex].aquisitionDownpayment = downpayment;
		
		this.properties[lastPropIndex].credit = new Credit({ammount: this.properties[lastPropIndex].aquisitionPrice-downpayment, interestRate: marketInterestRate, period: creditPeriod});
		
		this.marketedProperties.splice(propertyIndex, 1);
		this.recalcProperties(this.getPriceIndex());
	}else{
		console.log("Not enough money");
	}	
}

Model.prototype.sellProperty = function(propertyIndex, priceIndex){
	var earnings = Math.round( (this.properties[propertyIndex].getMarketPrice(priceIndex)-this.properties[propertyIndex].credit.principal)*100 )/100;
	var sold = {}, i=0;;
	
	this.savings += earnings;
	sold = this.properties.splice(propertyIndex, 1);
	
	while(this.marketedProperties[i].basePrice<sold[0].basePrice){
		i++;
	}
	this.marketedProperties.splice(i, 0, new Property(sold[0]));
	//console.log(sold[0]);
}

Model.prototype.repayLoan = function(index, value){
	if(this.savings >= value){
		this.savings -= value;
		
		if(this.properties[index].credit.principal - value > 0.01){
			this.properties[index].credit = new Credit({
				ammount: this.properties[index].credit.principal - value,
				interestRate: this.properties[index].credit.interestRate,
				period: this.properties[index].credit.period/12,
			});
		}else{
			this.properties[index].credit = new Credit();
		}			
	}
}

Model.prototype.addNews = function(){
	this.economicCycle.addNews();
}

Model.prototype.getNews = function(){
	return this.economicCycle.news;
}

module.exports = Model;