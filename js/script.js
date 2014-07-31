var base = 'https://api.github.com/users/';
var rData = {},
	uData = {};

// Run on load
$(document).ready(function() {
	$('#username').focus();
	$('#data').hide();
	$('.spinner').hide();
});

//Detect 'Enter' key being pressed
$('#username').keyup(function (e) {
	if (e.keyCode === 13) {
		$('#content').empty(); 
		$('#top-bar').empty();
		$('#data').hide();
		$('#messages').empty();
        $('#repos').empty();
		var enteredText = $('#username').val();
		if (enteredText.length === 0) unrecognized(enteredText);
		else {
			if (enteredText == 'git help') showHelp();
			else if (enteredText == 'git info') showInfo();
			else if (enteredText == 'username') showOops();
			else { 
				$('.spinner').show();
				getUser(enteredText);
			}
			$('#username').val('');
		}
	}
});

//Get user data using GitHub API
function getUser(userName) {
	$.get(base + userName, function (userData) {
		uData = userData;
		$('#search').fadeOut(750, function () {
			$('#data').fadeIn(500);
			$('#footer').fadeOut();
		});
		//Check that the user has a defined full name or use their username if they don't
		var uName = userName;
		if (uData.name !== null && uData.name !== undefined && uData.name.length) { 
            uName = uData.name;
        }
		$('#top-bar').append('<span id = "uname" style = "margin-left: 0.3em;">'+uName+'</span>');
		$('#top-bar').append('<span id = "membersince" style = "margin-left: 1em;"> has been committing since '+(uData.created_at).substring(0,10)+'</span>');
		$("#home").wrap('<a href="'+uData.blog+'" target="_blank"></a>');
		$("#code").wrap('<a href="'+uData.html_url+'" target="_blank"></a>');
		$('#content').append('<span class = "desc">Since then, they have amassed </span>');
		$('#content').append('<span class = "stat">'+uData.public_repos+'</span><span class = "desc"> public repositories,</span>');
		$('#content').append('<span class = "stat" style = "padding-left: 0.3em;">'+uData.followers+'</span><span class = "desc"> followers and</span>');
		$('#content').append('<span class = "stat" style = "padding-left: 0.3em;">'+uData.public_gists+'</span><span class = "desc"> gists.</span></br>');
		$('#content').append('<span class = "desc">'+((uData.name).split(" "))[0]+' currently works at </span><span class = "stat">'+uData.company+'</span>');
        $('#content').append('<span class = "desc"> and lives in </span><span class = "stat">'+uData.location+'</span><span class = "desc">.</span>');
        $('content').append('<span class  = "desc">'+uData.name+' is a part of </span>');
	});
	//getOrgs(userName);
    getRepos(userName);
}

//Get users' organization info using GitHub API
function getOrgs(username) {
	var orgCount = 0;
	var oData = {};
	$.get(base + username+'/orgs', function (orgData) {
		oData = orgData;
		for (var orgs in oData) {
			orgCount++;
            alert(orgs.login);
		}
	});
}

