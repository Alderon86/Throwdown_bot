/**
* Load user settings to google Properties for reference later.
* return true
*/
function loadUserSettings() { //Read settings
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    var myRange = mySheet.getRange( "C1:D97" ).getValues();
    var myProperties = PropertiesService.getScriptProperties();
    var myXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    var mySearch = getCharacterTokens(myRange);
    createOnEditTrigger()
	//	load and bulk save user settings to google.
    if(getSetting( myRange, 'Password' ) != '******'){
        myProperties.setProperties( { 
        'User_ID': getSetting( myRange, 'Username/Email' ),
        'User_Token': getSetting( myRange, 'Password' )
        })
        var myPos = getSettingPOS( myRange, 'Password' )
        mySheet.getRange( "D"+myPos ).setValue("******");
    }  
  
    myProperties.setProperties( { 
        //Options
        'Energy Check': getSetting( myRange, 'Energy Check' ),
        'Ad Crate': getSetting( myRange, 'Ad Crate' ),
        'Ad Boost': getSetting( myRange, 'Ad Boost' ),
        //Cards
        'Auto buy and recycle': getSetting( myRange, 'Auto buy and recycle' ),
        'Cards rarities to recycle': getSetting( myRange, 'Cards rarities to recycle' ),
        'Auto buy limit': getSetting( myRange, 'Auto buy limit' ),
        'Auto Buy/Upgrade Mission': getSetting( myRange, 'Auto Buy/Upgrade Mission' ),
        //Refill Challenge
        'Auto Refill Challenge': getSetting( myRange, 'Auto Refill Challenge' ),
        'Refill Challenge Energy check': getSetting( myRange, 'Refill Challenge Energy check' ),
        'Refill Challenge Delay': getSetting( myRange, 'Refill Challenge Delay' ),
        'Refill Challenge Deck': getSetting( myRange, 'Refill Challenge Deck' ),
        //Non-Refill Challenge
        'Auto Non-Refill Challenge': getSetting( myRange, 'Auto Non-Refill Challenge' ),
        'Non-Refill Challenge Energy Check': getSetting( myRange, 'Non-Refill Challenge Energy Check' ),
        'Non-Refill Challenge Delay': getSetting( myRange, 'Non-Refill Challenge Delay' ),
        'Non-Refill Challenge Deck': getSetting( myRange, 'Non-Refill Challenge Deck' ),
        //Rumble
        'Rumble Deck': getSetting( myRange, 'Rumble Deck' ),
        'Rumble Energy Check': getSetting( myRange, 'Rumble Energy Check' ),
        'Panic time': getSetting( myRange, 'Panic time' ),
        //Adventure
        'Auto Adventure': getSetting( myRange, 'Auto Adventure' ),
        'Adventure Energy Check': getSetting( myRange, 'Adventure Energy Check' ),
        'Adventure Deck': getSetting( myRange, 'Adventure Deck' ),
        'Island to farm': convertIsland( getSetting( myRange, 'Island to farm' ) ) + '',
        //Arena
        'Auto Arena': getSetting( myRange, 'Auto Arena' ),
        'Arena Energy Check': getSetting( myRange, 'Arena Energy Check' ),
        'Arena Deck': getSetting( myRange, 'Arena Deck' ),
        //Token Search
        'Token Search': getSetting( myRange, 'Token Search' ),
        'Search Timeout': getSetting( myRange, 'Search Timeout' ),
        'Arena_Target': mySearch,
        'Consuela': getSetting( myRange, 'Consuela' ),
        'Ricky Spanish': getSetting( myRange, 'Ricky Spanish' ),
        'Gene': getSetting( myRange, 'Gene' ),
        'Zapp Brannigan': getSetting( myRange, 'Zapp Brannigan' ),
        //Other
        '_currenttime': formattedTime(),
        '_time_count': formattedTime(),
        //Logging
        '_logs_RefillChallenge': '',
        '_logs_RefillChallenge_count': 0,
        '_logs_NoneRefillChallenge': '',
        '_logs_NoneRefillChallenge_count': 0,
        '_logs_Adventure': '',
        '_logs_Adventure_count': 0,
        '_logs_Arena': '',
        '_logs_Arena_count': 0,
        '_logs_Rumble' : '',
        '_logs_Rumble_count' : 0,
        'BuyCardAndRecycle': '',
        'BuyCardAndRecycle_count': 0,
        'BuyCardAndUpgrade': '',
        'BuyCardAndUpgrade_count': 0,
         //Siege
        'Auto Siege': getSetting( myRange, 'Auto Siege' ),
        'Siege Energy Check': getSetting( myRange, 'Siege Energy Check' ),
        'Siege Deck': getSetting( myRange, 'Siege Deck' ),
        'Siege Delay': getSetting( myRange, 'Siege Delay' ),
        'Island to Attack': getSetting( myRange, 'Island to Attack' )
    } )
    return true
}
/**
* Searches the sheet for the settings location and sets the setting.
* Return settings Location
*/
function getSettingPOS( aArray, aSetting ) {
  for ( var i = 0; i < aArray.length; i++ ) {
    if ( aArray[ i ][ 0 ] == aSetting ) {
      return i+1
    }
  }
}

