// all Tab Elements
const allTabsArray = <HTMLCollection>document.getElementsByClassName('webts-tabs'),                // all webts-tab Elements
    allTabLinksArray = <HTMLCollection>document.getElementsByClassName('webts-tab-links'),         // all webts-tab-link Elements
    allTabContentsArray = <HTMLCollection>document.getElementsByClassName('webts-tab-contents');   //all webts-content Elements

// Tabs constructor function
class Tabs {
    // external / import parameters
    index: number;
    tabsElement: Element;
    // internal parameters
    // screen
    screenWidth: number;
    // link bar
    linksElement: Element;
    linksChildren: HTMLCollection;
    linksTotalWidth: number;
    linkBarInitPos: ClientRect;
    linkBarFirstChildLeft: number;
    linkBarLastChildRight: number;
    // content
    contentsElement: Element;
    contentsChildren: HTMLCollection;
    contentInitLeftPos: any;
    // inkBar
    contentWidth: number;
    inkBar: HTMLElement;
    inkBarWidth: number;
    // swapper
    swapperLeftElem:  HTMLElement;
    swapperRightElem: HTMLElement;

    constructor(tabsElement: Element, index: number) {
        // import parameters
        this.index = index;
        this.tabsElement = tabsElement;
        this.screenWidth = window.innerWidth; // screen width
        // fill existing parameters with external parameter help
        this.linksElement = this.findUniqueTabChildrenWithClass('webts-tab-links');
        this.contentsElement = this.findUniqueTabChildrenWithClass('webts-tab-contents');
        this.linksChildren = this.linksElement.children;
        this.contentsChildren = this.contentsElement.children;
        if(this.linksElement.firstElementChild && this.linksElement.lastElementChild) {
            this.linkBarFirstChildLeft = this.linksElement.firstElementChild.clientLeft;
            this.linkBarLastChildRight = this.linksElement.lastElementChild.getClientRects()[0].right;
        } else {
            console.warn('LinkBarFirstChild-Element und LinkBarLastChild-Element sind nicht definiert');
        }

        // check if count tabs = count contents
        if(this.linksElement.children.length !== this.contentsElement.children.length) {
            console.warn('Das Tab-Element mit dem Index ' + index + ' hat nicht genauso viele tabs wie Content-Boxen!');
        } else {
            // init styling methods
            this.updateTabLinksTotalWidth();
            this.setContentWidth();
            this.setContentInitLeftPos();
            this.linkBarInitPos = this.linksElement.getClientRects()[0];
            // tab swapper
            this.updateTabSwapper();
            // add ink bar
            this.createInkBarElement();
            this.inkBar = <HTMLElement>tabsElement.children[1];
            this.inkBarWidth = this.inkBar.clientWidth;
            // set init Tab active
            this.setTabActive(0);
            // Event Listener definition
            this.addTabClickEventListener();
            this.addWindowResizeEventListener();
        }
    }

