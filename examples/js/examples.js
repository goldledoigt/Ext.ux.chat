Ext.onReady(function() {

    var chat = new Ext.ux.chat.Chat({
        width:400
        ,height:400
        ,editorHeight:100
    });

    chat.on({
        message:function(chat, data) {
            console.log("message", this, arguments);
        }
    });

    chat.render(Ext.getBody());

});
