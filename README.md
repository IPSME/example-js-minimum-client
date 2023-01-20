# example-js-minimum-client

This is minimum example of using IPSME in a web project in a browser environment. This example will: 1) load an IPSME reflector in the form of a SharedWorker to reflect messages to a WebSocket; 2) subscribe to IPSME messages with a callback handler `ipsme_handler_`; and, 3) publish a message to the messaging environment (ME) on a button click .

> ### IPSME- Idempotent Publish/Subscribe Messaging Environment
> https://dl.acm.org/doi/abs/10.1145/3458307.3460966

This example makes use of the following repositories:
 - https://github.com/IPSME/npm-msgenv-broadcastchannel.git
 - https://github.com/IPSME/npm-reflector-ws-client.git

## Loading the reflector

Messages are published to the local ME, but for those messages to have more far reaching implications, they must be reflected to other MEs e.g., the one of the OS. 
```
sharedworker_reflector.load(window, "./reflector/reflector-bc-ws-client.js", function () {
	const  json_Announcement= {
		announcement :  "Hello world"
	};
	
	console.log('reflector_INITd: publish: Announcement: ', JSON.stringify(json_Announcement) );
	IPSME_MsgEnv.publish( JSON.stringify(json_Announcement) );
});
```
Above, a SharedWorker is loaded and upon success a callback is executed which in turn publishes an announcement message. More details on loading the reflector can be found here:

https://github.com/IPSME/npm-reflector-ws-client.git

## Subscribing to messages

The following code can be used to receive messages posted to the local ME.
```
function  ipsme_handler_(msg) {
	try {
		// add handlers ...	
	}
	catch(e) {
		// ...
	}
}
IPSME_MsgEnv.subscribe(ipsme_handler_);
```
It is important to catch all exceptions in the handler used to subscribe to IPSME; unhandled exceptions are silently dropped.
If reflectors are used, then we are oblivious to the routing complexities on how the message arrived in the local ME. It is **STRONGLY** recommended to use the strictest validation on messages and drop those that do not comply.

When receiving messages of various types, it can be helpful to cascade handlers.
```
function ipsme_handler_json_(msg, json_msg) {
	if ( ... ) 
		return  true;
	return  false;
}

function ipsme_handler_string_(msg, str_msg) {
	let json_msg= JSON.parse(str_msg);
	// ...
	if (ipsme_handler_json_(msg, json_msg))
		return  true;
	return  false;
}

function ipsme_handler_(msg) {
	try {
		if (typeof(msg) === 'string' && ipsme_handler_string_(msg, msg))
			return  true;
		if (typeof(msg) === 'object' && ipsme_handler_object_(msg, msg))
			return true;
	}
	catch(e) {
		console.log(e)
	}
	console.log("ipsme_handler_: DROP! msg: ", msg);
}

IPSME_MsgEnv.subscribe(ipsme_handler_);
```
The original message (`msg`) is passed along through the cascade, in case it is to be used in a reply.  Each handler returns a boolean allowing for the following return results:
-   return `true`: message was ACCEPTED, processing was a SUCCESS; stop processing the message further
-   `throw` an error: message was ACCEPTED, processing of the message FAILED; stop processing the message further
-   return `false`: message is NOT accepted; continue processing the message in other handlers

## Publishing a message

```
IPSME_MsgEnv.publish( JSON.stringify(json_msg) );
```
It is by design that a participant receives the messages it has published itself. If this is not desirable, each message can contain a "referer" (sic) identifier and a clause added in the `ipsme_handler_` to drop those messages containing the participant's own referer id.
