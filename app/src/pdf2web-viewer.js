function pdf2web(params) {

    // init variables
    var currentPage = 1;
    var showingTwoPages;
    var numPages = params.manifest.pages.length;
    var pages = params.manifest.pages.sort((a, b) => { return a.order - b.order });
    var pagesElement;

    // init DOM elements
    params.target.classList.add('pdf2web-wrapper');
    injectStyles();
    createAllPages();
    createPagination();
    attachKeyboardHandlers();
    attachSwipeHandlers();

    function firstImageLoaded() {
        params.target.classList.add('loaded');
        var resizeTimeout;
        window.addEventListener('resize', function() {
            // debounce the resize
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateLayout();
            }, 200);
        });
        updateAspectRatio();
    }

    function updateAspectRatio() {
        var firstImage = params.target.querySelector('.pdf2web-page-1 > img');
        var width = firstImage.naturalWidth;
        var height = firstImage.naturalHeight;
        if (params.showTwoPages && !isMobile()) width = width * 2;
        pagesElement.style.aspectRatio = width + '/' + height;
    }

    function isMobile() {
        return (params.target.clientWidth <= params.mobileBreakpoint);
    }

    // switch between 1-page and 2-page layout depending on contaner size
    function updateLayout() {
        if (params.showTwoPages) {
            if (isMobile()) {
                showingTwoPages = false;
                pagesElement.classList.remove('pdf2web-pages-show-two');
                goToPage(currentPage);
            } else {
                showingTwoPages = true;
                pagesElement.classList.add('pdf2web-pages-show-two');
                goToPage(currentPage);
            }
        }
        updateAspectRatio();
    }

    function createAllPages() {
        pagesElement = document.createElement('div');
        pagesElement.className = 'pdf2web-pages';
        if (params.showTwoPages && !isMobile()) {
            pagesElement.className += ' pdf2web-pages-show-two pdf2web-cover-page-visible';
            if (pages.length == 2) pagesElement.className += ' pdf2web-two-page-book';
            showingTwoPages = true;
        }
        pages.forEach(function(page, index) {
            createSinglePage(pagesElement, page, index + 1);
        });
        params.target.prepend(pagesElement);
    }

    function createSinglePage(target, page, pageNum) {
        var div = document.createElement('div');
        var odd = ' odd';
        if (pageNum % 2 == 0) odd = ' even';
        div.className = 'pdf2web-page pdf2web-page-' + pageNum + odd;
        div.dataset.page = pageNum;
        div.style.zIndex = 1000 + numPages - pageNum;
        var img = document.createElement('img');
        img.src = params.imagesBaseUrl + page.filename;
        img.alt = 'Page ' + pageNum;
        if (pageNum == 1) {
            img.addEventListener('load', firstImageLoaded);
        }
        creteAreas(div, page.areas);
        div.appendChild(img);
        target.appendChild(div);
    }

    function creteAreas(element, areas) {
        if (!areas || !areas.length) return;
        areas.forEach(function(area) {
            var a = document.createElement('a');
            a.className = 'pdf2web-area';
            a.style.left = area.left + '%';
            a.style.top = area.top + '%';
            a.style.width = area.width + '%';
            a.style.height = area.height + '%';
            a.setAttribute('href', area.url);
            a.setAttribute('target', '_blank');
            if (area.tooltip) a.setAttribute('data-tooltip', area.tooltip);
            element.appendChild(a);
        });
    }

    function attachSwipeHandlers() {
        var startX = 0;
        var isSwiping = false;
        var pageFlipped = false;
        var rotate = 0;
        var item;
        var prev;

        function isZoomed() {
            var windowWidth = window.innerWidth;
            var documentWidth = document.documentElement.clientWidth;
            return windowWidth < documentWidth;
        }

        function getFlipAmount(currentX) {
            var containerRect = params.target.getBoundingClientRect();
            var mult = (showingTwoPages ? 4 : 2)
            var flipAmount = (currentX - startX) / containerRect.width * mult;
            flipAmount = Math.min(flipAmount, 1);
            flipAmount = Math.max(flipAmount, -1);
            return flipAmount;
        }

        function touchStart(event) {
            if (event.type === 'touchstart') {
                if (event.touches.length > 1 || isZoomed()) return;
                startX = event.touches[0].clientX;
            } else if (event.type === 'mousedown') {
                if (isZoomed()) return;
                startX = event.clientX;
            }

            event.preventDefault();

            isSwiping = true;
            var itemIndex = currentPage - 1;
            if (showingTwoPages && currentPage > 1) itemIndex = currentPage;
            var items = pagesElement.querySelectorAll('.pdf2web-page');
            if (itemIndex >= items.length - 1) {
                item = null;
                prev = items[itemIndex - 1];
            } else {
                item = items[itemIndex];
                prev = item.previousElementSibling;
            }
        }

        function touchMove(event) {
            if (pageFlipped) event.preventDefault();

            var clientX;
            if (event.type === 'touchmove') {
                if (!isSwiping || event.touches.length > 1 || isZoomed()) return;
                clientX = event.touches[0].clientX;
            } else if (event.type === 'mousemove') {
                if (!isSwiping || isZoomed()) return;
                clientX = event.clientX;
            }

            event.preventDefault();

            var flipAmount = getFlipAmount(clientX);
            if (flipAmount < 0) {
                rotate = (flipAmount * 90);
                if (item) {
                    item.style.transform = 'rotateY(' + rotate + 'deg)';
                    item.style.transition = 'all 0.1s ease';
                    if (rotate < -70) {
                        isSwiping = false;
                        pageFlipped = true;
                        resetSwipingTransition();
                        goToPage(getNextPage());
                    }
                }
            }
            if (flipAmount > 0) {
                if (item) {
                    item.style.transform = 'rotateY(0deg)';
                    item.style.transition = 'all 0.1s ease';
                }
                if (prev) {
                    if (showingTwoPages) {
                        rotate = (flipAmount * 90);
                    } else {
                        rotate = -90 + (flipAmount * 90);
                    }
                    prev.style.transform = 'rotateY(' + rotate + 'deg)';
                    prev.style.transition = 'all 0.1s ease';
                    if (rotate >= 70 || (rotate < 0 && rotate > -45)) {
                        isSwiping = false;
                        pageFlipped = true;
                        resetSwipingTransition();
                        goToPage(getPreviousPage());
                    }
                }
            }
        }

        function resetSwipingTransition() {
            if (item) {
                item.style.transform = '';
                item.style.transition = '';
            }
            if (prev) {
                prev.style.transform = '';
                prev.style.transition = '';
            }
        }
       
        function touchEnd(event) {
            pageFlipped = false;
            resetSwipingTransition();
            isSwiping = false;
        }

        pagesElement.addEventListener('touchstart', touchStart);
        pagesElement.addEventListener('touchmove', touchMove);
        pagesElement.addEventListener('touchend', touchEnd);
        pagesElement.addEventListener('mousedown', touchStart);
        pagesElement.addEventListener('mousemove', touchMove);
        pagesElement.addEventListener('mouseup', touchEnd);
        pagesElement.addEventListener('mouseleave', touchEnd);
    }

    function createPagination() {
        var div = document.createElement('div');
        div.className = 'pdf2web-pagination-container';
        div.innerHTML = `
            <ul class="pdf2web-pagination">
                <li class="pdf2web-pagination-first"><a href="#" aria-label="Go to first page">First</a></li>
                <li class="pdf2web-pagination-prev"><a href="#" aria-label="Go to previous page">Previous</a></li>
                <li class="pdf2web-pagination-nums"></li>
                <li class="pdf2web-pagination-next"><a href="#" aria-label="Go to next page">Next</a></li>
                <li class="pdf2web-pagination-last"><a href="#" aria-label="Go to last page">Last</a></li>
            </ul>
        `;
        params.target.appendChild(div);
        updatePagination();
        params.target.querySelector('.pdf2web-pagination-first').addEventListener('click', function(e) {
            e.preventDefault();
            for (var i = currentPage; i > 1; i--) {
                setTimeout(function() { goToPage(getPreviousPage()); }, i * 100);
            }
        });
        params.target.querySelector('.pdf2web-pagination-prev').addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(getPreviousPage());
        });
        params.target.querySelector('.pdf2web-pagination-next').addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(getNextPage());
        });
        params.target.querySelector('.pdf2web-pagination-last').addEventListener('click', function(e) {
            e.preventDefault();
            for (var i = currentPage; i < numPages; i++) {
                setTimeout(function() { goToPage(getNextPage()); }, i * 100);
            }
        });
    }

    function getPreviousPage() {
        var prevPage = currentPage - 1;
        if (showingTwoPages) prevPage = currentPage - 2;
        if (prevPage <= 1) prevPage = 1;
        return prevPage;
    }

    function getNextPage() {
        var nextPage = currentPage + 1;
        if (showingTwoPages) {
            if (currentPage == 1) nextPage = currentPage + 1
            else nextPage = currentPage + 2;
        }
        if (nextPage > numPages) nextPage = currentPage;
        return nextPage;
    }

    function getLastPage() {
        var lastPage = numPages;
        if (showingTwoPages) {
            var lastPageEven = (numPages % 2 == 0);
            if (lastPageEven) lastPage = numPages;
            else lastPage = numPages - 1;
        }
        return lastPage;
    }

    function goToPage(page) {
        currentPage = page;
        if (currentPage == 1) pagesElement.classList.add('pdf2web-first');
        else pagesElement.classList.remove('pdf2web-first');
        if (currentPage == numPages) pagesElement.classList.add('pdf2web-last');
        else pagesElement.classList.remove('pdf2web-last');
        params.target.querySelectorAll('.pdf2web-page').forEach(function(page, index) {
            page.classList.remove('flipped');
            page.classList.remove('open');
            page.classList.remove('opposite');
            if ((index + 1) < currentPage) {
                page.classList.add('flipped');
            } else {
                if ((index + 1) == currentPage) {
                    if (currentPage > 1) page.classList.add('open');
                    else page.classList.add('opposite');
                } else if (index == currentPage) { 
                    page.classList.add('opposite');
                }
            }
        });
        updatePagination();
        centerCoverPage();
    }

    function centerCoverPage() {
        if (currentPage == 1) {
            params.target.querySelector(".pdf2web-pages").classList.add('pdf2web-cover-page-visible');
        } else {
            params.target.querySelector(".pdf2web-pages").classList.remove('pdf2web-cover-page-visible');
        }
    }

    function updatePagination() {
        var num = params.target.querySelector('.pdf2web-pagination-nums');
        num.innerText = currentPage + " / " + numPages;
        if (currentPage == 1) {
            params.target.querySelector(".pdf2web-pagination-first").classList.add('pdf2web-disabled');
            params.target.querySelector(".pdf2web-pagination-prev").classList.add('pdf2web-disabled');
        } else {
            params.target.querySelector(".pdf2web-pagination-first").classList.remove('pdf2web-disabled');
            params.target.querySelector(".pdf2web-pagination-prev").classList.remove('pdf2web-disabled');
        }
        if (currentPage == params.manifest.pages.length) {
            params.target.querySelector(".pdf2web-pagination-last").classList.add('pdf2web-disabled');
            params.target.querySelector(".pdf2web-pagination-next").classList.add('pdf2web-disabled');
        } else {
            params.target.querySelector(".pdf2web-pagination-last").classList.remove('pdf2web-disabled');
            params.target.querySelector(".pdf2web-pagination-next").classList.remove('pdf2web-disabled');
        }
    }

    function attachKeyboardHandlers() {
        document.addEventListener('keydown', function(event) {
            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    goToPage(getPreviousPage());
                    break;

                case "ArrowRight":
                    event.preventDefault();
                    goToPage(getNextPage());
                    break;

                case "Home":
                    event.preventDefault();
                    for (var i = currentPage; i > 1; i--) {
                        setTimeout(function() { goToPage(getPreviousPage()); }, i * 100);
                    }
                    break;

                case "End":
                    event.preventDefault();
                    for (var i = currentPage; i < numPages; i++) {
                        setTimeout(function() { goToPage(getNextPage()); }, i * 100);
                    }
                    break;
            }
        });
    }

    function injectStyles() {
        var styles = `
            .pdf2web-wrapper {
                opacity: 0;
                height: 100%;
            }

            .pdf2web-wrapper.loaded {
                opacity: 1;
            }

            .pdf2web-pages {
                perspective: 4000px;
                transition: transform 0.4s ease-in-out;
                max-width: 100%;
                max-height: calc(100% - 80px);
                margin: 0 auto;
            }

            .pdf2web-pages.pdf2web-pages-show-two.pdf2web-cover-page-visible {
                transform: translateX(-25%);
            }

            .pdf2web-pages.pdf2web-pages-show-two.pdf2web-last {
                transform: translateX(25%);
            }

            .pdf2web-pages.pdf2web-pages-show-two.pdf2web-two-page-book {
                transition: transform 0.6s ease-in;
            }

            .pdf2web-page {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                transition: transform 0.6s ease-in;
                transform-style: preserve-3d;
                backface-visibility: hidden;
                transform-origin: 0 50%;
                cursor: grab;
                overflow: hidden;
            }

            .pdf2web-pages-show-two .pdf2web-page {
                width: 50%;
                left: 50%;
            }

            .pdf2web-page.flipped {
                transform: rotateY(-90deg);
                point-events: none;
            }

            .pdf2web-pages-show-two .pdf2web-page.odd.opposite {
                transition: transform 0.6s ease-out 0.6s;
            }

            .pdf2web-pages-show-two .pdf2web-page.even {
                transform: rotateY(90deg);
                transform-origin: 100% 50%;
                transition: transform 0.6s ease-in, 0.6s z-index ease-out 0.6s;
                left: 0;
            }

            .pdf2web-pages-show-two .pdf2web-page.even.open {
                transition: transform 0.6s ease-out 0.6s, 0.6s z-index ease-out 0.6s;
                transform: rotateY(0deg);
            }

            .pdf2web-pages-show-two .pdf2web-page.even.flipped {
                transform: rotateY(0deg);
                z-index: 0 !important;
            }

            .pdf2web-page .pdf2web-area {
                display: block;
                position: absolute;
                background: rgba(0, 0, 80, 0.3);
                transition: all 0.2s ease;
                border: 1px dashed #808080;
                border-radius: 10px;
                opacity: 0;
            }

            .pdf2web-page .pdf2web-area:hover {
                opacity: 1;
            }

            .pdf2web-page .pdf2web-area::after {
              content: attr(data-tooltip);
              display: inline-block;
              padding: 0.2em 0.6em; 
              background: #303030;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              max-width: 80%;
              color: #fff;
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translate(-50%, -1em);
              z-index: 1;
              border-radius: 4px;
            }

            .pdf2web-page img {
                width: 100%;
                max-width: 100%;
                height: auto;
                display: block;
            }

            .pdf2web-pagination {
                height: 80px;
                list-style: none;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 0;
                margin: 0;
                user-select: none;
            }

            .pdf2web-pagination > li {
                display: inline-block;
                margin: 0 0.5em;
            }

            .pdf2web-pagination .pdf2web-disabled {
                pointer-events: none;
                opacity: 0.3;
            }
        `;

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

}