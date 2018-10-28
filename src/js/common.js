(function() {

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        document.documentElement.classList.add('_with-touch')
    } else {
        document.documentElement.classList.add('_no-touch')
    }

    function masonryInit() {

        new Masonry( '.grid', {
            itemSelector: '.grid-item'
        });
    }

    function linksInit() {

        var dataPageLink = 'data-page-link';
        var pageLinks = document.querySelectorAll('[' + dataPageLink + ']');
        for (var i = 0; i < pageLinks.length; i++) {
            pageLinks[i].addEventListener("click", function(e) {
                e.preventDefault();
                var page = this.getAttribute(dataPageLink);
                ajaxRequest(page);
            });
        }
    }

    function ajaxRequest(page) {

        var xhr = new XMLHttpRequest();
        var mainEl = document.querySelector('.main');
        xhr.open('GET', 'pages/' + page + '.html');
        xhr.onreadystatechange = function() {
            mainEl.classList.add("main_animated");
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = xhr.response;
                setTimeout(function() {
                    mainEl.innerHTML = data;
                    mainEl.classList.remove("main_animated");
                    if (page == 'home') {
                        masonryInit();
                        linksInit();
                    }
                    scrollToTop();
                }, 250);
            }
        }
        xhr.send();

    }

    function scrollToTop() {

        window.scrollTo(0,0);
    }

    window.onload = function() {

        masonryInit();
        linksInit();
    }

})();
