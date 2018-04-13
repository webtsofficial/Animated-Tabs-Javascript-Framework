#webts-animated-tabs v1.0.0
##Installation
###npm
```
npm install webts-animated-tabs --save
```
> Till now webts-animated-tabs can only be installed via npm - more coming soon
###HTML
```html
<head>
    <link rel="stylesheet" type="text/css" href="node_modules/webts-animated-tabs/src/styles/css/main.css">
</head>
<body>

    <script type="text/javascript" src="node_modules/webts-animated-tabs/src/scripts/app.js"></script>
</body>
```
##Usage
As soon as you have mported all the scripts you are ready to strat. Only add the CSS classes in the following way to achieve incredible tabs.
```html
<div class="webts-tabs">
    <nav class="webts-tab-links">
        <div>Tab 1</div>
        <div>Tab 2</div>
        <div>Tab 3</div>
        <div>Tab 4</div>
    </nav>
        <div class="webts-tab-contents">
        <div>Content 1</div>
        <div>Content 2</div>
        <div>Content 3</div>
        <div>Content 4</div>
    </div>
</div>
```

##Customization
You can customize the tabs via the scss variables inside the src/styles/scss/main.scss file. Whatch out to make this in the node modules folder, because when updating packages the changes get overwritten.
```scss
$color-tab-bg:          #fff;
$color-tab-active-bg:   #f1f1f1;
$color-tab-hover-bg:    #f9f9f9;
$color-ink-bar:         #ff696d;
$color-swapper-bg:      rgba(220,220,220,0.75);
$color-swapper-hover-bg:rgba(220,220,220,0.3);
$color-swapper-text:    #333;

$transition-time-slow:    1s;
$transition-time-medium:  0.7s;
$transition-time-fast:    0.3s;
```
>I'm working on making the customization via javascript and a options parameter in for the Tab-Class

