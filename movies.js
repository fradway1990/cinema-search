

function Movies(){
	this.currentPage = 1;
	this.totalPages = 1;
	this.currentSearch = '';
	this.infoContainerDisplayed = false;
	this.message = {
		initSearch: 'Search Results Will Appear Here.',
		noResults: 'No Results Found.',
		error: 'There Was An Error Retrieving Search Results.'
	}
	
}
Movies.prototype.showMoreInfo = function(data){
	var _this = this;
	var img = (data['Poster'] === 'N/A')? 'img/no-poster.svg' : data['Poster'];
	var title = data['Title'];
	var rating = (data['Rated'] === 'N/A')? 'NOT RATED' : data['Rated'];
	var year = data['Year'];
	var plot = (data['Plot'] === 'N/A')? 'No Plot Found' : data['Plot'];
	var genre = data['Genre'];
	
	var contentContainer = $('.content-container');
	
	//create html for info container
	var infoContainer = "<div class='info-container col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	infoContainer += "<div class='movie-more-info col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	infoContainer += "<div class='back'><div class='backArrow'></div>Back</div>";
	infoContainer += "<div class='top-info col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	infoContainer += "<h1 class='movie-title'>"+title+"</h1>";
	infoContainer+= "</div>";
	infoContainer+= "<div class='poster-container col-xs-12 col-sm-4 col-md-4 col-lg-3'>";
	infoContainer+= "<img src='"+img+"' alt='"+title+" poster'>"
	infoContainer+= "</div>";	
	infoContainer+= "<div class='summary col-xs-12 col-sm-8 col-md-8 col-lg-9'>";
	infoContainer+= "<div class='rating'>"+rating+"</div><div class='year'>"+year+"</div>";
	infoContainer+= "<div style='clear: both;'></div>";
	infoContainer+= "<div class='genre'>"+genre+"</div>"
	infoContainer+= "<p>"+ plot +"</p>";
	infoContainer+= "</div>";
	infoContainer+= "</div>";
	infoContainer+= "</div>";
	////////////////////////////////////////////////////////////////////////////////////
	
	
	//add info container to document
	$('.content-container .row').html(infoContainer);
	
	//function to handle when back button is clicked
	$('.back').on('click',function(){
		$('.info-container').remove();
		_this.currentPage = 1;
		$.ajax({
			url:'https://www.omdbapi.com/',
			data:{s:_this.currentSearch},
			success:function(data){
				if(data.Response === 'False'){
					_this.showMessage(_this.message.noResults);
				}else{
					_this.listMovies(data);
					_this.totalPages = Math.ceil(parseInt(data.totalResults)/10);
				}
			},
			error:function(){
				_this.showMessage(_this.message.error);
			}
		}).done(function(data){
			if(_this.currentPage < _this.totalPages && data.Response !== 'False'){
				_this.addLoadMore();
				
			}
		});
		
		_this.infoContainerDisplayed = false;
	});
	
	
}
	
Movies.prototype.listMovies = function(data){
	var _this = this;
	
	
	//create individual .movie element
	for(var i in data['Search']){
		var img = (data['Search'][i]['Poster'] === 'N/A')? 'img/no-poster.svg' : data['Search'][i]['Poster'];
		var title = data['Search'][i]['Title'];
		var year = data['Search'][i]['Year'];
		var imdb = data['Search'][i]['imdbID'];
		
		var movieContainer = $('<div></div>',{
			class:'movie-container col-xs-12 col-sm-6 col-md-4 col-lg-4'
		}).appendTo('#content-row');
		
		var movie = $('<div></div>',{
			class:'movie col-xs-12 col-sm-12 col-md-12 col-lg-12'
		}).appendTo(movieContainer);
		
		var posterContainer = $('<div></div>',{
			class:'poster-container col-xs-4 col-sm-4 col-md-4 col-lg-4'
		}).appendTo(movie);
		
		var poster = $('<img>',{
			src: img,
			alt:title + ' Poster'
		}).appendTo(posterContainer);
		
		poster.error(function(){
			$(this).attr('src','img/no-poster.png');
		});
		
		var movieInfo = $('<div></div>',{
			class:'movie-info col-xs-8 col-sm-8 col-md-8 col-lg-8'
		}).appendTo(movie);
		movieInfo.html("<h1 class='movie-title'>"+title+"</h1><div class='year'>"+year+"</div><div style='clear: both;'></div>");
		var movieButton = $('<button></button>',{
			class:'more-info-button',
			type:'button',
			'data-imdb': imdb,
			text:'More Info'
		}).appendTo(movieInfo);
		movieButton.on('click',function(){
			$.getJSON('https://www.omdbapi.com/',{i:$(this).attr('data-imdb')},function(data){
				
			}).done(function(data){
				$('.content-container .row').html('');
				_this.infoContainerDisplayed = true;
				_this.showMoreInfo(data);
				setTimeout(function(){adjustMoreInfoContainer()},600);
				
			});
			
		});
	}
	
	
}

Movies.prototype.addLoadMore = function(){
	var _this = this;
	var loadRow = $('<div></div>',{
		class:'row load-more'
	}).appendTo('.content-container');
	var loadCol = $('<div></div>',{
		class:'col-xs-12 col-sm-12 col-md-12 col-lg-12'
	}).appendTo(loadRow);
	var loadButton = $('<button></button>',{
		class:'load-more-button',
		text:'See More Results'
	}).appendTo(loadCol);
	loadButton.on('click',function(){
		_this.currentPage++;
		if(_this.currentPage <= _this.totalPages){
			$.getJSON('https://www.omdbapi.com/',{s: _this.currentSearch, page:_this.currentPage},function(data){
				_this.listMovies(data);
			});
		}
		if(_this.currentPage === _this.totalPages){
			$(loadRow).remove();
		}
	});
	
}

Movies.prototype.showMessage = function(message){
	$('#content-row').html('');
	var message = $('<div></div>',{
		text:message,
		class:'col-xs-12 col-sm-12 col-md-12 col-lg-12 message'
	});
	message.appendTo('#content-row');
}

