var Dispatcher   = require('../Dispatcher');
var AppConstants = require('../Constants/AppConstants');
var assign       = require('object-assign');

var AppActions = {
	
  appLaunched: function() {
    Dispatcher.dispatch({
      actionType: AppConstants.APP_LAUNCHED
    });
  },
  
  startGame: function() {
    Dispatcher.dispatch({
      actionType: AppConstants.START_GAME
    });
  },
  
  pauseGame: function() {
    Dispatcher.dispatch({
      actionType: AppConstants.PAUSE_GAME
    });
  },
  
  stopGame: function() {
    Dispatcher.dispatch({
      actionType: AppConstants.STOP_GAME
    });
  },
  
  addNews: function() {
    Dispatcher.dispatch({
      actionType: AppConstants.APP_ADDNEWS
    });
  },
  
  buyProperty: function(propertyIndex, priceIndex, marketInterestRate, creditPeriod) {
    Dispatcher.dispatch({
      actionType: AppConstants.GAME_BUYPROPERTY,
	  propertyIndex: propertyIndex,
	  priceIndex: priceIndex,
	  marketInterestRate: marketInterestRate,
	  creditPeriod: creditPeriod,
    });
  },
  
  sellProperty: function(propertyIndex, priceIndex) {
    Dispatcher.dispatch({
      actionType: AppConstants.GAME_SELLPROPERTY,
	  propertyIndex: propertyIndex,
	  priceIndex: priceIndex,
    });
  },
  
  repayLoan: function(propertyIndex, repayLoan){
	Dispatcher.dispatch({
      actionType: AppConstants.GAME_REPAYLOAN,
	  propertyIndex: propertyIndex,
	  repayLoan: repayLoan,
    });  
  }
};

module.exports = AppActions; 