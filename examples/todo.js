$(function(){
  
  //构造基本的数据模型及对数据的处理  
  var Todo = Backbone.Model.extend({

    defaults: function(){
      return{
        title: "empty todo...",
        order: Todos.nextOrder(),
        done: false
      };
    },

    //变化元素的可见隐藏情况
    toggle: function(){
      this.save({done: !this.get("done")});
    }

  });

  var TodoList = Backbone.Collection.extend({

    model: Todo,

    //把所有的todo item存放在todos-backbone中
    localStorage: new Backbone.LocalStorage("todos-backbone");

    done: function(){
      return this.where({done: true});
    },

    remaining: function(){
      return this.where({done: false});
    },

    nextOrder: function(){
      if(!this.length) return 1;
      return this.last().get('order') + 1;
    },

    comparator: 'order'

  });

  var Todos = new TodoList;

  var TodoView = Backbone.View.extend({

    tagName: "li",

    template: _.template($("item-template").html()),

    events: {
      "click .toggle" : "toggleDone",
      "dbclick .view" : "edit",
      "click a.destroy" : "clear",
      "keypress .edit" : "updateOnEnter",
      "blur .edit" : "close"
    },  

    initialize: function(){
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },  

  })
})