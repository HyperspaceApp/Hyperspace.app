# How to write a plugin

Note: the screenshots here were taken from before a skin revamp of the UI, but
the general principles, javascript, and most of the css are still valid and in
use.

## It's a webpage... it's that simple.

Plugins are loaded into Hyperspace.app on run-time through an electron utility called
the [web-view tag](http://electron.atom.io/docs/v0.29.0/api/web-view-tag/).
These tags open up the viewing of guest content by pointing to an HTML file
that displays the rest of the plugin, importing CSS, Javascript as is usually
done in a webpage.

One could make a plugin that views Github.com by making a folder
`plugins/Github/` and placing a one-line index.html file:
`<meta http-equiv="refresh" content="0; url=http://Github.com/" />`
Suddenly, there's a button labeled 'Github' and upon click, shows ![Note:
Though this is currently a bit buggy due to sites using global variables that
conflict with nodeintegration being turned on.](/doc/assets/github-plugin.png)

## Making a Sidebar Button

However, we don't want developers to launch a webpage on a server just to make
a plugin. We're trying to make a basic plugin that serves an actual function.
For this, we'll go through implementing the Overview plugin.

Plugins are loaded dynamically based on the folders in the plugins/ directory.
The sidebar is handled on our part so plugins only need a properly
placed png file and folder name for a button. 

The plugin directory should now be:

```diff
 Hyperspace/plugins/Overview/
 └── assets/
     └── button.png
```

The Overview uses the 'bars' [font awesome icon in png form](http://fa2png.io/).
Loading up Hyperspace again, we'll see: ![Impressive plugin ain't
it?](/doc/assets/sidebar.png)

## Making a Mainbar View

Now to insert some content for our plugin. The overview plugin will be the home
plugin for most everyone, so we'll add a nice little greeting and title to it:

```html
<!DOCTYPE html>
<html>
	<head>
	</head>
	<body>
		<!-- Header -->
		<div class='header'>
			<div class='title' id='title'>Overview</div>
		</div>

		<!-- Frame -->
		<div class='frame'>
			<div class='welcome'>
				<div class='large'>Welcome to Hyperspace</div>
				<div class='small'>A highly efficient decentralized storage network.</div>
			</div>
		</div>
	</body>
</html>
```

We've got how our users will be greeted upon entering the UI, now we should
determine what information should be regularly viewed upon entry by most every
user. Inspired by the previous UI, we pick the block height, peer count, and
wallet balance. The first lets the user know they're up to date with the
blockchain. The second lets the user further know that they're connected with
other people on the network. Lastly each and every user, whether they host,
rent, or mine, will probably have some balance of Space Cash.

We'll add a containing div, let's call it 'capsule' for our header section and
div fields for each of these to our index.html, keeping them all the same class
name, say 'pod' so that we can later style them alike CSS while giving them
unique id's to update each of them separately later in JS.

```html
		<!-- Header -->
		<div class='header'>
			<div class='title' id='title'>Overview</div>
			<div class='capsule'>
				<div class='pod' id='balance'>Balance: 0</div>
				<div class='pod' id='peers'>Peers: 0</div>
				<div class='pod' id='height'>Block Height: 0</div>
			</div>
		</div>
```

The plugin directory should now be:

```diff
 Hyperspace/plugins/Overview/
+├── index.html
 └── assets/
     └── button.png
```
Loading up Hyperspace again, we'll see: ![Impressive plugin ain't it?](/doc/assets/basic-overview.png)

## Styling the View

Now that we have mock data to display to our user, we want this view to start
taking shape, form, and last-but-not-least, style!

The UI has a font that we use for the text called roboto condensed, so let's
include that for consistency's sake.  With a cool font, we need a cool layout.
We use a general css file among plugins we're making:
css/plugin-standard.css. It was adapted from the old Hyperspace and applies to
general header and frame styling.  We're skimming over this because it's not
too important to review in this particular guide, though any css besides the
standard can be used.

