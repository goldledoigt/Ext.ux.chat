Ext.ns("Ext.ux.chat");

Ext.ux.chat.Chat = Ext.extend(Ext.Panel, {

    width:0

    ,height:0

    ,editorHeight:0

    ,webcamCollapsed:false

    ,webcamCollapsible:false

    ,initComponent:function() {

      this.msgTpl = new Ext.Template(
        '<div class="x-chat-msg-wrap">'
        ,'<div class="x-chat-msg-header">{from}:<span class="x-chat-msg-time">{time}</span></div>'
        ,'<div class="x-chat-msg-body">{msg}</div>'
        ,'</div>'
        ,{compiled:true}
      );

      Ext.apply(this, {
            layout:"border"
            /*
            ,title:"Communications"
            ,tools:[{
                id:"minimize"
                ,scope:this
                ,handler:function(e, toolEl) {
                    var panel = this.camPanel.toggleCollapse(false);
                    console.log("tool", toolEl, panel.collapsed);
                    if (panel.collapsed) toolEl.setStyle("background-position", "0 -30px");
                    else toolEl.setStyle("background-position", "0 -15px");
                    this.doLayout();
                }
            }]
            */
            ,items:[{
	      region:"north"
	      ,ref:"camPanel"
          ,title:gettext("Communications")
	      ,height:205
	      ,floatable:false
          ,collapsible:this.webcamCollapsible
          ,collapsed:this.webcamCollapsed
          ,collapsedTitle:"Communications"
	      ,cls:"x-chat-campanel"
	      ,cmargins:"5 5 0 5"
	      ,bodyStyle:"border-width:0 0 1 0"
	      ,listeners:{
		scope:this
		,afterrender:function(panel) {
		  //console.log("afterrender", this, arguments, this.body.id);
		  panel.body.on({scope:this, click:this.onCamPanelClick});
		}
		,collapse:function() {
		    if (!this.camPanel.hasBeenCollapsed) {
		        var el = this.getEl().child(".x-layout-collapsed-north");
		        el.insertHtml("afterBegin", '<div class="x-chat-collapsed-title">Communications</div>');
		        this.camPanel.hasBeenCollapsed = true;
	        }
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
                    ,enableKeyEvents :true
                    ,cls:"chat-textarea"
                    ,emptyText:gettext('Saisissez votre message puis cliquez sur envoyer')
                    ,margins:"0 5 0 0"
                }, {
                    region:"east"
                    ,xtype:"button"
                    ,text:gettext("Envoyer")
                    ,width:50
                    ,scope:this
                    ,handler:this.onButtonClick
                }]
            }]
        });

        this.addEvents("send", "recieve", "openWebcam");

        Ext.ux.chat.Chat.superclass.initComponent.call(this);

        this.editor.on('keydown', function(textarea, event) {
            //console.log('keydown', event.charCode, event.keyCode );
            if ( event.charCode == 13 ||  event.keyCode == 13) {
                this.onButtonClick();
            }
        }, this);

    }

    ,clearEditor:function() {
        this.editor.reset();
    }

    ,addMessage:function(data) {
        var style = (data.from=='me')? "background-color:#EFEFEF" : "";
        if (!data.time) {
            now = new Date();
            minutes = now.getMinutes();
            if (minutes < 10)  minutes = "0" + minutes;
            data.time = now.getHours() + ':' + minutes;
        }
        this.list.add({
            border:false
            //,padding:"2 5"
            ,cls:"x-chat-msg"
            ,bodyStyle:style
            ,html:this.msgTpl.apply(data)
        });
        this.list.doLayout();
        this.fireEvent("recieve", this, data);
        // scroll down
        this.list.body.dom.scrollTop = this.list.body.dom.scrollHeight;
    }

    ,onButtonClick:function() {
        var msg = this.editor.getValue();
        if (msg.replace(/\s/g, '') == '') {
            this.editor.setValue('');
            return false;
        }
        var msg = this.linkifyString( msg );
        var now = new Date();
        minutes = now.getMinutes();
        if (minutes < 10)  minutes = "0" + minutes;
        var ntime = now.getHours() + ':' + minutes;
        var msgdata = {
            from:"me",
            msg:msg,
            time:ntime
        }

        this.addMessage( msgdata );
        this.fireEvent("send", this, msgdata );
        this.clearEditor();
        this.editor.focus();
    }

    ,onCamPanelClick:function() {
      if (!this.flash) {
        this.flash = new Ext.FlashComponent({
          url:"/apps/whiteboard/static/js/StratusWidget2.swf"
          ,backgroundColor:"#FFFFFF"
          //,flashVersion:"10.0.0"
          ,flashVars:{
            mode:"master"
            ,useVideo:1
            ,doStream:1
            ,debug:(document.location.search.substring(1).indexOf('DEBUG') > -1)?1:0
    //	    ,height:200
    //	    ,width:300
            ,r:Math.random()
          }
        });

        this.camPanel.add(this.flash);
        this.camPanel.doLayout();
        this.fireEvent("openWebcam", this);
        this.webcam = this.flash.el.dom;
        //console.log("click", this.flash);
      }
    }
    ,webcamClosed:function() {
        this.setWebcamIntro();
        this.webcam = null;
    }
    ,setWebcamIntro:function() {
        this.flash.destroy();
        this.flash = null;
    }
    ,linkifyString:function( inString ) {
        var re = new RegExp("(https?://[^\f\n\r\t\v ]+)", "gi");
        var linkified = inString.replace(re,'<a href="$1" target="_blank" >$1</a>' );
        return linkified;
    }
});

Ext.reg("chat", Ext.ux.chat.Chat);

