// all Tab Elements
const allTabsArray = <HTMLCollection>document.getElementsByClassName('webts-tabs'),                  // all webts-tab Elements
    allTabLinksArray = <HTMLCollection>document.getElementsByClassName('webts-tab-links'),         // all webts-tab-link Elements
    allTabContentsArray = <HTMLCollection>document.getElementsByClassName('webts-tab-contents');   //all webts-content Elements

// Tabs constructor function
class Tabs {
    index: number;
    tabsElement: Element;
    linksElement: Element;
    contentsElement: Element;
    contentInitLeftPos: any;
    linkBarWidth: number;
    inkBar: Element;
    inkBarWidth: number;

    constructor(tabsElement: Element, index: number) {
        // import parameters
        this.index = index;
        this.tabsElement = tabsElement;
        // fill existing parameters with external parameter help
        this.linksElement = this.findUniqueTabChildrenWithClass('webts-tab-links');
        this.contentsElement = this.findUniqueTabChildrenWithClass('webts-tab-contents');

        // check if count tabs = count contents
        if(this.linksElement.children.length !== this.contentsElement.children.length) {
            console.warn('Das Tab-Element mit dem Index ' + index + ' hat nicht genauso viele tabs wie Content-Boxen!');
        } else {
            // init styling methods
            this.linkBarWidth = this.getTabContentWidth();
            this.setContentWidth();
            this.setContentInitLeftPos();
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

    findUniqueTabChildrenWithClass(className: string) {
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
        } else {
            console.warn('Es gibt mehrere Elemente mit der Klasse ' + className + ' innerhalb der webts-Tab-Box');
        }

    }
    getTabContentWidth() : number {
        if(this.linksElement instanceof Element) {
            return this.linksElement.getBoundingClientRect().width;
        } else {
            console.warn('linksElement is not of type Element!');
            return 0;
        }
    }
    setContentWidth() : void {
        let contentsChilds = <HTMLCollection>this.contentsElement.children;

        // set total content width
        this.contentsElement.setAttribute('style', 'width: ' + (this.linkBarWidth * contentsChilds.length) + 'px');

        if(contentsChilds instanceof HTMLCollection) {
            for(let i = 0; i < contentsChilds.length; i++) {
                let contentElem = contentsChilds[i];
                contentElem.setAttribute('style', 'width:' + this.linkBarWidth + 'px');
            }
        } else {
            console.warn('contentsElement.children ist keine HTML-Collection');
        }
    }
    setContentInitLeftPos() {
        let contentsChildren = this.contentsElement.children;
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
        this.linksElement.parentNode.insertBefore(elem, this.linksElement.nextSibling);
    }
    moveInkBarToTab(index: number) : void {
        let tabLink = <HTMLElement>this.linksElement.children[index],
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
        let contentElem = <HTMLElement>this.contentsElement.children[index],
            contents = <HTMLElement>this.contentsElement,
            contentElemLeft = contentElem.getClientRects()[0].left,
            contentsLeft = contents.getClientRects()[0].left;
        contents.style.transform = 'translateX(-'+ this.contentInitLeftPos[index] +'px)';
    }
    setTabActive(index: number) : void {
        let tabs = <HTMLCollection>this.linksElement.children,
            contents = <HTMLCollection>this.contentsElement.children;

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
            this.getTabContentWidth();
            this.setContentWidth();
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