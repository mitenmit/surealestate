/*
 *	NEWS OBJECT
 *		impactPeriod 	- the period in months in which the news are going to affect the chart
 *		impact			- the maximum impact value of the news (1.1 - max impact 10%)
 */

var NEWS = [
	{
		text: "The market is going up",
		impactPeriod: 60,
		periods: 0,
		impact: 2.1,
	},
	{
		text: "The market is going up",
		impactPeriod: 72,
		periods: 0,
		impact: 1.7,
	},
	{
		text: "The market is going down",
		impactPeriod: 48,
		periods: 0,
		impact: 0.3,
	},
	{
		text: "The market is going down",
		impactPeriod: 48,
		periods: 0,
		impact: 0.5,
	},
];

function createNews(obj){
	return {
		text: obj.text,
		impactPeriod: obj.impactPeriod,
		periods: 0,
		impact: obj.impact,
		deltaUp: (obj.impact-1)/(0.7*obj.impactPeriod),
		deltaDown: 0.6*(1-obj.impact)/(0.3*obj.impactPeriod),
		delta: (obj.impact-1)/(obj.impactPeriod),
	};
}

var Model = function(){
	this.initialIndex = 1000;
	this.priceIndex = this.initialIndex;
	
	this.baseRate = 5;
	this.baseRateImpact = 0;
	
	this.volatility = 0.02;
	this.news = [];
}

Model.prototype.nextPriceIndex = function(){
	var rnd = Math.random();
	var changePercent = 2*this.volatility*rnd;
	var changeAmount, newsEffect = 0;
	
	var tmpIndex = this.priceIndex/this.initialIndex;
	
	if( (tmpIndex > 1.8 || tmpIndex < 0.5) && !this.news.length){
		this.volatility = 0.08;
	}
	
	if( (tmpIndex < 1.8 && tmpIndex > 0.5) && !this.news.length){
		this.volatility = 0.02;
		this.addNews();
	}
	
	if(changePercent > this.volatility){
		changePercent -= (2*this.volatility);
	}
	
	changeAmount = this.initialIndex*changePercent;
	
	//console.log("NEWS "+this.news.length);
	for(var i=0; i<this.news.length; i++){
		this.news[i].periods++;
		/*
		if(this.news[i].periods<=0.7*this.news[i].impactPeriod){
			newsEffect += this.news[i].deltaUp*this.priceIndex;
			//this.priceIndex += this.news[i].deltaUp*this.priceIndex;
			//console.log(this.news[i].deltaUp);
		}
		
		if(this.news[i].periods>0.7*this.news[i].impactPeriod && this.news[i].periods<=this.news[i].impactPeriod){
			newsEffect += this.news[i].deltaDown*this.priceIndex;
			//this.priceIndex += this.news[i].deltaDown*this.priceIndex;
			//console.log(this.news[i].deltaUp);
		}
		*/
		
		if(this.news[i].periods <= this.news[i].impactPeriod){
			newsEffect += this.news[i].delta*this.initialIndex;
			//this.priceIndex += this.news[i].deltaUp*this.priceIndex;
			//console.log(this.news[i].delta);
		}
		
		//console.log(this.news[i]);
		
		if(this.news[i].periods>this.news[i].impactPeriod){
			this.news.splice(i, 1);
		}	
		
	}
	
	this.priceIndex += changeAmount + newsEffect;
	
	this.calculateBaseRateAndImpact(this.priceIndex);
	
	this.priceIndex += this.baseRateImpact*this.initialIndex;
	
	return this.priceIndex/this.initialIndex;
}

Model.prototype.getPriceIndex = function(){
	return this.priceIndex/this.initialIndex;
}

Model.prototype.getInitialIndex = function(){
	return this.initialIndex;
}

Model.prototype.getBaseRate = function(){
	return this.baseRate;
}

Model.prototype.addNews = function(){
	var maximum = 3;
	var number = Math.floor(Math.random() * (maximum + 1));
	
	this.news.push( createNews(NEWS[number]) );
}

Model.prototype.calculateBaseRateAndImpact = function(index){
	var deltaIndex = 1-(index/this.initialIndex);
	
	if(deltaIndex > 0.6){
		this.baseRate = 5 - (15*(deltaIndex - 0.6));
		this.baseRateImpact = (deltaIndex-0.6)*deltaIndex/10.0; //((deltaIndex-0.6)*10)*deltaIndex/100.0;
	}
	
	if(deltaIndex > -1 && deltaIndex < 0.6){
		this.baseRate = 5;
		this.baseRateImpact = 0;
	}
	
	if(deltaIndex < -1){
		this.baseRate = 5 + (3.33*(-deltaIndex - 1));
		this.baseRateImpact = deltaIndex/120.0;
	}
	
	console.log(this.baseRateImpact);
}

module.exports = Model;