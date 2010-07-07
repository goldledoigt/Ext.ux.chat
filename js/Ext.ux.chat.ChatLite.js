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
        
        console.log(this.height, this.editorHeight , this.webcamHeight );
        
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
                ,style:{
                    overflow:"auto"
                    ,height:this.webcamHeight.toString()  + 'px'
                    ,width:this.width.toString() + "px"
                    ,'text-align':'center'
                }
                ,children:[
                    {
                        tag:'img'
                        ,id:this.webcamTargetId
                        ,src:'/apps/whiteboard/static/img/webcamactivate.png'
                        ,onclick:'chat.openWebcam();'
                        ,style:'cursor:pointer'
                    }
                ]
            
            },{
                tag:"div"
                ,cls:"x-chat-list"
                ,style:{
                    overflow:"auto"
                    ,height:(this.height - this.editorHeight - this.webcamHeight - 20 ).toString() + "px"
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
                        ,onblur:"if (this.value == '') {this.value=chat.editorInitialMessage;this.style.color='silver'}"
                        ,html:this.editorInitialMessage
                        ,style:{
                            width:'100%'
                            ,height:this.editorHeight
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
                            ,"font-size":"16px"
                        }
                    }]
            }]
        };
        
	    this.el = Ext.get(dh.append(el, spec));

        this.list = Ext.get(this.getList());
        this.editor = Ext.get(this.getEditor());
        this.button = Ext.get(this.getButton());

        this.doLayout();
        
        
        this.fireEvent("render", this);
    }
    ,openWebcam:function() {
        if (!this.webcam) {
            swfobject.embedSWF("/apps/whiteboard/static/js/StratusWidget2.swf?doStream=1&debug="+((window.location.search.substring(1).indexOf('DEBUG') > -1)?1:0)+"&r="+Math.random(), this.webcamTargetId, (this.width - 15) , this.webcamHeight, "10.0.0", '', {}, {}, {});
            this.webcam = Ext.get(this.webcamTargetId).dom;
            }
        else {
            this.webcam.remoteReady();
        }
        
  
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
      this.list.setHeight(this.height - this.editorHeight - 15 - 4 - this.webcamHeight );
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

    ,onButtonClick:function() {
        var msg = this.editor.getValue();
        this.addMessage({from:"me", msg:msg});
        this.fireEvent("message", this, {from:"me", msg:msg});
        this.clearEditor();
        this.editor.focus();
    }

});