/**
* Searches the sheet for the settings location and returns the setting option.
* return location
*/
function getSetting( aArray, aSetting ) {
  for ( var i = 0; i < aArray.length; i++ ) {
    if ( aArray[ i ][ 0 ] == aSetting ) {
      return aArray[ i ][ 1 ]
    }
  }
}

/**
* Converts island numbers to island ID
* return island ID
*/
function convertIsland( aInfo ) {
    if ( aInfo.length < 4 ) {
        aInfo = "0" + aInfo
    }
    var myIsland = parseInt( aInfo.substring( 0, 2 ) );
    var myPos = parseInt( aInfo.substring( 3, 4 ) );
    var myMath = ( myIsland * 3 ) - ( 3 - myPos ) + ( 100 ) + '';
    return myMath;
}

/**
* Converts Kong login to Kong token
* return KongID,KongToken
*/
function convertKongLogin(aUserName,aPassword){
  
   var mypayload = {
        "username" : aUserName,
        "password" : aPassword,
        "game_id" : "271381"
  }; 
  
    var myoptions = {
        "payload" : mypayload,
        "method" : "POST",
        "followRedirects" : false
      };
 
  var myUrl = 'https://www.kongregate.com/session';
var myResult = UrlFetchApp.fetch(myUrl, myoptions); 
var cookie = myResult.getAllHeaders()['Set-Cookie'];     
var myUrl = myResult.getHeaders()['Location']
 for (var i = 0; i < cookie.length; i++) {
    cookie[i] = cookie[i].split( ';' )[0];
  };
   var myoptions = {
    "method" : "get", 
    "headers": {
      "Cookie": cookie.join(';')
    },
    "followRedirects" : false    
  };
  
var myResult = UrlFetchApp.fetch(myUrl, myoptions);
   var myCookieJson = JSON.parse( myResult );
  var myID = myCookieJson.user_id
  var myPASS = myCookieJson.game_auth_token
  if(myID != null){
  return [myID ,myPASS]
  }else{
    return [false ,false]
  }
}

/**
* Converts Kong Token to Synapse Hash
* return SynapseID,SynapseHash
*/
function convertKongToken(aID,aToken){
   var KONGURL = 'https://cb-live.synapse-games.com/api.php?';
    var myUserAuth = UrlFetchApp.fetch( KONGURL + 'message=getUserAccount&kong_id=' + aID + '&kong_token=' + aToken );
    var myUserAuthJson = JSON.parse( myUserAuth );
    var myUserId = myUserAuthJson.new_user;
    var myUserPass = myUserAuthJson.new_password;
    var myResult = myUserAuthJson.result;
  if ( myResult == true ) {
    return [false,false]
  }
  return [myUserId,myUserPass]
}

