//initialize movies object
var movieController = new Movies();
movieController.showMessage(movieController.message.initSearch);

//function used to adjust poster heights
function changePosterContainerHeight(){
	$('.movie .poster-container').each(function(index){
		var posterHeight = $(this).children('img:first-child').height();
		 $(this).height(posterHeight);
	});
	
}

//scroll loader function
(function(){
	
		$(window).on('scroll',function(event){
			if(movieController.infoContainerDisplayed === false){
				if(movieController.currentSearch !== ''){
					var scrollTop = $(window).scrollTop();
					var windowHeight = $(window).height();
					var documentHeight = $(document).height();
					//check to see if user has scrolled to the bottom
					if(scrollTop + windowHeight === documentHeight){
						if(movieController.currentPage <= movieController.totalPages){
							movieController.currentPage++;
							$.getJSON('https://www.omdbapi.com/',{s:movieController.currentSearch,page:movieController.currentPage},function(data){
								movieController.listMovies(data);
							}).done(function(){
								setTimeout(function(){changePosterContainerHeight();},400);
								if(movieController.currentPage >= movieController.totalPages){
									$('.load-more').remove();
								}
							});
						}
					}
				}
			}	
		});
	
})();


//function used to adjust container size
function adjustMoreInfoContainer(){
	var infoPosterContainer = $('.movie-more-info .poster-container');
	
	//if window size is less than or equal to 768 adjust info poster container height and surrounding elements
	if($(window).innerWidth() <= 768){
		var posterContainerWidth = infoPosterContainer.width();
		var movieTitleHeight = $('.top-info').height();
		var closeHeight = $('.back').height();
		infoPosterContainer.height(posterContainerWidth * 0.87);
		infoPosterContainer.css({top:movieTitleHeight + closeHeight + 20 +'px'});
		
		//move summary below absolute positioned posterContainer
		$('.summary').css({marginTop:infoPosterContainer.height()+ 20 +'px'});
	}else{
		var posterContainerWidth = infoPosterContainer.width();
		infoPosterContainer.css({top:0});
		$('.summary').css({marginTop:0});
		infoPosterContainer.height(infoPosterContainer.children('img:first-child').height());
		
	}
	
}

//on form submit display movies
$('.search-form').on('submit',function(e){
	e.preventDefault();
	var contentContainer = $('.content-container .row');
	contentContainer.html('');
	$('.load-more').remove();
	var value = $(this).children('input:first-child').val().trim();
	movieController.currentPage = 1;
	movieController.currentSearch = value;
	$.ajax({
		url:'https://www.omdbapi.com/',
		data:{s:value},
		dataType: 'json',
		success:function(data){
			if(data.Response === 'False'){
				movieController.showMessage(movieController.message.noResults);
			}else{
				movieController.listMovies(data);
				
			}
		},
		error:function(){
			movieController.showMessage(movieController.message.error);
		}
	}).done(function(data){
		
		movieController.totalPages = Math.ceil(parseInt(data.totalResults)/10);
		alert(movieController.currentPage);
		if(movieController.currentPage < movieController.totalPages && data.Response !== 'False'){
			movieController.addLoadMore();
		}
	});
	
	
	setTimeout(function(){changePosterContainerHeight()},100);
});

changePosterContainerHeight();
adjustMoreInfoContainer();
$(window).resize(function(){
	changePosterContainerHeight();
	adjustMoreInfoContainer();
	navHeight = $('.navigation-container').height();
});