    // general
    getActiveTabIndex() : number {
        for(let i = 0; i < this.linksChildren.length; i++) {
            let link = this.linksChildren[i];
            if(link.classList.contains('active')) {
                return i;
            }
        }
        return NaN;
    }
    getTransformValues(elem: HTMLElement) : number {
        if(elem.style.transform) {
            return parseFloat(elem.style.transform.split(/[()]/)[1]);
        }
        return 0;
    }
    // tabs-elem
    findUniqueTabChildrenWithClass(className: string) : HTMLElement {
        let elements = [],
            tabElemChildren = <HTMLCollection>this.tabsElement.children;

        for(let tabElemChildrenCount = 0; tabElemChildrenCount < tabElemChildren.length; tabElemChildrenCount++) {
            let tabElemChild = <HTMLElement>tabElemChildren[tabElemChildrenCount];
            if(tabElemChild.classList.contains(className)) {
                elements.push(tabElemChild);
            }
        }
        if(elements.length === 1) {
            return elements[0];
        } else if(elements.length < 1) {
            console.warn('Es gibt kein Element mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
            return new HTMLElement();
        } else {
            console.warn('Es gibt mehrere Elemente mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
            return new HTMLElement();
        }

    }
    // links
    setTabActive(index: number) : void {
        let tabs = <HTMLCollection>this.linksChildren,
            contents = <HTMLCollection>this.contentsChildren;

        this.moveInkBarToTab(index);
        this.slideContentToActiveTab(index);
        for(let i = 0; i < tabs.length; i++) {
            let actualTab = <HTMLElement>tabs[i],
                actualContent = <HTMLElement>contents[i];
            if(i !== index) {
                // remove class active if present
                if(actualTab.classList.contains('active')) {
                    actualTab.classList.remove('active')
                }
                if(actualContent.classList.contains('active')) {
                    actualContent.classList.remove('active');
                }
            } else {
                // add class active if not already present
                if(!actualTab.classList.contains('active')) {
                    actualTab.classList.add('active');
                }
                if(!actualContent.classList.contains('active')) {
                    actualContent.classList.add('active');
                }
            }
        }
    }
    updateTabLinksTotalWidth() : void {
        let tabsTotalWidth = 0;

        for(let i = 0; i < this.linksChildren.length; i++) {
            tabsTotalWidth += this.linksChildren[i].clientWidth;
        }
        this.linksTotalWidth = tabsTotalWidth;
    }
    // content
    getTabContentWidth() : number {
        if(this.linksElement instanceof Element) {
            return this.tabsElement.clientWidth;
        } else {
            console.warn('linksElement is not of type Element!');
            return 0;
        }
    }
    setContentWidth() : void {
        let contentsChilds = <HTMLCollection>this.contentsChildren;
        // set total content width
        this.contentsElement.setAttribute('style', 'width: ' + (this.tabsElement.clientWidth * contentsChilds.length) + 'px');

        if(contentsChilds instanceof HTMLCollection) {
            for(let i = 0; i < contentsChilds.length; i++) {
                let contentElem = contentsChilds[i];
                contentElem.setAttribute('style', 'width:' + this.tabsElement.clientWidth + 'px');
            }
        } else {
            console.warn('contentsElement.children ist keine HTML-Collection');
        }
    }
    setContentInitLeftPos() {
        let contentsChildren = this.contentsChildren;
        this.contentInitLeftPos = [];

        for(let i = 0; i < contentsChildren.length; i++) {
            let contentElem = <HTMLElement>contentsChildren[i],
                contentLeft = <number>contentElem.getClientRects()[0].left;
            this.contentInitLeftPos.push(contentLeft);
        }
    }
    slideContentToActiveTab(index: number) {
        let contentElem = <HTMLElement>this.contentsChildren[index],
            contents = <HTMLElement>this.contentsElement,
            contentElemLeft = contentElem.getClientRects()[0].left,
            contentsLeft = contents.getClientRects()[0].left;
        console.log(this.contentInitLeftPos[index]);
        contents.style.transform = 'translateX(-'+ this.contentInitLeftPos[index] +'px)';
    }
    // inkBar
    createInkBarElement() : void {
        let elem = <HTMLElement>document.createElement('div');
        elem.classList.add('webts-ink-bar');
        if(this.linksElement.parentNode instanceof HTMLElement) {
            this.linksElement.parentNode.insertBefore(elem, this.linksElement.nextSibling);
        } else {
            console.warn('Das Eltern Element zum erstellen der InkBar ist kein HTML Element!');
        }
    }
    moveInkBarToTab(index: number) : void {
        let tabLink = <HTMLElement>this.linksChildren[index],
            tabLinkWidth = <number>tabLink.clientWidth,
            tabPosition = tabLink.getClientRects()[0],
            inkBarElem = <HTMLElement>this.inkBar,
            inkBarWidth = inkBarElem.clientWidth,
            baseLeftDistance = this.linksElement.children[0].getClientRects()[0].left;
        if(tabLinkWidth !== this.inkBarWidth) {
            // width scaling and translateX inkBar while transition
            inkBarElem.style.transform = 'translateX(' + (tabPosition.left) +'px) scaleX('+ (tabLinkWidth / inkBarWidth) +')';
        } else {
            // only translateX must be applied
            inkBarElem.style.transform = 'translateX(' + (tabPosition.left) +'px)';
        }
    }
    // swapper
    updateTabSwapper() : void {
        // insert id tabs total width bigger than 260px - not 320px because  30px for each side swapper
        // todo if else statement for checling if swapper exist + check if parent exist
        if(this.linksElement.parentElement instanceof HTMLElement) {
            let maxWidth = this.linksElement.parentElement.clientWidth - 60,
                linksElem = <HTMLElement>this.linksElement;
            if(this.linksTotalWidth > maxWidth) {
                // insert swapper if not existing
                if(!this.checkIfSwapperExist()) {
                    // insert swapper
                    // create elems
                    let swapperLeftElem  =  <HTMLElement>document.createElement('div'),
                        swapperRightElem =  <HTMLElement>document.createElement('div'),
                        tabsElemClientRect = this.tabsElement.getClientRects()[0];
                    // add classes
                    swapperLeftElem.classList.add('webts-swapper');
                    swapperRightElem.classList.add('webts-swapper');
                    swapperLeftElem.classList.add('webts-swapper-left');
                    swapperRightElem.classList.add('webts-swapper-right');
                    // add styles
                    swapperLeftElem.style.left   = tabsElemClientRect.left + 'px';
                    swapperLeftElem.style.top    = tabsElemClientRect.top + 'px';
                    swapperRightElem.style.right = tabsElemClientRect.left + 'px';
                    swapperRightElem.style.top   = tabsElemClientRect.top + 'px';
                    // add text
                    swapperLeftElem.innerText = '<';
                    swapperRightElem.innerText = '>';
                    // add padding to tabLinkBar
                    linksElem.style.paddingLeft = '30px';
                    // insert after tab-contents
                    this.tabsElement.appendChild(swapperLeftElem);
                    this.tabsElement.appendChild(swapperRightElem);
                    // append elem to class param
                    this.swapperLeftElem = this.findUniqueTabChildrenWithClass('webts-swapper-left');
                    this.swapperRightElem = this.findUniqueTabChildrenWithClass('webts-swapper-right');
                    // add event Listener
                    this.addSwapperClickEventListener();
                    // add padding
                    let paddingVert = (tabsElemClientRect.height - this.swapperLeftElem.clientHeight) / 4.6,
                        paddingHor  = (30 - this.swapperLeftElem.clientWidth) / 2;
                    this.swapperLeftElem.style.padding = paddingVert + 'px ' + paddingHor + 'px';
                    this.swapperRightElem.style.padding = paddingVert + 'px ' + paddingHor + 'px';
                }
            } else {
                // if exist delete swapper and delete params
                if(this.checkIfSwapperExist()) {
                    // remove tab bar padding left
                    linksElem.style.paddingLeft = '0px';
                    this.tabsElement.removeChild(this.swapperLeftElem);
                    this.tabsElement.removeChild(this.swapperRightElem);
                }
            }
        } else {
            console.warn('Parent Element for maxWidth in SwapperPos calculation not HTML Element!');
        }
    }
    checkIfSwapperExist() : boolean {
        if(this.tabsElement.getElementsByClassName('webts-swapper-left')[0] instanceof HTMLElement &&
           this.tabsElement.getElementsByClassName('webts-swapper-right')[0] instanceof HTMLElement) {
            return true;
        }
        return false;
    }
    swapLeft() : void {
        let linkBar = <HTMLElement>this.linksElement,
            linkBarFirstChild = <HTMLElement>this.linksElement.firstElementChild,
            linkBarFirstChildPos = linkBarFirstChild.getClientRects()[0],
            actualTranslateX = <number>this.getTransformValues(<HTMLElement>this.linksElement),
            leftDistanceLeft = <number>this.linkBarFirstChildLeft - this.linkBarInitPos.left,
            realThis = this;

        console.log(leftDistanceLeft);

        if(leftDistanceLeft <= -100) {
            // set translate 30px
            this.linkBarFirstChildLeft += 100;
            this.linkBarLastChildRight += 100;
            linkBar.style.transform = 'translateX('+ (actualTranslateX + 100) +'px)';
            // todo: make timeout time dynamic for transition timee
            setTimeout(function () {
                realThis.setTabActive(realThis.getActiveTabIndex())
            }, 600);
        } else if(leftDistanceLeft <= 0) {
            // translate rest of 30px
            this.linkBarFirstChildLeft -= leftDistanceLeft;
            this.linkBarLastChildRight -= leftDistanceLeft;
            linkBar.style.transform = 'translateX(' + (actualTranslateX - leftDistanceLeft) + 'px)';
            // todo: make timeout time dynamic for transition timee
            setTimeout(function () {
                realThis.setTabActive(realThis.getActiveTabIndex())
            }, 600);
        } else {
            // don't do anything
        }
    }
    swapRight() : void {
        // updateInkBarPosition() - get active tab and set it active - same as left with firstchild and right translate
        let linkBar = <HTMLElement>this.linksElement,
            linkBarLastChild = <HTMLElement>this.linksElement.lastElementChild,
            linkBarLastChildPos = linkBarLastChild.getClientRects()[0],
            actualTranslateX = <number>this.getTransformValues(<HTMLElement>this.linksElement),
            rightDistanceLeft = <number>(this.linkBarLastChildRight + 60) - this.linkBarInitPos.right,
            realThis = this;

        if(rightDistanceLeft >= 100) {
            // translate 30px
            this.linkBarFirstChildLeft -= 100;
            this.linkBarLastChildRight -= 100;
            linkBar.style.transform = 'translateX('+ (actualTranslateX - 100) +'px)';
            // todo: make timeout time dynamic for transition timee
            setTimeout(function () {
                realThis.setTabActive(realThis.getActiveTabIndex())
            }, 600);
        } else if(rightDistanceLeft > 0) {
            // translate rest of 30px
            this.linkBarFirstChildLeft -= rightDistanceLeft;
            this.linkBarLastChildRight -= rightDistanceLeft;
            linkBar.style.transform = 'translateX('+ (actualTranslateX - rightDistanceLeft) +'px)';
            // todo: make timeout time dynamic for transition timee
            setTimeout(function () {
                realThis.setTabActive(realThis.getActiveTabIndex())
            }, 600);
        } else {
            // don't do anything
        }
    }
    resetSwipe() : void {
        let linkBar = <HTMLElement>this.linksElement;
        linkBar.style.transform = 'translateX(0px)';
    }
    // Event Listener Creation
    addTabClickEventListener() : void {
        let linksChildren = <HTMLCollection>this.linksElement.children;

        // addd event listener to every element
        for(let i = 0; i < linksChildren.length; i++) {
            linksChildren[i].addEventListener('click', () => {
                this.setTabActive(i);
            });
        }
    }
    addSwapperClickEventListener() : void {
        this.swapperLeftElem.addEventListener('click', () => {
           this.swapLeft();
        });
        this.swapperRightElem.addEventListener('click', () => {
           this.swapRight();
        });
    }
    addWindowResizeEventListener() : void {
        let realThis = this;
        window.addEventListener('resize', () => {
            this.screenWidth = window.innerWidth; // update screen width
            this.getTabContentWidth();
            this.setContentWidth();
            this.updateTabSwapper();
            this.resetSwipe();
            this.linkBarInitPos = this.linksElement.getClientRects()[0];
            this.setContentInitLeftPos();
            // todo: make timeout time dynamic for transition timee
            setTimeout(function () {
                realThis.setTabActive(0)
            }, 600);
        });
    }

}

// Onload
window.onload = function () {
    let allTabs = [];
    for (let allTabsIndex:number = 0; allTabsIndex < allTabsArray.length; allTabsIndex++) {
        let tabLinkBar = allTabLinksArray[allTabsIndex],
            tabContentBox = allTabContentsArray[allTabsIndex],
            tab = new Tabs(allTabsArray[allTabsIndex], allTabsIndex);
        allTabs.push(tab);
    }
};