var Model = function(credit) {
	if(typeof credit === "object" && credit !== null){
		this.ammount = credit.ammount;
		this.principal = credit.ammount;
		this.interestRate = credit.interestRate;
		this.period = credit.period*12;
		this.months = 0;
	
		this.monthlyPayment = this.getMonthlyPayment();
	}else{
		this.ammount = 0;
		this.principal = 0;
		this.interestRate = 0;
		this.period = 0;
	
		this.monthlyPayment = 0;
	}		
}

Model.prototype.getPrincipal = function(){
	return Math.round(this.principal*100)/100;	
}

Model.prototype.getMonthlyPayment = function(){
	var n = this.period;
	var i = this.interestRate/1200;
	
	return this.isActive() ? Math.round( (this.principal*i*Math.pow(1+i, n)/(Math.pow(1+i, n) - 1))*100)/100 : 0;
}

Model.prototype.isActive = function(){
	return this.period>this.months;
}

Model.prototype.amortize = function(){
	var interest = this.principal*this.interestRate/1200;
	this.months++;
	
	this.principal -= Math.round( (this.monthlyPayment-interest)*100 )/100;
	//console.log(this.months, interest, this.principal);
}

module.exports = Model;