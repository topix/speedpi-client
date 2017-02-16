/* 
 * Service template for node.js
 * 
 * To use this template, simply add your code in Start and Stop method

*/
var ping;
var session;
var options;
var me;

var target;
var interval;
var executeImmediately;
var timerEvent; // In case you use a timer for fetching data
var payload


var exports = module.exports = {
    
    // The Start method is called from the Host. This is where you 
    // implement your code to fetch the data and submit the message
    // back to the host.
    Start : function () {
        me = this;
        interval = this.GetPropertyValue('static', 'interval');
		target = this.GetPropertyValue('static', 'target');
        executeImmediately = this.GetPropertyValue('static', 'executeImmediately');
        
        this.AddNpmPackage('net-ping', true, function (err) {
            if (!err) {
                ping = require ("net-ping");
				// Default options
				options = {
					networkProtocol: ping.NetworkProtocol.IPv4,
					packetSize: 16,
					retries: 4,
					sessionId: (process.pid % 65535),
					timeout: 2000,
					ttl: 128
				};
				session = ping.createSession ([options]);
                
                timerEvent = setInterval(function () {
                    me.Run();
                }, interval * 1000);
/*				
				if(executeImmediately) {
					me.Run();
				}
*/
            }
            else {
                me.ThrowError(null, '00001', 'Unable to Ping.');
                me.ThrowError(null, '00001', err);
                return;
            }
        });
        
    },
    
    // The Stop method is called from the Host when the Host is 
    // either stopped or has updated integrations. 
    Stop : function () { 
        clearInterval(timerEvent);
    },    
    
    // The Process method is called from the host as it receives 
    // messages from the hub. The [messasge] parameter is a JSON 
    // object (the payload) and the [context] parameter is a 
    // value/pair object with parameters provided by the hub.
    Process : function (message, context) {}, 
    
    Run : function (){
		session.pingHost (target, function (error, target, sent, rcvd) {
			var ms = rcvd - sent;
			if (error){
				this.Error(this.Name, '00001', 'Error when trying to connect to ' + target);
				this.Error(this.Name, '00001', err);
				return;
			}
			else {
				me.SubmitMessage(ms.toString(), 'application/json', []);
//				console.log (ms);
			}
		});
/*
        try{
        }
        catch(err){
            me.ThrowError(null, '00001', JSON.stringify(err));
        }
*/
    },
};