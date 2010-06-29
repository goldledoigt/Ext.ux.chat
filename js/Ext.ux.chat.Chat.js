Ext.ns("Ext.ux.chat");

Ext.ux.chat.Chat = function(config) {

    Ext.apply(this, config || {});

    this.onButtonClick = function() {
        var msg = this.editor.getValue();
        this.addMessage({from:"me", msg:msg});
        this.fireEvent("message", this, {from:"me", msg:msg});
        this.clearEditor();
        this.editor.focus();
    };

    Ext.ux.chat.Chat.superclass.constructor.call(this);

    this.addEvents("render", "message");

};

Ext.extend(Ext.ux.chat.Chat, Ext.util.Observable, {

    width:0

    ,height:0

    ,editorHeight:0

    ,render:function(el) {

        var dh = Ext.DomHelper;

        var spec = {
            tag:"div"
            ,cls:"x-chat"
            ,style:{
                width:this.width.toString() + "px"
                ,height:this.height.toString() + "px"
            }
            ,children:[{
                tag:"div"
                ,cls:"x-chat-list"
                ,style:{
                    overflow:"auto"
                    ,height:(this.height - this.editorHeight - 15 - 4).toString() + "px"
                }
            }, {
                tag:"div"
                ,cls:"x-chat-form"
                ,style:{
                    height:this.editorHeight.toString() + "px"
                }
                ,children:[{
                    tag:"div"
                    ,cls:"x-chat-form-editor"
                    ,style:{
                        float:"left"
                        ,width:(this.width - 100 - 15 - 4).toString() + "px"
                        ,height:"100%"
                    }
                    ,children:[{
                        tag:"textarea"
                        ,style:{
                            width:"100%"
                            ,height:"99%"
                        }
                    }]
                }, {
                    tag:"button"
                    ,html:"Envoyer"
                    ,cls:"x-chat-form-button"
                    ,style:{
                        float:"left"
                        ,width:"100px"
                        ,height:"100%"
                        ,"font-size":"16px"
                    }
                }]
            }]
        };

        this.el = dh.append(el, spec);

        this.list = Ext.get(this.getList());
        this.editor = Ext.get(this.getEditor());
        this.button = Ext.get(this.getButton());

        this.doLayout();

        this.fireEvent("render", this);
    }

    ,doLayout:function() {
        var ctn = Ext.DomQuery.selectNode("div.x-chat-form-editor");
        var height = Ext.fly(ctn).getHeight();
        if (Ext.isChrome) height += Ext.fly(ctn).getBorderWidth("tb") + 3;
        this.button.setHeight(height);
        this.button.on({
            scope:this
            ,click:this.onButtonClick
        });
    }

    ,clearEditor:function() {
        this.editor.dom.value = "";
    }

    ,addMessage:function(o) {
        Ext.DomHelper.append(this.list, {
            tag:"div"
            ,cls:"x-chat-list-msg"
            ,html:o.from + ": " + o.msg
        });
    }

    ,getList:function() {
        return Ext.DomQuery.selectNode("div.x-chat-list");
    }

    ,getEditor:function() {
        return Ext.DomQuery.selectNode("div.x-chat-form-editor textarea");
    }

    ,getButton:function() {
        return Ext.DomQuery.selectNode("button.x-chat-form-button");
    }

});

if (Ext.Component) {

    Ext.extend(Ext.ux.chat.Chat, Ext.Panel, {

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
    });

}
