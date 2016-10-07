(function() {
	/*------------
		DEFINITION
	------------*/
	// JSON enpoint
	var GYG_JSON_URL = "https://www.getyourguide.com/touring.json?key=2Gr0p7z96D";
	// selectors
	var $ = {}
	var ids = ["overlay", "container", "customerFirstName", "activityTitle", "activityPicture", "activityMap", "activityCarousel"];
	// configure DOM selectors
	function configSelectors() {
		var idsLength = ids.length;
		var i = 0;
		var id = null;
		for (i; i < idsLength; i++) {
			id = ids[i];
			$[id] = document.getElementById(id);
		}
	}
	// toggle overlay loading message visibility
	function showLoading(show) { $.overlay.style.opacity = show ? 1 : 0; }
	// toggle carousel state; slide map into view for show = true, else show activity picture
	function showMap (show) { $.activityCarousel.style.right = show ? 0 : '100%'; }
	// toggle user name, activity title and carousel visibility
	function showContent (show) { $.container.style.opacity = show ? 1 : 0; }
	
	// returns build Google Maps static map url, according to coordinates passed
	function getMapURL (coords) {
		return [
			'https://maps.googleapis.com/maps/api/staticmap?center=' + coords,
			'zoom=4',
			'size=600x400',
			'scale=2',
			'format=jpg',
			'maptype=satellite',
			['markers=size:mid','color:red','label:A', coords].join('%7C'),
			'key=AIzaSyCO5ILMljA8FDnUe72qUgGtQwzkjR3HpIQ'
		].join('&');
	}

	// returns a random sentence with the user name inserted
	function getSentence (name) {
		// capitalise first letter of user name
		name = name.charAt(0).toUpperCase() + name.slice(1);
		// list of sentences
		var sentences = [
			name + "'s on an adventure right now...",
			"let's check in with " + name + "...",
			name + " is using Get Your Guide right now..."
		];
		// random index generated
		var index = Math.random();
		// upper value limit
		var max = sentences.length - 1;
		// lower value limit
		var min = 0;
		// return random value between max and min values
		index = Math.floor(index * (max - min + 1)) + min;
		// return randomly selected sentence
		return sentences[index];
	};

	// loads passed image URL and envokes passed callback on load
	function loadImage (url, callback) {
		// create new instance of Image object
		var img = new Image();
		// assign on load callback
		img.onload = callback;
		// assign url source to begin loading
		img.src = url;
	};

	// image on load callbacks
	function onMapLoad (event) {
		// assign src for activity map <img> to loaded map
		$.activityMap.src = this.src;
		// display activity image for additional 5 seconds before show map
		setTimeout( function() {
			showMap(true);
			// begin next ajax request
			setTimeout(ajaxReq, 3000);
		}, 5000);
	}

	function onActivityPictureLoad (data) {
		// hide 'loading' overlay
		showLoading(false);
		// hide content while re-populating
		showContent(false);
		// wait for css transition to complete
		setTimeout( function() {
			// content opactiy transitions at 500ms; content is now fully hidden
			// slides activity image into carousel, map slides out of viewport in 500ms, while hidden
			showMap(false);
			// wait for map to be hidden
			setTimeout( function() {
				// activity picture is now in the viewport
				// populate user name, activity title and activity image, while content still hidden
				$.customerFirstName.innerHTML = getSentence(data.customerFirstName);
				$.activityTitle.innerHTML = data.activityTitle;
				$.activityPicture.src = data.activityPictureUrl;
				// finally, show fully populated content
				showContent(true);
			}, 500);
		}, 500);
		// prepare lat lang values for static map
		var coords = [ data.activityCoordinateLatitude, data.activityCoordinateLongitude ].join(',');
		// asynchronousely load and populate static map
		loadImage( getMapURL(coords), onMapLoad )
	}

	// callback for AJAX request success
	function populateContent (data) {
		// data returned as JSON is parsed to JS object
		data = JSON.parse(data);
		// asynchronously load and populate activity picture
		loadImage( data.activityPictureUrl, function(event) {
			// on activity picture load, pass data to callback
			onActivityPictureLoad(data);
		});
	}

	// AJAX call
	function ajaxReq() {
		var xhr = new XMLHttpRequest();
	  xhr.onreadystatechange = function() {
	  	// only envoke callback when successfully retrieved
	  	if (xhr.readyState === 4 && xhr.status === 200) {
	  		populateContent(xhr.response);
	  	};
	  };
	  xhr.open("GET", GYG_JSON_URL, true);
	  xhr.send();
	}

	// INIT
	window.onload = function() {
		// once DOM content has loaded, configure DOM selectors
		configSelectors();
		// begin first ajax request
		ajaxReq();
	};

})();