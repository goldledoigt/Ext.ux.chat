Ext.onReady(function() {

    var chat = new Ext.ux.chat.ChatLite({
        width:400
        ,height:400
        ,editorHeight:100
    });

    chat.on({message:console.log});

    chat.render(Ext.getBody());

});
