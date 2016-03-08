# marionette.morphdom

##Purpose
I was looking for ways to speed up a view I had that was essentially a very large grid that needed to be shown without paging  :worried:. I found a library called [Morphdom](http://github.com/patrick-steele-idem/morphdom) and it has seemed to helped performance a bit. 

##Findings
in ms:

MorphDom | Normal | % Diff
---------|--------|--------
1990 | 3822 | 48%
1924 | 3504 | 44%
2106 | 3634 | 47%
2090 | 3476 | 45%
2360 | 3690 | 49%


I did notice that in smaller views the difference was negligible if there was any at all. But on more complex views it was noticeable. 

##Dependencies
* [Marionette](https://github.com/marionettejs/backbone.marionette)
  * ``` npm install backbone.marionette --save ```
* [Morphdom](http://github.com/patrick-steele-idem/morphdom) 
  * ```   npm install morphdom --save ```
	 

##TODO
Add to NPM and bower

##License
MIT
