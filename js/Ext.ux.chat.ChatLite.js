Ext.ns("Ext.ux.chat");

Ext.ux.chat.ChatLite = function(config) {
    Ext.apply(this, config || {});
    Ext.ux.chat.ChatLite.superclass.constructor.call(this);
    this.addEvents("render", "message");
};



Ext.extend(Ext.ux.chat.ChatLite, Ext.util.Observable, {

    width:0

    ,height:0

    ,editorHeight:0
    ,webcamHeight:160
    ,editorInitialMessage:'Saisissez votre message puis cliquez sur envoyer'
    ,webcamTargetId:'chat-webcam-container'
    ,render:function(el) {

        var dh = Ext.DomHelper;

        this.webcamIntro = {
            tag:'img'
            ,id:this.webcamTargetId
            ,src:'/apps/whiteboard/static/img/webcamactivate.png'
            ,onclick:'chat.openWebcam();'
            ,style:'cursor:pointer'
        };

        console.log("WIDTH", this.width);
        
        var spec = {
            tag:"div"
            ,cls:"x-chat"
            ,style:{
                width:this.width.toString() + "px"
                ,height:this.height.toString() + "px"
            }
            ,children:[{
                  tag:"div"
                ,cls:"x-chat-webcam"
                ,id:'x-chat-webcampanel'
                ,style:{
                    overflow:"auto"
                    ,"margin-top":"4px"
                    ,height:this.webcamHeight.toString()  + 'px'
                    ,width:this.width.toString() + "px"
                    ,'text-align':'center'
                }
                ,children:[
                    this.webcamIntro
                ]
            },{
                tag:"div"
                ,cls:"x-chat-list"
                ,style:{
                    overflow:"auto"
//                    ,height:(this.height - this.editorHeight - this.webcamHeight - 20 ).toString() + "px"
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
                        "float":"left"
                        ,width:(this.width - 90).toString() + "px"
                        ,height:"100%"
                    }
                    ,children:[{
                        tag:"textarea"
                        ,onclick:"if (this.value == chat.editorInitialMessage) {this.value='';this.style.color='black'}"
                        ,onblur:"if (this.value == '') {console.log('blur');chat.clearEditor();}"
                        ,onKeyUp:"if ((event.keyCode || event.charCode) == 13 ) {chat.onButtonClick();};"
                        ,html:this.editorInitialMessage
                        ,style:{
                            width:'100%'
                            ,height:this.editorHeight - 1
                            ,color:'silver'
                        }
                        }]
                    },{
                        tag:"button"
                        ,html:"Envoyer"
                        ,cls:"x-chat-form-button"
                        ,style:{
                            "float":"left"
                            ,width:'70px'
                            ,height:this.editorHeight
                            //,"font-size":"16px"
                        }
                    }]
            }]
        };
        
        console.log("SPEC", spec.children[0].style.width);
        
	    this.el = Ext.get(dh.append(el, spec));

        this.list = Ext.get(this.getList());
        this.editor = Ext.get(this.getEditor());
        this.button = Ext.get(this.getButton());

        this.doLayout();
        this.setWebcamIntro();
        
        this.fireEvent("render", this);
    }
    ,openWebcam:function() {
        if (!this.webcam) {
            swfobject.embedSWF("/apps/whiteboard/static/js/StratusWidget2.swf?doStream=1&debug="+((document.location.search.substring(1).indexOf('DEBUG') > -1)?1:0)+"&r="+Math.random(), this.webcamTargetId, (this.width - 10) , this.webcamHeight, "10.0.0", '', {}, {}, {});
            this.webcam = Ext.get(this.webcamTargetId).dom;
            }
        else {
         
        }
    }
    ,webcamClosed:function() {
        this.setWebcamIntro();
        this.webcam = null;
    }
    ,setWebcamIntro:function() {
        var dh = Ext.DomHelper;
        var el = Ext.get('x-chat-webcampanel');
        dh.overwrite(el, this.webcamIntro);
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

    ,setHeight:function(height) {
        this.height = height;
        this.el.setHeight(height);
        this.list.setHeight(this.height - this.editorHeight - 15 - 4 - 4 - this.webcamHeight);
        this.list.dom.scrollTop = this.list.dom.scrollHeight;
    }

    ,clearEditor:function() {
        this.editor.dom.value = "";
        console.log("clearEditor", "*"+this.editor.dom.value+"*", this.editor.dom.value.length);
    }

    ,addMessage:function(o) {
        var striped = (o.from === "me") ? "striped" : "";
        Ext.DomHelper.append(this.list, {
            tag:"div"
            ,cls:"x-chat-msg-wrap "+striped
            ,children:[{
                tag:"div"
                ,cls:"x-chat-msg-header"
                ,html:o.from + ":"
            }, {
                tag:"div"
                ,cls:"x-chat-msg-body"
                ,html:o.msg
            }]
        });
        this.list.dom.scrollTop = this.list.dom.scrollHeight;
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

    ,onButtonClick:function() {
        var msg = this.editor.getValue();
        console.log("MESSAGE", msg, msg.length, msg.indexOf("\n"));
        if (msg !== '' && msg != this.editorInitialMessage && (msg.indexOf("\n") === -1 || msg.length > 1)) {
            this.addMessage({from:"me", msg:msg});
            this.fireEvent("message", this, {from:"me", msg:msg});
            this.clearEditor();
            this.editor.focus();
        }
    }

});
