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
    screenWidth: number;
    linksElement: Element;
    linksChildren: HTMLCollection;
    linksTotalWidth: number;
    contentsElement: Element;
    contentsChildren: HTMLCollection;
    contentInitLeftPos: any;
    linkBarWidth: number;
    contentWidth: number;
    inkBar: Element;
    inkBarWidth: number;
    swapperLeftElem:  HTMLElement | null;
    swapperRightElem: HTMLElement | null;

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

        // check if count tabs = count contents
        if(this.linksElement.children.length !== this.contentsElement.children.length) {
            console.warn('Das Tab-Element mit dem Index ' + index + ' hat nicht genauso viele tabs wie Content-Boxen!');
        } else {
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

    findUniqueTabChildrenWithClass(className: string) : Element {
        let elements = [],
            tabElemChildren = <HTMLCollection>this.tabsElement.children;

        for(let tabElemChildrenCount = 0; tabElemChildrenCount < tabElemChildren.length; tabElemChildrenCount++) {
            let tabElemChild = tabElemChildren[tabElemChildrenCount];
            if(tabElemChild.classList.contains(className)) {
                elements.push(tabElemChild);
            }
        }
        if(elements.length === 1) {
            return elements[0];
        } else if(elements.length < 1) {
            console.warn('Es gibt kein Element mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
            return new Element();
        } else {
            console.warn('Es gibt mehrere Elemente mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
            return new Element();
        }

    }
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
    createInkBarElement() : void {
        let elem = <Element>document.createElement('div');
        elem.classList.add('webts-ink-bar');
        if(this.linksElement.parentNode instanceof HTMLElement) {
            this.linksElement.parentNode.insertBefore(elem, this.linksElement.nextSibling);
        } else {
            console.warn('Das Eltern Element zum erstellen der InkBar ist kein HTML Element!');
        }
    }
    // todo
    updateInkBarInitPos() : void {

    }
    moveInkBarToTab(index: number) : void {
        let tabLink = <HTMLElement>this.linksChildren[index],
            tabLinkWidth = <number>tabLink.clientWidth,
            tabPosition = tabLink.getClientRects(),
            inkBarElem = <HTMLElement>this.inkBar,
            inkBarWidth = inkBarElem.clientWidth,
            baseLeftDistance = this.linksElement.children[0].getClientRects()[0].left;
        if(tabLinkWidth !== this.inkBarWidth) {
            // width scaling and translateX inkBar while transition
            inkBarElem.style.transform = 'translateX(' + (tabPosition[0].left - baseLeftDistance) +'px) scaleX('+ (tabLinkWidth / inkBarWidth) +')';
        } else {
            // only translateX must be applied
            inkBarElem.style.transform = 'translateX(' + (tabPosition[0].left - baseLeftDistance) +'px)';
        }
    }
    slideContentToActiveTab(index: number) {
        let contentElem = <HTMLElement>this.contentsChildren[index],
            contents = <HTMLElement>this.contentsElement,
            contentElemLeft = contentElem.getClientRects()[0].left,
            contentsLeft = contents.getClientRects()[0].left;
        contents.style.transform = 'translateX(-'+ this.contentInitLeftPos[index] +'px)';
    }
    // todo: set tab elem width and center position
    setTabElemWidth(width: number) : void {

    }
    setTabActive(index: number) : void {
        let tabs = <HTMLCollection>this.linksChildren,
            contents = <HTMLCollection>this.contentsChildren;

        this.moveInkBarToTab(index);
        this.slideContentToActiveTab(index);
        for(let i = 0; i < tabs.length; i++) {
            let actualTab = <Element>tabs[i],
                actualContent = <Element>contents[i];
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
    updateTabSwapper() : void {
        // insert id tabs total width bigger than 260px - not 320px because  30px for each side swapper
        // todo if else statement for checling if swapper exist + check if parent exist
        if(this.linksElement.parentElement instanceof HTMLElement) {
            let maxWidth = this.linksElement.parentElement.clientWidth - 60;
            if(this.linksTotalWidth > maxWidth) {
                // insert swapper if not existing
                if(!this.checkIfSwapperExist()) {
                    // set tabBar width for swapper
                    this.setTabElemWidth(maxWidth);
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
                    swapperRightElem.style.right = tabsElemClientRect.right + 'px';
                    swapperRightElem.style.top   = tabsElemClientRect.top + 'px';
                    // add text
                    swapperLeftElem.innerText = '<';
                    swapperRightElem.innerText = '>';
                    // insert after tab-contents
                    this.tabsElement.appendChild(swapperLeftElem);
                    this.tabsElement.appendChild(swapperRightElem);
                }
            } else {
                // if exist delete swapper
                if(this.checkIfSwapperExist()) {

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
        // updateInkBarPosition()
    }
    swapRight() : void {
        // updateInkBarPosition()
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
    addWindowResizeEventListener() : void {
        window.addEventListener('resize', () => {
            this.screenWidth = window.innerWidth; // update screen width
            this.getTabContentWidth();
            this.setContentWidth();
            this.updateTabSwapper();
            this.setTabActive(0);
            this.setContentInitLeftPos();
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