// all Tab Elements
var allTabsArray = document.getElementsByClassName('webts-tabs'), // all webts-tab Elements
allTabLinksArray = document.getElementsByClassName('webts-tab-links'), // all webts-tab-link Elements
allTabContentsArray = document.getElementsByClassName('webts-tab-contents'); //all webts-content Elements
// Tabs constructor function
var Tabs = /** @class */ (function () {
    function Tabs(tabsElement, index) {
        // import parameters
        this.index = index;
        this.tabsElement = tabsElement;
        // fill existing parmeters with external parameter help
        this.linksElement = this.findUniqueTabChildrenWithClass('webts-tab-links');
        this.contentsElement = this.findUniqueTabChildrenWithClass('webts-tab-contents');
        // check if count tabs = count contents
        if (this.linksElement.children.length !== this.contentsElement.children.length) {
            console.warn('Das Tab-Element mit dem Index ' + index + ' hat nicht genauso viele tabs wie Content-Boxen!');
        }
        else {
            // init styling methods
            this.linkBarWidth = this.getTabContentWidth();
            this.setContentWidth();
            // add ink bar
            this.createInkBarElement();
            this.inkBar = tabsElement.children[1];
            this.inkBarWidth = this.inkBar.clientWidth;
            // set init Tab active
            this.setTabActive(0);
            // Event Listener definition
            this.addTabClickEventListener();
            this.addWindowResizeEventListener();
        }
    }
    Tabs.prototype.findUniqueTabChildrenWithClass = function (className) {
        var elements = [], tabElemChildren = this.tabsElement.children;
        for (var tabElemChildrenCount = 0; tabElemChildrenCount < tabElemChildren.length; tabElemChildrenCount++) {
            var tabElemChild = tabElemChildren[tabElemChildrenCount];
            if (tabElemChild.classList.contains(className)) {
                elements.push(tabElemChild);
            }
        }
        if (elements.length === 1) {
            return elements[0];
        }
        else if (elements.length < 1) {
            console.warn('Es gibt kein Element mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
        }
        else {
            console.warn('Es gibt mehrere Elemente mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
        }
    };
    Tabs.prototype.getTabContentWidth = function () {
        if (this.linksElement instanceof Element) {
            return this.linksElement.getBoundingClientRect().width;
        }
        else {
            console.warn('linksElement is not of type Element!');
            return 0;
        }
    };
    Tabs.prototype.setContentWidth = function () {
        var contentsChilds = this.contentsElement.children;
        // set total content width
        this.contentsElement.setAttribute('style', 'width: ' + (this.linkBarWidth * contentsChilds.length) + 'px');
        if (contentsChilds instanceof HTMLCollection) {
            for (var i = 0; i < contentsChilds.length; i++) {
                var contentElem = contentsChilds[i];
                contentElem.setAttribute('style', 'width:' + this.linkBarWidth + 'px');
            }
        }
        else {
            console.warn('contentsElement.children ist keine HTML-Collection');
        }
    };
    Tabs.prototype.createInkBarElement = function () {
        var elem = document.createElement('div');
        elem.classList.add('webts-ink-bar');
        this.linksElement.parentNode.insertBefore(elem, this.linksElement.nextSibling);
    };
    Tabs.prototype.moveInkBarToTab = function (index) {
        var tabLink = this.linksElement.children[index], tabLinkWidth = tabLink.clientWidth;
    };
    Tabs.prototype.setTabActive = function (index) {
        var tabs = this.linksElement.children, contents = this.contentsElement.children;
        this.moveInkBarToTab(index);
        for (var i = 0; i < tabs.length; i++) {
            var actualTab = tabs[i], actualContent = contents[i];
            if (i !== index) {
                // remove class active if present
                if (actualTab.classList.contains('active')) {
                    actualTab.classList.remove('active');
                }
                if (actualContent.classList.contains('active')) {
                    actualContent.classList.remove('active');
                }
            }
            else {
                // add class active if not already present
                if (!actualTab.classList.contains('active')) {
                    actualTab.classList.add('active');
                }
                if (!actualContent.classList.contains('active')) {
                    actualContent.classList.add('active');
                }
            }
        }
    };
    // Event Listener Creation
    Tabs.prototype.addTabClickEventListener = function () {
        var _this = this;
        var linksChildren = this.linksElement.children;
        var _loop_1 = function (i) {
            linksChildren[i].addEventListener('click', function () {
                _this.setTabActive(i);
            });
        };
        // addd event listener to every element
        for (var i = 0; i < linksChildren.length; i++) {
            _loop_1(i);
        }
    };
    Tabs.prototype.addWindowResizeEventListener = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            _this.getTabContentWidth();
            _this.setContentWidth();
        });
    };
    return Tabs;
}());
// Onload
window.onload = function () {
    for (var allTabsIndex = 0; allTabsIndex < allTabsArray.length; allTabsIndex++) {
        var tabLinkBar = allTabLinksArray[allTabsIndex], tabContentBox = allTabContentsArray[allTabsIndex];
        var tab = new Tabs(allTabsArray[allTabsIndex], allTabsIndex);
        // window on-resize event
        window.onresize = function (ev) {
        };
    }
};
