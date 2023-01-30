
// using https://unpkg.com/uuid leads to ambiguity, I assume from the conditional exports in uuid
import { v4 as uuidv4 } from 'https://unpkg.com/uuid@9.0.0/dist/esm-browser/index.js';
import * as IPSME_MsgEnv from 'https://unpkg.com/@ipsme/msgenv-broadcastchannel@0.3.8';

// is the reflector loaded via node_modules also the same version?!
import * as sharedworker_reflector from 'https://unpkg.com/@ipsme/reflector-webbr-ws@0.4.4'; 

//-------------------------------------------------------------------------------------------------

function ipsme_handler_json_(msg, json_msg)
{
	// console.log('ipsme_handler_json_: ', json_msg); 
	
	if (json_msg.id !==undefined) {
		console.log(Number(json_msg.id.charAt(0)) < '8')
		if ( Number(json_msg.id.charAt(0)) < '8' )
			return true;
	}

	return false;
}

function ipsme_handler_string_(msg, str_msg)
{
	// console.log('ipsme_handler_string_: ', str_msg); 

	let json_msg;
	try {
		json_msg= JSON.parse(str_msg);
	}
	catch (err) {
		return false;
	}

	if (ipsme_handler_json_(msg, json_msg))
		return true;

	return false;
}

function ipsme_handler_(msg) 
{
	console.log('ipsme_handler_: msg: ', msg); 

	try {
		if (typeof(msg) === 'string' && ipsme_handler_string_(msg, msg))
			return true;

		// if (typeof(msg) === 'object' && ipsme_handler_object_(msg, msg))
		// 	return true;
	}
	catch(e) {
		console.log(e)
	}
	  
	console.log("ipsme_handler_: DROP! msg: ", msg);
}

IPSME_MsgEnv.subscribe(ipsme_handler_);

//-------------------------------------------------------------------------------------------------

const button= document.getElementById('btn_Button');

button.onclick= function btn_Button() 
{
	const json_msg= {
		"id" : uuidv4()
	}

	IPSME_MsgEnv.publish( JSON.stringify(json_msg) );
}

//-------------------------------------------------------------------------------------------------

sharedworker_reflector.load(window, "./reflector/reflector-bc-ws-client.js", function () {
	const json_Announcement= {
		announcement : "Hello world"
	};

	console.log('reflector_INITd: publish: Announcement: ', JSON.stringify(json_Announcement) );
	IPSME_MsgEnv.publish( JSON.stringify(json_Announcement) );	
});

//-------------------------------------------------------------------------------------------------