//Get users' repo data using GitHub API
function getRepos(user) {
    var repos = [],
		uLang = [],
		langList = [], //To prevent duplicates
		arrInd;
		
	$.get(base + user + '/repos', function (repoData) {
			rData = repoData;
			$.each(rData, function(i, repoInf) {
				repos.push({info:repoInf});
			});

		//Sort repos by stars
		function sortByStars(a, b) {
				return b.info.stargazers_count - a.info.stargazers_count;
		};
		
		repos.sort(sortByStars);
		
		$('#repos').append('<table><thead><tr><th>Repo Name</th><th>Stars</th><th>Forks</th></tr></thead><tbody><tr><td>'+repos[0].info.name+'</td><td style="text-align:center;">'+repos[0].info.stargazers_count+'</td><td style="text-align:center;">'+repos[0].info.forks_count+'</td></tr><tr><td>'+repos[1].info.name+'</td><td style="text-align:center;">'+repos[1].info.stargazers_count+'</td><td style="text-align:center;">'+repos[1].info.forks_count+'</td></tr><tr><td>'+repos[2].info.name+'</td><td style="text-align:center;">'+repos[2].info.stargazers_count+'</td><td style="text-align:center;">'+repos[2].info.forks_count+'</td></tr><tr><td>'+repos[3].info.name+'</td><td style="text-align:center;">'+repos[3].info.stargazers_count+'</td><td style="text-align:center;">'+repos[3].info.forks_count+'</td></tr><tr><td>'+repos[4].info.name+'</td><td style="text-align:center;">'+repos[4].info.stargazers_count+'</td><td style="text-align:center;">'+repos[4].info.forks_count+'</td></tr></tbody></table>');

		for (var i = 0; i < repos.length; i++) {
			if (repos[i].info.language) {
				if (langList.indexOf(repos[i].info.language) === -1) {
					uLang.push({val:1, label:repos[i].info.language});
					langList[langList.length] = repos[i].info.language;
				} else {
					uLang[langList.indexOf(repos[i].info.language)].val++;
				}
			}
		}
		
		//Get users' language stats and plot a graph of the data
		var ctx = document.getElementById("lang-chart").getContext("2d");
		var data = [];
		var langChart = new Chart(ctx).Doughnut(data, {animateScale: true});
		
		for (var i = 0; i < langList.length; i++) {
			langChart.addData({
				value: uLang[i].val,
				color: getColor(),
				label: uLang[i].label
			});
		}
		
		//Return a color for the Chart data
		function getColor() {
			return '#'+Math.floor(Math.random()*16777215).toString(16);
		}
		
	});
}

//Help message
function showHelp() {
	var help = 'Enter the username of the GitHub member you are looking for.';
	$('#messages').append('<p class = "help">'+help+'</p>');
	$('#messages').show();
	setTimeout(function() {
        $("#messages").fadeOut("slow", function() {
            $("#messages").hide();
        });
    }, 5000);
}

//Information about Committed
function showInfo() {
	var info = 'Committed is not affiliated with GitHub, it simply uses the <a href = "https://developer.github.com">GitHub API</a>.</br>Committed was made with &hearts; by <a href = "http://nischaal.me">Nischaal Cooray</a>.</br>Check out <a href ="https://github.com/nischaalc/committed">Committed</a> on GitHub!</br>Committed is NOT optimized for mobile devices YET!'
	$('#messages').append('<p class = "info">'+info+'</p>');
	$('#messages').show();
	setTimeout(function() {
        $("#messages").fadeOut("slow", function() {
            $("#messages").hide();
        });
    }, 9000);
}

//Oops
function showOops() {
	var oops = 'Ah! Hello! I see that I didn\'t make myself understandable enough - sorry about that.</br>What I meant was to enter the username of the user that you are trying to find information about.</br>Now go get \'em!';
	$('#messages').append('<p class = "oops">'+oops+'</p>');
	$('#messages').show();
	setTimeout(function() {
        $("#messages").fadeOut("slow", function() {
            $("#messages").hide();
        });
    }, 9000);
}
//Error message - not implemented fully yet
function unrecognized(text) {
	var error = '';
	if (text.length == 0) error = 'I ain\'t silly, I know you didn\'t type anything!</br>Try again!';
	else error = 'Ah shucks... I couldn\'t find that user... Would you give me another chance?';
	$('#messages').append('<p class = "error">'+error+'</p>');
	$('#messages').show();
	setTimeout(function() {
        $("#messages").fadeOut("slow", function() {
            $("#messages").hide();
        });
    }, 5000);
}

// Take user back to search screen
$( '#go-back' ).click(function() {
		$('#data').fadeOut(500, function () {
			$('#search').fadeIn(500);
			$('.spinner').hide();
			$('#username').focus();
		});
});
