function buildTabs() {
  loadTodayInTabs(function(tabsPage,links) {
    var popupDiv = document.getElementById('tabs_div');
    var ol = popupDiv.appendChild(document.createElement('ol'));
    links.forEach(function(link) {
      var li = ol.appendChild(document.createElement('li'));
      var a = li.appendChild(document.createElement('a'));
      a.href = link.href;
      a.appendChild(document.createTextNode(link.name));
      a.addEventListener('click', function() {
        chrome.tabs.create({ url: event.srcElement.href });
        return false;
      });
    });
    var openAllLink = popupDiv.appendChild(document.createElement('a'));
    openAllLink.href = tabsPage;
    openAllLink.setAttribute('class','open-all');
    openAllLink.appendChild(document.createTextNode('Open All Tabs'));
    openAllLink.addEventListener('click', function() {
      links.forEach(function(link) {
        chrome.tabs.create({ url: link.href });
      });
      chrome.tabs.create({ url: tabsPage });
      return false;
    });
  });
}

function loadTodayInTabs(callback) {
  loadHTML('http://www.fastcolabs.com/section/today-in-tabs',function(dom) {
    var hrefEl = dom.querySelector('#page-body ul.post-list li h3.title a');
    if (hrefEl != null) {
      var href = 'http://www.fastcolabs.com/'+hrefEl.getAttribute('href');
      loadHTML(href,function(dom) {
        var links = dom.querySelectorAll('#page-body article .body p a');
        var linksArr = [];
        for(var i = 0; i < links.length; i++) {
          linksArr.push({
            'href': links[i].href,
            'name': links[i].innerText
          });
        }
        callback(href,linksArr);
      });
    }
  });
}

function loadHTML(url,callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var dom = parseHTML(xhr.responseText);
      if (dom != null) {
        callback(dom);
      }
    }
  }
  xhr.send();
}

function parseHTML(html) {
  var el = document.createElement('div');
  el.innerHTML = html;
  return el;
}

buildTabs();