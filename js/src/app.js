var App = App || {};

var TodoModel = Backbone.Model.extend({
    defaults: {
        title: "",
        completed: false,
    },
});

var TodoView = Backbone.View.extend({
    tagName: "li",
    template: _.template($("#todo-template").html()),
    preinitialize: function ({ model }) {
        this.listenTo(model, "destroy", this.remove);
        this.listenTo(model, "change:completed", this.render);
    },
    events: {
        "change input": "markAsDone",
        "click button": "deleteTodo",
    },
    markAsDone: function () {
        this.model.set("completed", !this.model.get("completed"));
    },
    deleteTodo: function () {
        this.model.destroy();
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
});

var TodoList = Backbone.Collection.extend({
    model: TodoModel,
});

const todos = new TodoList();

var AddTodoView = Backbone.View.extend({
    tagName: "li",
    template: _.template($("#add-template").html()),
    events: {
        "click button": "addTodo",
        "keyup #new-todo": "validateButton",
    },
    preinitialize({ todos }) {
        this.todos = todos;
    },
    addTodo: function () {
        var title = this.$("input").val();
        this.todos.add({ title });
    },
    validateButton: function () {
        var title = this.$("input").val();
        var addBtn = this.$("button");
        if (title.trim().length > 0) {
            addBtn.removeAttr("disabled");
        } else {
            addBtn.attr("disabled", "true");
        }
    },
    render: function () {
        this.$el.html(this.template());
        return this;
    },
});

App.AppView = Backbone.View.extend({
    el: "ul",
    preinitialize: function ({ list, txt }) {
        var that = this;
        this.listenTo(list, "add", that.addTodo);
    },
    addTodo: function (todo) {
        debugger;
        var that = this;
        var todoView = new TodoView({ model: todo });
        that.$el.append(todoView.render().$el);
    },
    render: function () {
        var that = this;
        var addView = new AddTodoView({ todos: todos });
        Backbone.View.prototype.render.call(that);
        this.$el.append(addView.render().$el);

        return that;
    },
});

var app = new App.AppView({ list: todos });
app.render();