We're going to need the plugin's index.html to know about this font, the
general css, and our custom plugin CSS through adding two lines in the head
section:

```html
	<head>
		<!-- CSS -->
		<link rel="stylesheet" href="../../css/roboto-condensed-min.css">
		<link rel="stylesheet" href="../../css/plugin-standard.css">
		<link rel='stylesheet' href='css/overview.css'>
	</head>
```

The plugin-standard.css:

```css
/*	Style Guide: 
 *		Transparent: 70% Opacity
 *
 * 		White:      #FFFFFF
 * 		Grey-White: #F5F5F5
 *		Faint-Grey: #ECECEC
 *		Light-Grey: #DDDDDD
 *		Grey:       #C5C5C5
 * 		Grey-Black: #4A4A4A
 * 		Black:      #000000
 */
/* Overall Effects */
@keyframes fadeout {
	from { opacity: 1; }
	to   { opacity: 0; }
}
@keyframes fadein {
	from { opacity: 0; }
	to   { opacity: 1; }
}
html, body {
	height: 100%;
	min-width: 100%;
	margin: 0px;
	padding: 0px;
	border-spacing: 0px;
	font-family: 'Roboto Condensed', sans-serif;
	font-weight: 300;
	font-size: 18px;
}
.hidden {
	display: none;
}

/* Plugin header */
.header {
	padding-top: 10px;
	padding-left: 20px;
	background-color: #4a4a4a;
	color: #fff;
	height: 50px;
	vertical-align: top;
}
.header .title {
	display: inline-block;
	font-size: 30px;
	color: #fff;
}
.header .capsule {
	float: right;
	font-size: 16px;
}
.capsule {
	position: absolute;
	right: 20px;
	max-height: 50px;
	max-width: calc(100% - 200px);
	display: inline-block;
	border: 1px solid #00CBA0;

	border-radius: 0px;
	overflow: hidden;
}
.capsule .pod {
	display: inline-block;
	padding: 8px;
	padding-left: 16px;
	padding-right: 16px;
	border-right: 1px solid #00CBA0;
	color: #f5f5f5;
}
.capsule .pod.button:hover {
	color: #00CBA0;
}
.capsule .pod * {
	display: inline-block;
}
.capsule .pod:last-child {
	border: none;
}

/** Form elements */
select, input {
	position: relative;
	top: 10%;
	transform: translateY(-10%);

	margin: 0;
	font-family: sans-serif;
	font-size: 16px;
	height: 30px;
	padding-right: 4px;
	padding-left: 6px;
	box-shadow: none;
	color:#4a4a4a;

	border: solid 1px #dddddd;
	transition: box-shadow 0.3s, border 0.3s;
}
select {
	height: 34px;
	font-size: 16px;
	background:#ffffff;
}
select:focus, input:focus {
	outline: none;
	border: solid 1px #4a4a4a;
	box-shadow: 0 0 5px 1px #c5c5c5;
}
select:hover {
	cursor: pointer;
}

/* Main Display */
.frame {
	height: 100%;
	overflow: hidden;
	color: #999999;
	font-size: 26px;
	position: relative;
	width: 100%;
}
```
The Overview-specific css:

```css
/*	Style Guide:
 *		Transparent: 70% Opacity
 *
 * 		White:      #FFFFFF
 * 		Grey-White: #F5F5F5
 *		Faint-Grey: #ECECEC
 *		Light-Grey: #DDDDDD
 *		Grey:       #C5C5C5
 * 		Grey-Black: #4A4A4A
 * 		Black:      #000000
 */
.frame {
	color: #f5f5f5;
}
.welcome {
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	text-align: center;
	color: #c5c5c5;
}
.welcome .large {
	font-size: 72px;
}
.welcome .small {
	margin-top: 20px;
	font-size: 32px;
}
```

Quite a lot to take in without review, but that's how styling webpages goes. 

The plugin directory should reflect our css files:

