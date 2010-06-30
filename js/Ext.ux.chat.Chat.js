Ext.ns("Ext.ux.chat");


Ext.ux.chat.Chat = Ext.extend(Ext.Panel, {

    width:0

    ,height:0

    ,editorHeight:0

    ,initComponent:function() {
        Ext.apply(this, {
            layout:"border"
            ,items:[{
                region:"center"
                ,ref:"list"
                ,margins:"5"
                ,autoScroll:true
            }, {
                region:"south"
                ,margins:"0 5 5 5"
                ,layout:"border"
                ,border:false
                ,height:this.editorHeight
                ,items:[{
                    region:"center"
                    ,xtype:"textarea"
                    ,ref:"../editor"
                    ,border:false
                    ,margins:"0 5 0 0"
                }, {
                    region:"east"
                    ,xtype:"button"
                    ,text:"Envoyer"
                    ,width:100
                    ,scope:this
                    ,handler:this.onButtonClick
                }]
            }]
        });

        Ext.ux.chat.Chat.superclass.initComponent.call(this);

    }

    ,clearEditor:function() {
        this.editor.reset();
    }

    ,addMessage:function(o) {
        this.list.add({
            border:false
            ,padding:"2 5"
            ,html:o.from + ": " + o.msg
        });
        this.list.doLayout();
    }

    ,onButtonClick:function() {
        var msg = this.editor.getValue();
        this.addMessage({from:"me", msg:msg});
        this.fireEvent("message", this, {from:"me", msg:msg});
        this.clearEditor();
        this.editor.focus();
    }

});

Ext.reg("chat", Ext.ux.chat.Chat);

