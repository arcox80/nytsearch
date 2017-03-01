getDataFromApi('new york giants', function (data) {
  data.response.docs.forEach(function (item) {
    var htmlItem = $('article.hidden').clone();
    htmlItem.find('.card-title').text(item.headline.main).click(function (event) {
      openArticle(item);
    });
    htmlItem.find('.js-snippet').text(item.snippet);
    var imageFound = item.multimedia.find(function (image) {
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

function getDataFromApi (term, callback) {
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({
    'api-key': "f8d4f007b2584ff48d7b7177f0f4008c",
    q: term
  });
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(result) {
    console.log(result);
    callback(result);
  }).fail(function(err) {
    throw err;
  });
}

function buildPost () {
  //show url
  //headline
  //section
  //date
  //image
  //text
}

function openArticle (article) {
  $('.js-post h3').text(article.section_name);
  $('section').hide();
  $('.js-post').show();
  $('aside').show();
}

function closeArticle () {
  $('.js-post').hide();
  $('aside').hide();
  $('section').show();
}
