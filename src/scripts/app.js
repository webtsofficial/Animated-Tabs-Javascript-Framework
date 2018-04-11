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
        this.screenWidth = window.innerWidth; // screen width
        // fill existing parameters with external parameter help
        this.linksElement = this.findUniqueTabChildrenWithClass('webts-tab-links');
        this.contentsElement = this.findUniqueTabChildrenWithClass('webts-tab-contents');
        this.linksChildren = this.linksElement.children;
        this.contentsChildren = this.contentsElement.children;
        // check if count tabs = count contents
        if (this.linksElement.children.length !== this.contentsElement.children.length) {
            console.warn('Das Tab-Element mit dem Index ' + index + ' hat nicht genauso viele tabs wie Content-Boxen!');
        }
        else {
            // init styling methods
            this.linkBarWidth = this.getTabContentWidth();
            this.updateTabSwapper();
            this.setContentWidth();
            this.setContentInitLeftPos();
            // tab swapper
            this.updateTabSwapper();
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
            return new Element();
        }
        else {
            console.warn('Es gibt mehrere Elemente mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
            return new Element();
        }
    };
    Tabs.prototype.getTabContentWidth = function () {
        if (this.linksElement instanceof Element) {
            return this.tabsElement.clientWidth;
        }
        else {
            console.warn('linksElement is not of type Element!');
            return 0;
        }
    };
    Tabs.prototype.setContentWidth = function () {
        var contentsChilds = this.contentsChildren;
        // set total content width
        this.contentsElement.setAttribute('style', 'width: ' + (this.tabsElement.clientWidth * contentsChilds.length) + 'px');
        if (contentsChilds instanceof HTMLCollection) {
            for (var i = 0; i < contentsChilds.length; i++) {
                var contentElem = contentsChilds[i];
                contentElem.setAttribute('style', 'width:' + this.tabsElement.clientWidth + 'px');
            }
        }
        else {
            console.warn('contentsElement.children ist keine HTML-Collection');
        }
    };
    Tabs.prototype.setContentInitLeftPos = function () {
        var contentsChildren = this.contentsChildren;
        this.contentInitLeftPos = [];
        for (var i = 0; i < contentsChildren.length; i++) {
            var contentElem = contentsChildren[i], contentLeft = contentElem.getClientRects()[0].left;
            this.contentInitLeftPos.push(contentLeft);
        }
    };
    Tabs.prototype.createInkBarElement = function () {
        var elem = document.createElement('div');
        elem.classList.add('webts-ink-bar');
        if (this.linksElement.parentNode instanceof HTMLElement) {
            this.linksElement.parentNode.insertBefore(elem, this.linksElement.nextSibling);
        }
        else {
            console.warn('Das Eltern Element zum erstellen der InkBar ist kein HTML Element!');
        }
    };
    // todo
    Tabs.prototype.updateInkBarInitPos = function () {
    };
    Tabs.prototype.moveInkBarToTab = function (index) {
        var tabLink = this.linksChildren[index], tabLinkWidth = tabLink.clientWidth, tabPosition = tabLink.getClientRects(), inkBarElem = this.inkBar, inkBarWidth = inkBarElem.clientWidth, baseLeftDistance = this.linksElement.children[0].getClientRects()[0].left;
        if (tabLinkWidth !== this.inkBarWidth) {
            // width scaling and translateX inkBar while transition
            inkBarElem.style.transform = 'translateX(' + (tabPosition[0].left - baseLeftDistance) + 'px) scaleX(' + (tabLinkWidth / inkBarWidth) + ')';
        }
        else {
            // only translateX must be applied
            inkBarElem.style.transform = 'translateX(' + (tabPosition[0].left - baseLeftDistance) + 'px)';
        }
    };
    Tabs.prototype.slideContentToActiveTab = function (index) {
        var contentElem = this.contentsChildren[index], contents = this.contentsElement, contentElemLeft = contentElem.getClientRects()[0].left, contentsLeft = contents.getClientRects()[0].left;
        contents.style.transform = 'translateX(-' + this.contentInitLeftPos[index] + 'px)';
    };
    // todo: set tab elem width and center position
    Tabs.prototype.setTabElemWidth = function (width) {
    };
    Tabs.prototype.setTabActive = function (index) {
        var tabs = this.linksChildren, contents = this.contentsChildren;
        this.moveInkBarToTab(index);
        this.slideContentToActiveTab(index);
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
    Tabs.prototype.updateTabLinksTotalWidth = function () {
        var tabsTotalWidth = 0;
        for (var i = 0; i < this.linksChildren.length; i++) {
            tabsTotalWidth += this.linksChildren[i].clientWidth;
        }
        this.linksTotalWidth = tabsTotalWidth;
    };
    Tabs.prototype.updateTabSwapper = function () {
        // insert id tabs total width bigger than 260px - not 320px because  30px for each side swapper
        // todo if else statement for checling if swapper exist + check if parent exist
        if (this.linksElement.parentElement instanceof HTMLElement) {
            var maxWidth = this.linksElement.parentElement.clientWidth - 60;
            if (this.linksTotalWidth > maxWidth) {
                // insert swapper if not existing
                if (!this.checkIfSwapperExist()) {
                    // set tabBar width for swapper
                    this.setTabElemWidth(maxWidth);
                    // insert swapper
                    // create elems
                    var swapperLeftElem = document.createElement('div'), swapperRightElem = document.createElement('div'), tabsElemClientRect = this.tabsElement.getClientRects()[0];
                    // add classes
                    swapperLeftElem.classList.add('webts-swapper');
                    swapperRightElem.classList.add('webts-swapper');
                    swapperLeftElem.classList.add('webts-swapper-left');
                    swapperRightElem.classList.add('webts-swapper-right');
                    // add styles
                    swapperLeftElem.style.left = tabsElemClientRect.left + 'px';
                    swapperLeftElem.style.top = tabsElemClientRect.top + 'px';
                    swapperRightElem.style.right = tabsElemClientRect.right + 'px';
                    swapperRightElem.style.top = tabsElemClientRect.top + 'px';
                    // add text
                    swapperLeftElem.innerText = '<';
                    swapperRightElem.innerText = '>';
                    // insert after tab-contents
                    this.tabsElement.appendChild(swapperLeftElem);
                    this.tabsElement.appendChild(swapperRightElem);
                }
            }
            else {
                // if exist delete swapper
                if (this.checkIfSwapperExist()) {
                }
            }
        }
        else {
            console.warn('Parent Element for maxWidth in SwapperPos calculation not HTML Element!');
        }
    };
    Tabs.prototype.checkIfSwapperExist = function () {
        if (1 === 1) {
            return false; // todo: make true and fill if stmt
        }
        return false;
    };
    Tabs.prototype.swapLeft = function () {
        // updateInkBarPosition()
    };
    Tabs.prototype.swapRight = function () {
        // updateInkBarPosition()
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
            _this.screenWidth = window.innerWidth; // update screen width
            _this.getTabContentWidth();
            _this.setContentWidth();
            _this.updateTabSwapper();
            _this.setTabActive(0);
            _this.setContentInitLeftPos();
        });
    };
    return Tabs;
}());
// Onload
window.onload = function () {
    var allTabs = [];
    for (var allTabsIndex = 0; allTabsIndex < allTabsArray.length; allTabsIndex++) {
        var tabLinkBar = allTabLinksArray[allTabsIndex], tabContentBox = allTabContentsArray[allTabsIndex], tab = new Tabs(allTabsArray[allTabsIndex], allTabsIndex);
        allTabs.push(tab);
    }
};
