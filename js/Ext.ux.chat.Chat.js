Ext.ns("Ext.ux.chat");


Ext.ux.chat.Chat = Ext.extend(Ext.Panel, {

    width:0

    ,height:0

    ,editorHeight:0

    ,initComponent:function() {
        Ext.apply(this, {
            layout:"border"
            ,items:[{
	      region:"north"
	      ,ref:"camPanel"
	      ,height:200
	      ,collapsible:true
	      ,collapsed:true
	      ,cls:"x-chat-campanel"
	      ,cmargins:"5 5 0 5"
	      ,bodyStyle:"border-width:0 0 1 0"
	      ,listeners:{
		scope:this
		,afterrender:function() {
		  console.log("afterrender", this, arguments, this.body.id);
		  this.body.on({scope:this, click:this.onCamPanelClick});
		}
	      }
	    }, {
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

	this.addEvents("send", "recieve");

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
      this.fireEvent("recieve", this, o);
    }

    ,onButtonClick:function() {
        var msg = this.editor.getValue();
        this.addMessage({from:"me", msg:msg});
        this.fireEvent("send", this, {from:"me", msg:msg});
        this.clearEditor();
        this.editor.focus();
    }

    ,onCamPanelClick:function() {
      if (!this.flash) {
	this.flash = new Ext.FlashComponent({
	  url:"/apps/whiteboard/static/js/StratusWidget.swf"
	  ,backgroundColor:"#FFFFFF"
	  //,flashVersion:"10.0.0"
	  ,flashVars:{
	    mode:"master"
	    ,useVideo:1
	    ,doStream:1
	    ,debug:1
//	    ,height:200
//	    ,width:300
	    ,r:Math.random()
	  }
	});
	this.camPanel.add(this.flash);
	this.camPanel.doLayout();
	console.log("click", this.flash);
      }
    }

});

Ext.reg("chat", Ext.ux.chat.Chat);

