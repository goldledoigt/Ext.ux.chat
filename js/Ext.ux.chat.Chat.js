/*

Ext.override(Ext.layout.BorderLayout, { 
     southTitleAdded  : false, 
         // private 
     onLayout : function(ct, target){ 

         var collapsed; 
         if(!this.rendered){ 
              
             target.position(); 
             target.addClass('x-border-layout-ct'); 
             var items = ct.items.items; 
             collapsed = []; 
             for(var i = 0, len = items.length; i < len; i++) { 
                 var c = items[i]; 
                 var pos = c.region; 
                 if(c.collapsed){ 
                     collapsed.push(c); 
                 } 
                 c.collapsed = false; 
                 if(!c.rendered){ 
                     c.cls = c.cls ? c.cls +' x-border-panel' : 'x-border-panel'; 
                     c.render(target, i); 
                 } 
                 this[pos] = pos != 'center' && c.split ? 
                     new Ext.layout.BorderLayout.SplitRegion(this, c.initialConfig, pos) : 
                     new Ext.layout.BorderLayout.Region(this, c.initialConfig, pos); 
                 this[pos].render(target, c); 
             } 
             this.rendered = true; 
         } 
  
         var size = target.getViewSize(); 
         if(size.width < 20 || size.height < 20){ // display none? 
             if(collapsed){ 
                 this.restoreCollapsed = collapsed; 
             } 
             return; 
         }else if(this.restoreCollapsed){ 
             collapsed = this.restoreCollapsed; 
             delete this.restoreCollapsed; 
         } 
  
         var w = size.width, h = size.height; 
         var centerW = w, centerH = h, centerY = 0, centerX = 0; 
  
         var n = this.north, s = this.south, west = this.west, e = this.east, c = this.center;
         if(!c){ 
             throw 'No center region defined in BorderLayout ' + ct.id; 
         } 
  
         if(n && n.isVisible()){ 
             var b = n.getSize(); 
             var m = n.getMargins(); 
             b.width = w - (m.left+m.right); 
             b.x = m.left; 
             b.y = m.top; 
             centerY = b.height + b.y + m.bottom; 
             centerH -= centerY; 
             n.applyLayout(b); 
         } 
         if(s && s.isVisible()){ 
             var b = s.getSize(); 
             var m = s.getMargins(); 
             b.width = w - (m.left+m.right); 
             b.x = m.left; 
             var totalHeight = (b.height + m.top + m.bottom); 
             b.y = h - totalHeight + m.top; 
             centerH -= totalHeight; 
             s.applyLayout(b); 

             //TDGi custom title for south 
             //new config options for south region: 
             //  collapsedTitle        : 'string' 
             //  collapsedTitleCls    :  'string' 
             //  collapsedTitleStyle :  'string' 
             if (typeof s.collapsedEl != 'undefined' && s.collapsedTitle && this.southTitleAdded == false) { 
                 this.southTitleAdded = true; 
                 var cDiv = s.collapsedEl; 
                 var tpl  = new Ext.Template('<div style="float: left;">{txt}</div>'); 

                 var insertedHtml = tpl.insertFirst(cDiv,{ txt : s.collapsedTitle }); 
                 if (s.collapsedTitleStyle) { 
                     insertedHtml.applyStyles(s.collapsedTitleStyle); 
                 } 
                  
                 if (s.collapsedTitleCls) { 
                     Ext.get(insertedHtml).addClass(s.collapsedTitleCls); 
                 } 

             }                 
         } 
         if(west && west.isVisible()){ 
             var b = west.getSize(); 
             var m = west.getMargins(); 
             b.height = centerH - (m.top+m.bottom); 
             b.x = m.left; 
             b.y = centerY + m.top; 
             var totalWidth = (b.width + m.left + m.right); 
             centerX += totalWidth; 
             centerW -= totalWidth; 
             west.applyLayout(b); 
         } 
         if(e && e.isVisible()){ 
             var b = e.getSize(); 
             var m = e.getMargins(); 
             b.height = centerH - (m.top+m.bottom); 
             var totalWidth = (b.width + m.left + m.right); 
             b.x = w - totalWidth + m.left; 
             b.y = centerY + m.top; 
             centerW -= totalWidth; 
             e.applyLayout(b); 
         } 
  
         var m = c.getMargins(); 
         var centerBox = { 
             x: centerX + m.left, 
             y: centerY + m.top, 
             width: centerW - (m.left+m.right), 
             height: centerH - (m.top+m.bottom) 
         }; 
         c.applyLayout(centerBox); 
  
         if(collapsed){ 
             for(var i = 0, len = collapsed.length; i < len; i++){ 
                 collapsed[i].collapse(false); 
             } 
         } 
  
         if(Ext.isIE && Ext.isStrict){ // workaround IE strict repainting issue 
             target.repaint(); 
         } 
     } 
 });

*/

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
          ,title:"Communications"
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
                    ,emptyText:'Saisissez votre message puis cliquez sur envoyer'
                    ,margins:"0 5 0 0"
                }, {
                    region:"east"
                    ,xtype:"button"
                    ,text:"Envoyer"
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
        var msg = this.linkifyString( this.editor.getValue() );
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

