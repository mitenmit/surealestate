var Model = function(property) {
	this.setProperty(property);
}

Model.prototype.getBaseRent = function(){
	return this.basePERatio!=0 ? Math.round(this.basePrice/(this.basePERatio*12)) : 0;
}

Model.prototype.setProperty = function(property){
	if(typeof property === "object" && property !== null){
		this.propertyName = property.propertyName;
		this.propertyDescription = property.propertyDescription;
		this.address = property.address;
		this.city = property.city;
		this.basePrice = property.basePrice;
		this.basePERatio = property.basePERatio;
		this.downpaymentRatio = property.downpaymentRatio;
		this.picture = property.picture;
		
		this.currentDownpayment = 0;
		
		this.baseRent = this.getBaseRent();
		
		this.credit = null;
	}else{
		this.basePrice = 0;
		this.basePERatio = 0;
		
		this.credit = null;
	}
}

Model.prototype.getMarketPrice = function(priceIndex){
	return Math.round(this.basePrice*priceIndex);
}

Model.prototype.getMarketRent = function(priceIndex){
	return Math.round(this.baseRent*((priceIndex-1)/3+1));
}

Model.prototype.getDownpayment = function(priceIndex){
	return Math.round(this.basePrice*priceIndex*this.downpaymentRatio);
}

Model.prototype.buyProperty = function(priceIndex, marketInterestRate){
	var downpayment = this.getDownpayment(priceIndex);	
}

Model.getValueInProperty = function(){
	var principal = 0;
	
	if( this.credit.isActive() ) princpipal = this.credit.getPrincipal();
	
	return Math.round( (this.basePrice*priceIndex-principal)*100 )/100;
}

module.exports = Model;