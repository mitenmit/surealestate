var EventEmitter = require('events').EventEmitter;
var assign   = require('object-assign');

var Dispatcher     = require('../Dispatcher');
var AppConstants   = require('../Constants/AppConstants');

var Game = require('../Models/Game');

var CHANGE_EVENT = 'change';

var _singleton = null;

function initGame(){
	_singleton = new Game();
}

var SingletonStore = assign({}, EventEmitter.prototype, {
  get: function() {
    return _singleton;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
Dispatcher.register(function(action) {
  switch(action.actionType) {
    case AppConstants.APP_LAUNCHED:
		initGame();
		SingletonStore.emitChange();
		break;
    
	case AppConstants.START_GAME:
		_singleton.startGame( SingletonStore );
		SingletonStore.emitChange();
		break;
	
	case AppConstants.PAUSE_GAME:
		SingletonStore.emitChange();
		break;
	
	case AppConstants.STOP_GAME:
		_singleton.stopGame();
		SingletonStore.emitChange();
		break;
	
	case AppConstants.APP_ADDNEWS:
		_singleton.addNews();
		//SingletonStore.emitChange();
		break;
	
	case AppConstants.GAME_BUYPROPERTY:
		_singleton.buyProperty(action.propertyIndex, action.priceIndex, action.marketInterestRate, action.creditPeriod);
		SingletonStore.emitChange();
		break;
		
	case AppConstants.GAME_SELLPROPERTY:
		_singleton.sellProperty(action.propertyIndex, action.priceIndex);
		SingletonStore.emitChange();
		break;

	case AppConstants.GAME_REPAYLOAN:
		_singleton.repayLoan(action.propertyIndex, action.repayLoan);
		SingletonStore.emitChange();
		break;	
	
    case AppConstants.LOGOUT_REQUESTED:
		//clearData();
		//SingletonStore.emitChange();
		break;
    default:
      // no op
  }
});

module.exports = SingletonStore;