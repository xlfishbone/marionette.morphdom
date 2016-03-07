(function () {


//simple wrapper for native dom manipulation

    var $dom = function (node) {
        if (node) {
            this.node = node;
        }   
    };

    $dom.prototype.clone = function () {
        return new $dom(this.node.cloneNode(true));
    };

    $dom.prototype.append = function (child) {
        this.node.appendChild(child);
        return this.node;
    };

    $dom.prototype.before = function (newItem, prevItem) {
        this.node.insertBefore(newItem, prevItem);
        return this.node;
    };

    $dom.prototype.html = function (html) {
        if (html) {
            this.node.innerHTML = html;
            return this.node;
        }

        return this.node.innerHTML;
    };

  
    //Add MorphDom to Views

    //Composite View
    Backbone.Marionette.CompositeView.prototype.attachElContent = function (html) {
        //this.$el.html(html);

        var toNode = new $dom(this.el).clone(); 
        toNode.html(html);

        morphdom(this.el, toNode.node);
        delete toNode;
        return this;
    };

    Backbone.Marionette.CompositeView.prototype.attachBuffer = function (compositeView, buffer) {
        var $container = this.getChildViewContainer(compositeView);

        //var toNode = $container.clone().append(buffer);

        var toNode = new $dom($container[0]).clone(); 
        toNode.append(buffer);

        morphdom($container[0], toNode.node);
        delete toNode;
    };

    Backbone.Marionette.CompositeView.prototype._insertAfter = function (childView) {

        var $container = this.getChildViewContainer(this, childView);

        //var toNode = $container.clone().append(childView.el);

        var toNode = new $dom($container[0]).clone();
        toNode.append(childView.el);

        morphdom($container[0], toNode.node);
        delete toNode;
    };

    Backbone.Marionette.CompositeView.prototype._appendReorderedChildren = function (children) {
        var $container = this.getChildViewContainer(this);

        //var toNode = $container.clone().append(children);
        var toNode = new $dom($container[0]).clone();
        toNode.append(children);

        morphdom($container[0], toNode.node);
        delete toNode;
    };


    //Region
    Backbone.Marionette.Region.prototype.attachHtml = function (view) {
        this.$el.contents().detach();

        //var toNode = this.$el.clone().append(view.el);
        var toNode = new $dom(this.$el[0]).clone();
        toNode.append(view.el);

        morphdom(this.el, toNode.node);
        delete toNode;
    };


    //Item View
    Backbone.Marionette.ItemView.prototype.attachElContent = function (html) {
        var toNode = new $dom(this.el).clone(); //this.$el.clone();
        toNode.html(html);

        morphdom(this.el, toNode.node);
        delete toNode;
        return this;
    };


    //Collection View
    Backbone.Marionette.CollectionView.prototype._insertBefore = function (childView, index) {
        var currentView;
        var findPosition = this.getOption('sort') && (index < this.children.length - 1);
        if (findPosition) {
            // Find the view after this one
            currentView = this.children.find(function (view) {
                return view._index === index + 1;
            });
        }

        if (currentView) {
            //var toNode = currentView.$el.clone().before(childView.el);
            var toNode = new $dom(currentView.$el[0]).clone();
            toNode.before(childView.el);

            morphdom(currentView.el, toNode.node);

            delete toNode;
            return true;
        }

        return false;
    };

    Backbone.Marionette.CollectionView.prototype._insertAfter = function (childView) {
        //var toNode = this.$el.clone().append(childView.el);
        var toNode = new $dom(this.$el[0]).clone();
        toNode.append(childView.el);

        morphdom(this.el, toNode.node);
        delete toNode;
    };

    Backbone.Marionette.CollectionView.prototype._appendReorderedChildren = function (children) {
        //var toNode = this.$el.clone().append(children);
        var toNode = new $dom(this.$el[0]).clone();
        toNode.append(children);

        morphdom(this.el, toNode.node);
        delete toNode;
    };

    Backbone.Marionette.CollectionView.prototype.attachBuffer = function (collectionView, buffer) {
        //var toNode = collectionView.$el.clone().append(buffer);
        var toNode = new $dom(collectionView.$el[0]).clone();
        toNode.append(buffer);

        morphdom(collectionView.el, toNode.node);
        delete toNode;
    };

})();
