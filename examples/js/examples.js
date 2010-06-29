Ext.onReady(function() {

    var chat = new Ext.ux.chat.Chat({
        width:400
        ,height:400
        ,editorHeight:100
    });

    chat.render(Ext.getBody());

});