/**
* Check if user login is valid and generate user URL.
* return true/false
*/
function authenticateUser( aId, aToken ) { //Check if use is valid & create user myUrl
 var myConvertKong = convertKongLogin(aId,aToken)
 if(myConvertKong[0] != false){
   aId = myConvertKong[0]+''
   aToken = myConvertKong[1]+''
 }
  
 var myConvert = convertKongToken(aId,aToken)
 if(myConvert[0] != false){
   aId = myConvert[0]+''
   aToken = myConvert[1]+''
 }
  
 var myURLtmp = 'https://cb-live.synapse-games.com/api.php?';
 var myUserAuth = UrlFetchApp.fetch( myURLtmp + 'message=getUserAccount&user_id=' + aId + '&password=' + aToken );
 var myUserAuthJson = JSON.parse( myUserAuth );
 var myCheck = myUserAuthJson.result;
 var myUserName = myUserAuthJson.user_data.name;
  if(myCheck == true){
    Logger.log('Login Failed')
        updateStatus( 'Login failed.. Check Login info ' + formattedTime() );
        Logger.log( 'User Auth fail' );
        return false
  }
    
    var myUrl = myURLtmp + 'user_id=' + aId + '&password=' + aToken;
    setProperty( '_url', myUrl );
    setProperty( '_name', myUserName );
  
  if ( getProperty( 'Auto Adventure' ) == "Enabled"||"Energy overflow control"){
    var myCheck = checkIsland(myUrl, getProperty('Island to farm'));
    if(myCheck != false){
      setProperty( '_IslandCost', myCheck+'');
    }else{
      updateStatus( 'Account ' + getProperty( '_name' ) + ' Island unavailable to farm ' + formattedTime() );
      return false
    }
  }
  return true
}

/**
* Update status section on the Gui with string.
*/
function updateStatus( aStatus ) { //Update status section on the menu
    theSheet.getRange( "C4" ).setValue( aStatus );
}

/**
* Load Character token search settings from settings.
* return search string.
*/
function getCharacterTokens(aRange) {
		// load empty string for adding to.
		var mySearch = '';
		if ( getSetting( aRange, 'Brian' ) == 'Enabled' ) {
			mySearch = mySearch + ',1003'
		}
		if ( getSetting( aRange, 'Stewie' ) == 'Enabled' ) {
			mySearch = mySearch + ',1002'
		}
		if ( getSetting( aRange, 'Louise' ) == 'Enabled' ) {
			mySearch = mySearch + ',3002'
		}
		if ( getSetting( aRange, 'Steve' ) == 'Enabled' ) {
			mySearch = mySearch + ',2003'
		}
		if ( getSetting( aRange, 'Bender' ) == 'Enabled' ) {
			mySearch = mySearch + ',5016'
		}
		if ( getSetting( aRange, 'Dale' ) == 'Enabled' ) {
			mySearch = mySearch + ',4003'
		}
		if ( getSetting( aRange, 'Bob' ) == 'Enabled' ) {
			mySearch = mySearch + ',3001'
		}
		if ( getSetting( aRange, 'Roger' ) == 'Enabled' ) {
			mySearch = mySearch + ',2001'
		}
		if ( getSetting( aRange, 'Leela' ) == 'Enabled' ) {
			mySearch = mySearch + ',5018'
		}
		if ( getSetting( aRange, 'Bobby' ) == 'Enabled' ) {
			mySearch = mySearch + ',4002'
		}
		if ( getSetting( aRange, 'Peter' ) == 'Enabled' ) {
			mySearch = mySearch + ',1001'
		}
		if ( getSetting( aRange, 'Tina' ) == 'Enabled' ) {
			mySearch = mySearch + ',3003'
		}
		if ( getSetting( aRange, 'Stan' ) == 'Enabled' ) {
			mySearch = mySearch + ',2002'
		}
		if ( getSetting( aRange, 'Fry' ) == 'Enabled' ) {
			mySearch = mySearch + ',5017'
		}
		if ( getSetting( aRange, 'Hank' ) == 'Enabled' ) {
			mySearch = mySearch + ',4001'
		}
		if ( getSetting( aRange, 'Consuela' ) == 'Enabled' ) {
			mySearch = mySearch + ',1004'
		}
		if ( getSetting( aRange, 'Ricky Spanish' ) == 'Enabled' ) {
			mySearch = mySearch + ',2005'
		}
		if ( getSetting( aRange, 'Gene' ) == 'Enabled' ) {
			mySearch = mySearch + ',3004'
		}
		if ( getSetting( aRange, 'Zapp Brannigan' ) == 'Enabled' ) {
			mySearch = mySearch + ',5019'
		}
		if ( getSetting( aRange, 'The Giant Chicken' ) == 'Enabled' ) {
			mySearch = mySearch + ',1005'
		}
		if ( getSetting( aRange, 'John Redcorn' ) == 'Enabled' ) {
			mySearch = mySearch + ',4004'
		}
	
	return mySearch
	}
