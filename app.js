var state = {};

function getDataFromApi(term, callback) {
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({'api-key': "f8d4f007b2584ff48d7b7177f0f4008c", q: term});
  $.ajax({url: url, method: 'GET'}).done(function(result) {
    console.log(result);
    callback(result);
  }).fail(function(err) {
    throw err;
  });
}

function openArticle(article) {
  $('.js-post h1').text(article.headline.main);
  var imageFound = article.multimedia.find(function(image) {
    return image.subtype === 'xlarge';
  });
  if (imageFound) {
    $('.js-post img').attr('src', 'http://www.nytimes.com/' + imageFound.url);
  }
  $('.author span').text(article.byline.original);

  var dateFormat = article.pub_date.slice(0,10).split("-");
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
  };
  var newDateFormat = dateFormat.move(0,2).join('/');
  $('.date span').text(newDateFormat);

  $('.area span').text(article.section_name + ' Section');
  $('.js-post p').text(article.lead_paragraph);
  $('.js-post a').attr('href', article.web_url);
  $('.article-list').hide();
  $('.search h2').hide();
  $('.search p').hide();
  $('.search').css('margin-top', '20px');
  $('.wrapper').show();
  $('aside').show();
}

function closeArticle() {
  $('.wrapper').hide();
  $('aside').hide();
  $('.article-list').show();
}

function submitQuery() {
  state.query = $('#js-search').val();
  localStorage.query = state.query;
  getDataFromApi(state.query, function(data) {
    data.response.docs.forEach(function(item) {
      $('ul').append('<li>' + item.headline.main +'</li>');
      var htmlItem = $('article.hidden').clone();
      htmlItem.find('.card-title').text(item.headline.main);
      $('.card').click(function(event) {
        openArticle(item);
      });
      htmlItem.find('.js-snippet').text(item.snippet);
      var imageFound = item.multimedia.find(function(image) {
        return image.subtype === 'thumbnail';
      });
      if (imageFound) {
        htmlItem.find('img').attr('src', 'http://www.nytimes.com/' + imageFound.url);
      } else {
        htmlItem.find('img').attr('src', 'timeslogo.png');
      }
      htmlItem.removeClass('hidden');
      $('section #divlist').append(htmlItem);
    });
  });
}

$(function() {
  if ('query' in localStorage) {
    state.query = localStorage.query;
    $('#js-search').val(state.query);
    submitQuery();
  }
  Materialize.updateTextFields();
  $('form').submit(function(event) {
    event.preventDefault();
    //$('.results').detach();
    submitQuery();
  })
  $('#search-icon').click(function() {
    $('form').submit();
  });
  $('.close').click(function() {
    closeArticle();
  });
});
