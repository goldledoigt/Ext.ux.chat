Ext.ns("Ext.ux.chat");

if (!Ext.Component) {

    Ext.ux.chat.Chat = function(config) {
        Ext.apply(this, config || {});
        Ext.ux.chat.Chat.superclass.constructor.call(this);
        this.addEvents("render", "message");

        this.on({
            render:function() {
                var button = this.getButtonEl();
                var ctn = Ext.DomQuery.selectNode("div.x-chat-form-editor");
                var height = Ext.fly(ctn).getHeight();
                if (Ext.isChrome) height += Ext.fly(ctn).getBorderWidth("tb") + 3;
                Ext.fly(button).setHeight(height);
                Ext.fly(button).on({
                    scope:this
                    ,click:this.onButtonClick
                });
            }
        });

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

            this.fireEvent("render", this);
        }

        ,onButtonClick:function() {
            var editor = this.getEditorEl();
            var msg = Ext.fly(editor).getValue();
            this.addMessage({from:"me", msg:msg});
            this.fireEvent("message", this, {from:"me", msg:msg});
            Ext.fly(editor).dom.value = "";
            Ext.fly(editor).focus();
        }

        ,addMessage:function(o) {
            var list = this.getListEl();
            Ext.DomHelper.append(Ext.fly(list), {
                tag:"div"
                ,cls:"x-chat-list-msg"
                ,html:o.from + ": " + o.msg
            });
        }

        ,getListEl:function() {
            return Ext.DomQuery.selectNode("div.x-chat-list");
        }

        ,getEditorEl:function() {
            return Ext.DomQuery.selectNode("div.x-chat-form-editor textarea");
        }

        ,getButtonEl:function() {
            return Ext.DomQuery.selectNode("button.x-chat-form-button");
        }

    });

} else {

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
                }, {
                    region:"south"
                    ,margins:"0 5 5 5"
                    ,layout:"border"
                    ,border:false
                    ,height:this.editorHeight
                    ,items:[{
                        region:"center"
                        ,xtype:"textarea"
                        ,ref:"../textarea"
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

            this.addEvents("message");

            Ext.ux.chat.Chat.superclass.initComponent.call(this);

        }

        ,onButtonClick:function() {
            var msg = this.textarea.getValue();
            this.addMessage({from:"me", msg:msg});
            this.fireEvent("message", this, {from:"me", msg:msg});
            this.textarea.reset();
            this.textarea.focus();
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