```diff
 Hyperspace/plugins/Overview/
 ├── index.html
 ├── assets/
 │   └── button.png
+└── css/
+    └── overview.css
```

Loading up Hyperspace again, we'll see: ![Impressive plugin ain't it?](/doc/assets/styled-overview.png)

## Updating our View

Now we need to make a JS file to contain logic to fill these data fields. First
let's include the JS file-to-be-made in our index.html at the bottom to load
and fill our fields after the general skeleton has been parsed.

```html
		<!-- JS -->
		<script type='text/javascript' src='js/overview.js'></script>
	</body>
</html>
```

After we make such a javascript file, we should cover the additional tools
Hyperspace gives to its plugins beyond just a sidebar-button.

### IPC

We must first understand that plugins, due to their webview nature, run in a
separate process with different permissions than the general UI. This is so
plugin behavior is very controlled and encapsulated. Commmunication between it
and the UI will be through an asynchronous electron library tool called 'ipc' or
'inter-process-communication'. Thus, the top of our file should contain:

```js
'use strict';
// Library for communicating with Hyperspace
const IPCRenderer = require('ipc');
```

Asynchronous messages sent through ipc are picked up based on their channels.
On can send primitives, objects, or nothing at all through these channels and
the UI reacts accordingly. For example, turn chromium devtools on using:

```js
IPCRenderer.sendToHost('devtools');
```

It's like a mini API. For now, the IPC channels are:

* api-call - Send a call string or object through this channel, with the second
argument being the channel to receive the result over. See the next section
* notify - Send a message to the user with the notification system of the UI.
See uiManager.notify()
* tooltip - Send a message to the user with the tooltip system of the
uiManager.tooltip()
* devtools - toggle devtools on and off for the plugin (one can also go to
localhost:9222 when running the UI to view all chromium devtools)

For more detail, see js/pluginManager.js's function addListeners()

For example usage, view the js files of any currently implemented plugins.

### Making API calls

To send api calls through the UI to a hosted hsd, call ipc's sendToHost()
function along the message channel 'api-call' and pass in the string of the
call address.

```js
// Make API calls, sending a channel name to listen for responses
function update() {
	IPCRenderer.sendToHost('api-call', '/wallet/status', 'balance-update');
	IPCRenderer.sendToHost('api-call', '/gateway/status', 'peers-update');
	IPCRenderer.sendToHost('api-call', '/consensus/status', 'height-update');
}
```

* Note, a call object is required instead of a string url for any calls other
than 'GET'. They are formatted like the following:

```js
{ // A call object
	url: '/consensus/status',  // String
	type: 'GET',               // String
	args: null,                // null or an object containing arguments to send
}
```

To do something with the result of said calls, one has to listen on the IPC
channel they specified in the third argument of sendToHost().

```js
// Define IPC listeners and update DOM per call
IPCRenderer.on('balance-update', function(event, err, result) {
	document.getElementById('balance').innerHTML = 'Balance: ' + result.Balance;
});
IPCRenderer.on('peers-update', function(event, err, result) {
	document.getElementById('peers').innerHTML = 'Peers: ' + result.Peers.length;
});
IPCRenderer.on('height-update', function(event, err, result) {
	document.getElementById('height').innerHTML = 'Block Height: ' + result.Height;
});
```

### Plugin Lifecycle

Currently, the UI checks for and executes a function called start() upon loading
and stop() upon transitioning away from the plugin. Thus a plugin needs to
initialize and update its fields based on these two functions, even though it
continues to exist in the background when another view is shown.

A good way to do this is to have a global variable that points to a function
being executed periodically using native Javascript's setTimeout().

```js
// Keeps track of if the view is shown
var updating;

// Make API calls regularly, sending a channel name to listen for responses
function update() {
	IPCRenderer.sendToHost('api-call', '/wallet/status', 'balance-update');
	IPCRenderer.sendToHost('api-call', '/gateway/status', 'peers-update');
	IPCRenderer.sendToHost('api-call', '/consensus/status', 'height-update');
	updating = setTimeout(update, 1000);
}

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPCRenderer.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called upon transitioning away from this view
function stop() {
	clearInterval(updating);
}
```

