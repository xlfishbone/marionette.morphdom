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

        _dom.prototype.append = function (child) {
            this.node.appendChild(child);
            return this.node;
        };

        _dom.prototype.before = function (newItem, prevItem) {
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
            var toNode = new $dom(currentView.$el[0]).before(childView.el);

            morphdom(currentView.el, toNode);
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
