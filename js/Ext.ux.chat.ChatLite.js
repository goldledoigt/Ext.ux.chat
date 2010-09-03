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

        var spec = {
            tag:"div"
            ,cls:"x-chat"
            ,style:{
                width:this.width.toString() + "px"
                ,height:this.height.toString() + "px"
            }
            ,children:[{
                tag:"div"
                ,cls:"x-chat-title"
                ,style:{
                    height:"25px"
                }
                ,children:[{
                    tag:"div"
                    ,cls:"x-chat-title-wrapper"
                    ,html:"Communications"
                }, {
                    tag:"div"
                    ,cls:"x-chat-tool"
                    ,onclick:"chat.toggleWebcamCollapse()"
                }]
            }, {
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
                        ,width:(this.width - 75).toString() + "px"
                        ,height:"100%"
                    }
                    ,children:[{
                        tag:"textarea"
                        ,onclick:"if (this.value == chat.editorInitialMessage) {this.value='';this.style.color='black'}"
                        ,onblur:"if (this.value == '') {chat.clearEditor();}"
                        ,onKeyDown:"if (this.value == chat.editorInitialMessage) {this.value='';this.style.color='black';}"
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
                            ,"font-size":"12px"
                            ,width:'58px'
                            ,height:this.editorHeight
                            //,"font-size":"16px"
                        }
                    }]
            }]
        };

        //console.log("SPEC", spec.children[0].style.width);

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
        var webcamHeight = (this.webcamCollapsed) ? 0 : this.webcamHeight
        this.list.setHeight(this.height - this.editorHeight - 15 - 4 - 4 - 25 - webcamHeight);
        this.list.dom.scrollTop = this.list.dom.scrollHeight;
    }

    ,clearEditor:function() {
        this.editor.dom.value = chat.editorInitialMessage;
        this.editor.dom.style.color='silver';
        //"if (this.value == chat.editorInitialMessage) {this.value='';this.style.color='black'}"
        //console.log("clearEditor", "*"+this.editor.dom.value+"*", this.editor.dom.value.length);
    }

    ,addMessage:function(o) {
        var striped = (o.from === "me") ? "striped" : "";

        Ext.DomHelper.append(this.list, {
            tag:"div"
            ,cls:"x-chat-msg-wrap "+striped
            ,children:[{
                tag:"div"
                ,cls:"x-chat-msg-header"
                //,html:o.from + ":"
                ,children:[o.from + ":",
                ,{
                     tag:'span'
                     ,cls:'x-chat-msg-time'
                     ,html:o.time
                }]
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
        var msg = this.linkifyString( this.editor.getValue() );
        //console.log("MESSAGE", msg, msg.length, msg.indexOf("\n"));
        if (msg !== '' && msg != this.editorInitialMessage && (msg.indexOf("\n") === -1 || msg.length > 1)) {
            var now = new Date();
            var ntime = now.getHours() + ':' + now.getMinutes()
            var msgdata = {
                from:"me", 
                msg:msg, 
                time:ntime
            }
            this.addMessage( msgdata );
            this.fireEvent("message", this, msgdata );
            this.clearEditor();
            this.editor.focus();
        }
    }
    ,linkifyString:function( inString ) {
        var re = new RegExp("(https?://[^\f\n\r\t\v ]+)", "gi");
        var linkified = inString.replace(re,'<a href="$1" target="_blank" >$1</a>' );
        return linkified;
    }
    
    ,toggleWebcamCollapse:function() {
        var tool = Ext.DomQuery.selectNode("div.x-chat-tool");
        var webcam = Ext.DomQuery.selectNode("div.x-chat-webcam");
        if (!chat.webcamCollapsed) {
            Ext.get(webcam).setStyle("display", "none");
            Ext.fly(tool).setStyle("background-position", "0 -30px");
            chat.webcamCollapsed = true;
        } else {
            Ext.get(webcam).setStyle("display", "block");
            Ext.fly(tool).setStyle("background-position", "0 -15px");
            chat.webcamCollapsed = false;
        }
        var height = (Ext.isIE)?document.body.clientHeight - 20:window.innerHeight;
        chat.setHeight(height- 0.5);
        console.log("click");
    }

});
