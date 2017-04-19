var state = {
  beginDate: 18510918,
  endDate: 20200101,
  page: 0
};

function getDataFromApi(term, beginDate, endDate, pageNum, sortOrder, callback) {
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({
    'api-key': "f8d4f007b2584ff48d7b7177f0f4008c",
    'q': term,
    'begin_date': beginDate,
    'end_date': endDate,
    'page': pageNum
  });
  if (sortOrder) {
    url += '&sort=' + sortOrder;
  }
  $.ajax({url: url, method: 'GET'}).done(function(result) {
    callback(result);
  }).fail(function(err) {
    throw err;
  });
}

function openArticle(article) {
  $('.js-post h4').text(article.headline.main);
  var imageFound = article.multimedia.find(function(image) {
    return image.subtype === 'xlarge';
  });
  if (imageFound) {
    $('.js-post img').attr('src', 'http://www.nytimes.com/' + imageFound.url);
  } else {
    $('.js-post img').attr('src', 'no-image.png');
  }
  if (article.byline) {
    $('.author span').text(article.byline.original);
  }

  //Have to format the date so it's readable
  var dateFormat = article.pub_date.slice(0, 10).split("-");
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
  };
  var newDateFormat = dateFormat.move(0, 2).join('/');
  $('.date span').text(newDateFormat);

  if (article.section_name) {
    $('.area span').text(article.section_name + ' Section');
  }

  $('.js-post p').text(article.lead_paragraph);
  $('.js-post a').attr('href', article.web_url);
  $('.article-list').hide();
  $('.search h2').hide();
  $('.search p').hide();
  $('.search').css('margin-top', '20px');
  $('.wrapper').show();
}

function closeArticle() {
  $('.wrapper').hide();
  $('aside').hide();
  $('.article-list').show();
}

function closure (item) {
  return function(event) {
    openArticle(item);
  };
}

function previousPage() {
  $('#previous').click(function() {
    state.page --;
    $('#next').prop('disabled', false);
    if (state.page === 0) {
      $('#previous').prop('disabled', true);
    }
    submitQuery();
  })
}

function nextPage() {
  $('#next').click(function() {
    state.page ++;
    $('#previous').prop('disabled', false);
    if (state.page === 10) {
      $('#next').prop('disabled', true);
    }
    submitQuery();
  })
}

function clearSearch() {
  $('.js-clear').click(function() {
    $("#js-search, textarea").val("");
    submitQuery();
    location.reload();
  })

}

function submitQuery() {
  $('#divlist').empty();
  state.query = $('#js-search').val();
  if ($('#js-beginDate').val()) {
    var beginDate = $('#js-beginDate').val();
    var dateArray = beginDate.split('/');
    state.beginDate = dateArray[2] + dateArray[0] + dateArray[1];
    localStorage.beginDate = state.beginDate;
  }
  if ($('#js-endDate').val()) {
    var endDate = $('#js-endDate').val();
    var dateArray = endDate.split('/');
    state.endDate = dateArray[2] + dateArray[0] + dateArray[1];
    localStorage.endDate = state.endDate;
  }
  localStorage.query = state.query;
  getDataFromApi(state.query, state.beginDate, state.endDate, state.page, state.sort, function(data) {
    data.response.docs.forEach(function(item) {
      var htmlItem = $('article.hidden').clone();
      if (item.headline.main.length > 115) {
        item.headline.main = item.headline.main.substring(0,130) + '...';
      }
      htmlItem.find('.card-title').text(item.headline.main);
      htmlItem.find('.card').click(closure(item));
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
      $('.search').hide();
      $('.pagination').show();
    });
  });
}

$(function() {
  $('#js-beginDate').mask('00/00/0000');
  $('#js-endDate').mask('00/00/0000');
  previousPage();
  nextPage();
  clearSearch();
  $('select').material_select();
  $('#selector').change(function(event) {
    state.sort = event.target.value;
    submitQuery();
  })
  if ('query' in localStorage) {
    state.query = localStorage.query;
    $('#js-search').val(state.query);
    submitQuery();
  }
  Materialize.updateTextFields();
  $('form').submit(function(event) {
    event.preventDefault();
    $('section #divlist').empty();
    submitQuery();
  })
  $('#search-icon').click(function() {
    $('form').submit();
  });
  $('.close').click(function() {
    closeArticle();
  });
});