## Usability

This all functions well enough, but it's a bit of an amateur design when one
actually uses the plugin. Numbers are jerky and we see a large amount of
numbers for our balance since it's in 10^-24 Space Cash, or what we call
Hastings, similar to Bitcoin and satoshis.

```js
// Convert to Space Cash
function formatSpaceCash(hastings) {
	var ConversionFactor = Math.pow(10, 24);
	var display = hastings / ConversionFactor);
	return display + ' SPACE';
}
```

There's an issue with Javascript that we must circumvent, and that is that all
numbers are stored as 64 bit floating point values. Thus rounding occurs when
one, say, subtracts 1 from 3. When displayed to enough precision, we'll find
that the value is actually something like 1.9999999 instead of 2. We'll
incorporate the [bignumber.js library](https://github.com/MikeMcl/bignumber.js/) to solve our problems.

```js
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 })
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

// Convert to Space Cash
function formatSpaceCash(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' SPACE';
}
```

We should log errors and ensure that we have a result to show before we update
the markup so as to maintain values and avoid displaying glitchy values like
null or NaN.

```js
// Define IPC listeners and update DOM per call
IPCRenderer.on('/wallet/status', function(event, err, result) {
	if (err) {
		console.error(err);
	} else if (result) {
		document.getElementById('balance').innerHTML = 'Balance: ' + balance;
	}
});
IPCRenderer.on('/gateway/status', function(event, err, result) {
	if (err) {
		console.error(err);
	} else if (result) {
		document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
	}
});
IPCRenderer.on('/consensus/status', function(event, err, result) {
	if (err) {
		console.error(err);
	} else if (result) {
		document.getElementById('height').innerHTML = 'Block Height: ' + blockHeight;
	}
});
```

Finally, the aggregated Javascript code should look like this:

```js
'use strict';
// Library for communicating with Hyprespace
const IPCRenderer = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 })
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
// Keeps track of if the view is shown
var updating;

// Send API calls to the UI
function update() {
	IPCRenderer.sendToHost('api-call', '/wallet/status');
	IPCRenderer.sendToHost('api-call', '/gateway/status');
	IPCRenderer.sendToHost('api-call', '/consensus');
	updating = setTimeout(update, 1000);
}

// Convert to Space Cash
function formatSpaceCash(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' SPACE';
}

// Define IPC listeners and update DOM per call
IPCRenderer.on('/wallet/status', function(event, err, result) {
	if (err) {
		console.error(err);
	} else if (result) {
		document.getElementById('balance').innerHTML = 'Balance: ' + balance;
	}
});
IPCRenderer.on('/gateway/status', function(event, err, result) {
	if (err) {
		console.error(err);
	} else if (result) {
		document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
	}
});
IPCRenderer.on('/consensus/status', function(event, err, result) {
	if (err) {
		console.error(err);
	} else if (result) {
		document.getElementById('height').innerHTML = 'Block Height: ' + blockHeight;
	}
});

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPCRenderer.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called upon transitioning away from this view
function stop() {
	clearInterval(updating);
}
```

```diff
 Hyperspace/plugins/Overview/
 ├── index.html
 ├── assets/
 │   └── button.png
 ├── css/
 │   └── overview.css
+└── js/
+    └── overview.js
```

Loading up Hyperspace again, we'll all see something different because the numbers
should be pulled from the API and one's hsd-state. In our case, the view shows
the yet-encrypted release network:
![Impressive plugin ain't it?](/doc/assets/working-overview.png)

### Abstracting the Extra Mile

If you notice, the error-checking seems to be a bit repetitive, let's define a
function to call from IPCRenderer.on() that handles that for us and updates the DOM so
as to reduce that repetition:

```js
// Updates element text
function updateField(err, caption, newValue, elementID) {
	if (err) {
		console.error(err);
	} else if (newValue === null) {
		console.error('Unknown occurence: no error and no result from API call!');
	} else {
		document.getElementById(elementID).innerHTML = caption + newValue;
	}
}

// Define IPC listeners and update DOM per call
IPCRenderer.on('balance-update', function(event, err, result) {
	var value = result !== null ? formatSpaceCash(result.ConfirmedSpaceCashBalance) : null;
	updateField(err, 'Balance: ', value, 'balance');
});
IPCRenderer.on('peers-update', function(event, err, result) {
	var value = result !== null ? result.Peers.length : null;
	updateField(err, 'Peers: ', value, 'peers');
});
IPCRenderer.on('height-update', function(event, err, result) {
	var value = result !== null ? result.Height : null;
	updateField(err, 'Block Height: ', value, 'height');
});
```

Now the aggregate javascript should be:

```js
'use strict';
// Library for communicating with Hyperspace
const IPCRenderer = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Keeps track of if the view is shown
var updating;

// Make API calls, sending a channel name to listen for responses
function update() {
	IPCRenderer.sendToHost('api-call', '/wallet/status', 'balance-update');
	IPCRenderer.sendToHost('api-call', '/gateway/status', 'peers-update');
	IPCRenderer.sendToHost('api-call', '/consensus/status', 'height-update');
	updating = setTimeout(update, 1000);
}

// Updates element text
function updateField(err, caption, newValue, elementID) {
	if (err) {
		console.error(err);
	} else if (newValue === null) {
		console.error('Unknown occurence: no error and no result from API call!');
	} else {
		document.getElementById(elementID).innerHTML = caption + newValue;
	}
}

// Convert to Space Cash
function formatSpaceCash(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' SPACE';
}

// Called by the UI upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPCRenderer.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called by the UI upon transitioning away from this view
function stop() {
	clearTimeout(updating);
}

// Define IPC listeners and update DOM per call
IPCRenderer.on('balance-update', function(event, err, result) {
	var value = result !== null ? formatSpaceCash(result.ConfirmedSpaceCashBalance) : null;
	updateField(err, 'Balance: ', value, 'balance');
});
IPCRenderer.on('peers-update', function(event, err, result) {
	var value = result !== null ? result.Peers.length : null;
	updateField(err, 'Peers: ', value, 'peers');
});
IPCRenderer.on('height-update', function(event, err, result) {
	var value = result !== null ? result.Height : null;
	updateField(err, 'Block Height: ', value, 'height');
});
```

### Bonus: Tooltips and Notifications

The UI has a notification and tooltip system that can also be utilized through
IPC. Notifications are easy enough as demonstrated through this code snippet
taken from Wallet's js file:

```js
IPCRenderer.on('coin-sent', function(event, err, result) {
	if (err) {
		console.error(err);
		IPCRenderer.sendToHost('notify', 'Transaction errored!', 'error');
		return;
	}
	IPCRenderer.sendToHost('notify',  'Transaction sent!', 'sent');
	document.getElementById('transaction-amount').value = '';
	document.getElementById('confirm').classList.add('hidden');
});
```

In the wallet view, we can trigger this notification and another, making them
appear as such: ![If only we sent to an actual addresses](/doc/assets/wallet-notifications.png)

In a similar, but more unwieldy manner, one can send a tooltip IPC message to
show atop an element as demonstrated again by wallet:

```js
// Ask UI to show tooltip bubble
function tooltip(message, element) {
	var rect = element.getBoundingClientRect();
	IPCRenderer.sendToHost('tooltip', message, {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
		length: rect.length,
	});
}

// Give the buttons interactivity
document.getElementById('create-address').onclick = function() {
	tooltip('Creating...', this);
	IPCRenderer.sendToHost('api-call', '/wallet/address', 'new-address');
};
```

Which will make this tooltip appear on click as such:

![It's the details that make the best UI](/doc/assets/wallet-tooltip.png)
