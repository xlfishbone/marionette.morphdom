//marionette.morphdom
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'Marionette ', 'morphdom'], function (_, Marionette, morphdom) {
            return factory(_, Marionette, morphdom);
        });
    }
    else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var morphdom = require('morphdom');
        var Marionette = require('Marionette');
        module.exports = factory(_, Marionette, morphdom);
    }
    else {
        factory(root._, root.Marionette, root.morphdom);
    }
}(this, function (_, Marionette, morphdom) {
    'use strict';

    //simple wrapper for native dom manipulation
    var $dom = (function () {

        function _dom(node) {
            if (node) {
                this.node = node.cloneNode(true);
                return this;
            }
            else {
                throw ("No node found. Node = " + node);
            }

        };

        var _removeClass = function (el, remove) {
            var newClassName = "";
            var i;
            var classes = el.className.split(" ");
            for (i = 0; i < classes.length; i++) {
                if (classes[i] !== remove) {
                    newClassName += classes[i] + " ";
                }
            }
            el.className = newClassName;
        };

        _dom.prototype.append = function (child) {
            this.node.appendChild(child);
            return this.node;
        };

        _dom.prototype.before = function (newItem, classToFind) {
            //find the prev item node and remote the marker class
            var prevItem = this.node.getElementsByClassName(classToFind)[0];
            _removeClass(prevItem, classToFind);

            this.node.insertBefore(newItem, prevItem);                     
            return this.node;
        };

        _dom.prototype.html = function (html) {
            if (html) {
                this.node.innerHTML = html;
                return this.node;
            }

            return this.node.innerHTML;
        };

        

        return _dom;
    })();


    //Add MorphDom to Views

    //Composite View
    Marionette.CompositeView.prototype.attachElContent = function (html) {
        var toNode = new $dom(this.el).html(html);

        morphdom(this.el, toNode);
        return this;
    };

    Marionette.CompositeView.prototype.attachBuffer = function (compositeView, buffer) {
        var $container = this.getChildViewContainer(compositeView);
        var toNode = new $dom($container[0]).append(buffer);

        morphdom($container[0], toNode);
    };

    Marionette.CompositeView.prototype._insertAfter = function (childView) {
        var $container = this.getChildViewContainer(this, childView);
        var toNode = new $dom($container[0]).append(childView.el);

        morphdom($container[0], toNode);
    };

    Marionette.CompositeView.prototype._appendReorderedChildren = function (children) {
        var $container = this.getChildViewContainer(this);
        var toNode = new $dom($container[0]).append(children);

        morphdom($container[0], toNode);
    };


    //Region
    Marionette.Region.prototype.attachHtml = function (view) {
        this.$el.contents().detach();
        var toNode = new $dom(this.$el[0]).append(view.el);

        morphdom(this.el, toNode);
    };


    //Item View
    Marionette.ItemView.prototype.attachElContent = function (html) {
        var toNode = new $dom(this.el).html(html);

        morphdom(this.el, toNode);
        return this;
    };


    //Collection View
    Marionette.CollectionView.prototype._insertBefore = function (childView, index) {
        var currentView;
        var findPosition = this.getOption('sort') && (index < this.children.length - 1);
        if (findPosition) {
            // Find the view after this one
            currentView = this.children.find(function (view) {
                return view._index === index + 1;
            });
        }

        if (currentView) {
            //add a class so we can find the current view after its been cloned. 
            var uniqueClass = "_mdToClone" + Date.now();
            currentView.$el.addClass(uniqueClass);

            //clone the parent after our class marker was added
            var parent = currentView.el.parentNode;
            var toNode = new $dom(currentView.el.parentNode).before(childView.el, uniqueClass);
            
            //clean up our class marker
            currentView.$el.removeClass(uniqueClass);

            morphdom(parent, toNode);
            return true;
        }
        return false;
    };

    Marionette.CollectionView.prototype._insertAfter = function (childView) {
        var toNode = new $dom(this.$el[0]).append(childView.el);
        morphdom(this.el, toNode);
    };

    Marionette.CollectionView.prototype._appendReorderedChildren = function (children) {
        var toNode = new $dom(this.$el[0]).append(children);
        morphdom(this.el, toNode);
    };

    Marionette.CollectionView.prototype.attachBuffer = function (collectionView, buffer) {
        var toNode = new $dom(collectionView.$el[0]).append(buffer);
        morphdom(collectionView.el, toNode);
    };

}));
