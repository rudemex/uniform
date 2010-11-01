/*

Uniform v2.0 PRE
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.4 or newer

Much thanks to Thomas Reynolds and Buck Wilson for their help and advice on this

Disabling text selection is made possible by Mathias Bynens <http://mathiasbynens.be/>
and his noSelect plugin. <http://github.com/mathiasbynens/noSelect-jQuery-Plugin>

Also, thanks to David Kaneda and Eugene Bond for their contributions to the plugin

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

Enjoy!

*/

/*!
 * jQuery UI Widget 1.8.5
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
if(!$.hasOwnProperty("Widget")){
  (function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
  a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.substring(0,1)===
  "_")return h;e?this.each(function(){var g=b.data(this,a);if(!g)throw"cannot call methods on "+a+" prior to initialization; attempted to call method '"+d+"'";if(!b.isFunction(g[d]))throw"no such method '"+d+"' for "+a+" widget instance";var i=g[d].apply(g,f);if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",
  widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,b.metadata&&b.metadata.get(c)[this.widgetName],a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._init()},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+
  "-disabled ui-state-disabled")},widget:function(){return this.element},option:function(a,c){var d=a,e=this;if(arguments.length===0)return b.extend({},e.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}b.each(d,function(f,h){e._setOption(f,h)});return e},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},enable:function(){return this._setOption("disabled",
  false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
  ;
}

/* UNIFORM BE HERE */

(function($, undefined){
  $.support.selectOpacity = (!$.browser.msie || $.browser.version > 6);
  
  //Public helper methods
  $.uniform = function(){
    var self = this,
        uniform = {},
        instances = [];
    
    uniform.update = function(){
      $.each(instances, function(){
        this.update();
      });
    };
    
    uniform.push = function(obj){
      instances.push(obj);
    };
    
    uniform.clear = function(){
      instances = [];
    };
    
    uniform.remove = function(obj){
      $.each(instances, function(i){
        if(this === obj){
          instances.splice(i, 1);
        }
      });
    };
    
    uniform.restore = function(){
      $.each(instances, function(){
        this.destroy();
      });
      uniform.clear();
    };
    
    return uniform;
  }();
  
  // Proxy function
  $.fn.uniform = function() {
    var params = Array.prototype.slice.call(arguments);
    
    var detectElementType = function(el){
      var $el     = $(el),
          tagName = el.tagName,
          result  = false;
      
      if ((tagName === "SELECT") && ($el.attr("multiple") !== true) && ($el.attr("size") === undefined || ($el.attr("size") <= 1))) {
        result = "uniformSelect";
      } else if (tagName === "INPUT") {
        var type = el.type;
        if (type === "text" || type === "password" || type === "email") {
          result = "uniformInput";
        } else if (type === "submit" || type === "reset" || type === "button") {
          result = "uniformButton";
        } else {
          result = "uniform" + type.charAt(0).toUpperCase() + type.slice(1);
        }
      } else if (tagName === "TEXTAREA") {
        result = "uniformTextarea";
      }else if (tagName === "A" || tagName === "BUTTON") {
        result = "uniformButton";
      }
      
      return result;
    };
    
    return $(this).each(function() {
      var $el  = $(this),
          type = detectElementType(this);
      if(type && $.isFunction($.fn[type])){
        $el[type].apply($el, params);
      }
    });
  };
  
  var uniformBase = function() {};
  uniformBase.prototype = $.extend(true, new $.Widget(), {
    options: {
      selectClass:     'selector',
      radioClass:      'radio',
      checkboxClass:   'checker',
      fileClass:       'uploader',
      filenameClass:   'filename',
      fileBtnClass:    'action',
      fileDefaultText: 'No file selected',
      fileBtnText:     'Choose File',
      checkedClass:    'checked',
      focusClass:      'focus',
      disabledClass:   'disabled',
      buttonClass:     'button',
      activeClass:     'active',
      hoverClass:      'hover',
      useID:            true,
      idPrefix:         'uniform',
      autoHide:         true,
      autoWidth:        true
    },
    
    _setID: function(){
      if(this.options.useID === true && this.element.attr("id") !== ""){
        this.divTag.attr("id", this.options.idPrefix + "-" + this.element.attr("id"));
      }
    },
    
    _disableTextSelection: function(el){
      var f = function() {
       return false;
      };
      $(el).each(function() {
       this.onselectstart = this.ondragstart = f; // Webkit & IE
       $(this).mousedown(f) // Webkit & Opera
        .css({ MozUserSelect: 'none' }); // Firefox
      });
    },
    
    destroy: function(){
      this.element.unbind(".uniform").css("opacity", "1");
      $.uniform.remove(this);
      $.Widget.prototype.destroy.call(this);
    },
    
    _setOption: function(key, value){
      $.Widget.prototype._setOption.apply(this, arguments);
      this.update();
    }
  });
  
  var wrappedBase = function() {};
  wrappedBase.prototype = $.extend(true, new uniformBase(), {
    _init: function(){     
      this.element.wrap("<div>").before("<span>");
      this.spanTag = this.element.prev("span");
      this.divTag  = this.element.closest("div");
      this.element.css("opacity", 0);
      this._setID(this.element);
      $.uniform.push(this);
      this.update();
    },
    
    update: function(){  
      var self = this;    
      this.divTag.removeClass();
      this.element.unbind(".uniform");
      
      if(this.element.is(":disabled")) {
        this.divTag.addClass(this.options.disabledClass);
      }
      
      this.divTag.bind({
        "mouseenter.uniform": function(){
          self.divTag.addClass(self.options.hoverClass);
        },
        "mouseleave.uniform": function(){
          self.divTag.removeClass(self.options.hoverClass).removeClass(this.options.activeClass);
        },
        "mousedown.uniform touchbegin.uniform": function(){
          self.divTag.addClass(self.options.activeClass);
        },
        "mouseup.uniform touchend.uniform": function(){
          self.divTag.removeClass(self.options.activeClass);
        }
      });
      
      this.element.bind({
        "focus.uniform": function(){
          self.divTag.addClass(self.options.focusClass);
        },
        "blur.uniform": function(){
          self.divTag.removeClass(self.options.focusClass);
        }
      });
    }
  });
  
  var radioCheckBase = function() {};
  radioCheckBase.prototype = $.extend(true, new wrappedBase(), {
    _init: function(){
      this.element.wrap("<div>").wrap("<span>");
      this.spanTag = this.element.closest("span");
      this.divTag  = this.element.closest("div");
      this.element.css("opacity", 0);
      this._setID(this.element);
      $.uniform.push(this);
      this.update();
    },
    
    update: function(){
      wrappedBase.prototype.update.call(this);
      var self = this;
      this.spanTag.removeClass();
      //reset default checked class
      if(this.element.attr("checked")) {
        this.spanTag.addClass(this.options.checkedClass);
      }
      
      this.element.bind("check", function(){
        self.element[0].checked = true;
        self.update();
      });
      
      this.element.bind("uncheck", function(){
        self.element[0].checked = false;
        self.update();
      });
    },
    
    destroy: function(){
      this.element.unwrap().unwrap();
      wrappedBase.prototype.destroy.call(this);
    }
  });
  
  $.widget("uniform.uniformTextarea", uniformBase, {
    _init: function(){
      this.element.addClass("uniform");
    }
  });
  
  $.widget("uniform.uniformInput", uniformBase, {
    _init: function(){
      this.element.addClass(this.element.attr("type"));
    }
  });
  
  $.widget("uniform.uniformButton", wrappedBase, {
    _init: function(){
      wrappedBase.prototype._init.call(this);
      this._disableTextSelection(this.divTag);
    },
    
    update: function(){
      wrappedBase.prototype.update.call(this);
      var btnText = "", 
          tagName = this.element.tagName;
    
      this.divTag.addClass(this.options.buttonClass);
    
      if(tagName == "A" || tagName == "BUTTON"){
        btnText = this.element.text();
      }else if(tagName == "INPUT"){
        btnText = this.element.attr("value");
      }
      
      btnText = (btnText === "") ? (this.element[0].type === "reset") ? "Reset" : "Submit" : btnText;
      this.spanTag.html(btnText);
    
      this.divTag.bind({
        "click.uniform touchend.uniform": function(e){
          if($(e.target).is("span") || $(e.target).is("div")){    
            if(self.element[0].dispatchEvent){
              var ev = document.createEvent('MouseEvents');
              ev.initEvent( 'click', true, true );
              self.element[0].dispatchEvent(ev);
            }else{
              self.element[0].click();
            }
          }
        }
      });
    },
    
    destroy: function(){
      this.element.siblings("span").remove();
      this.element.unwrap();
      wrappedBase.prototype.destroy.call(this);
    }
  });
  
  $.widget("uniform.uniformSelect", wrappedBase, {
    _init: function(){
      wrappedBase.prototype._init.call(this);
      this._disableTextSelection(this.spanTag);
    },
    
    update: function(){
      wrappedBase.prototype.update.call(this);
      var self = this,
          width = this.element.width(),
          selected = this.element.find(":selected:first");
      
      this.divTag.addClass(this.options.selectClass);
          
      if(this.options.autoWidth === true) {
        this.divTag.css("width", width + 20);
      }
      
      if(selected.length === 0) {
        selected = this.element.find("option:first");
      }
      
      this.spanTag.html(selected.html());
      
      this.element.bind({
        "change.uniform": function() {
          self.spanTag.html(self.element.find(":selected").html());
          self.divTag.removeClass(self.options.activeClass);
        },
        "click.uniform touchend.uniform": function(){
          self.divTag.removeClass(self.options.activeClass);
        },
        "keyup.uniform": function(){
          self.spanTag.text(self.element.find(":selected").html());
        }
      });
    },
    
    destroy: function(){
      this.element.siblings("span").remove();
      this.element.unwrap();
      wrappedBase.prototype.destroy.call(this);
    }
  });
  
  $.widget("uniform.uniformCheckbox", radioCheckBase, {
    update: function(){
      var self = this;
      radioCheckBase.prototype.update.call(this); //Call update from radioCheckBase
      
      this.divTag.addClass(this.options.checkboxClass);
      
      this.element.bind({
        "click.uniform touchend.uniform": function(){
          if(!self.element.attr("checked")){
            self.spanTag.removeClass(self.options.checkedClass);
          }else{
            self.spanTag.addClass(self.options.checkedClass);
          }
        }
      });
    }
  });
  
  $.widget("uniform.uniformRadio", radioCheckBase, {
    update: function(){
      var self = this;
      
      $("."+this.options.checkedClass).removeClass(this.options.checkedClass); //remove the checked class from anything that's checked
      
      radioCheckBase.prototype.update.call(this); //Call update from radioCheckBase
      
      this.divTag.addClass(this.options.radioClass);
      
      this.element.bind({
        "click.uniform touchend.uniform": function(){
          if(!self.element.attr("checked")){
            self.spanTag.removeClass(self.options.checkedClass);
          }else{
            var classes = self.options.radioClass.split(" ")[0]; //find only the first class in case multiple were given
            $("input[name="+self.element.attr("name")+"]").closest("span").removeClass(self.options.checkedClass);
            self.spanTag.addClass(self.options.checkedClass);
          }
        }
      });
    }
  });
  
  $.widget("uniform.uniformFile", uniformBase, {
    _init: function(){
      var btnTag = $('<span>'+this.options.fileBtnText+'</span>'), 
          filenameTag = $('<span>'+this.options.fileDefaultText+'</span>');
      
      this.element.wrap("<div>").after(btnTag).after(filenameTag); //wrap it!
      
      this.divTag = this.element.closest("div"); //redefine vars
      this.filenameTag = this.element.next();
      this.btnTag = this.filenameTag.next();
      
      if(!this.element.css("display") === "none" && this.options.autoHide){
        this.divTag.hide();
      }
      
      this.element.css("opacity", 0); //set opacity to 0, .hide() would make it's events in-accessible
      this._disableTextSelection(this.filenameTag);
      this._disableTextSelection(this.btnTag);
      this._setID(this.element);
      $.uniform.push(this);
      this.update();
    },
    
    update: function(){
      var self = this;
      
      var setFilename = function(){
        var filename = self.element.val();
        if (!filename){
          filename = self.options.fileDefaultText;
        }else{
          filename = filename.split(/[\/\\]+/);
          filename = filename[(filename.length-1)];
        }
        self.filenameTag.text(filename);
      };
      
      this.element.unbind(".uniform"); //remove previously bound events
      //reset all classes
      this.divTag.removeClass().addClass(this.options.fileClass); 
      this.filenameTag.removeClass().addClass(this.options.filenameClass);
      this.btnTag.removeClass().addClass(this.options.fileBtnClass);
      
      if(!this.element.attr("size")){
        var divWidth = this.divTag.width();
        this.element.attr("size", this.divWidth/10);
      }

      setFilename();

      // IE7 doesn't fire onChange until blur or second fire.
      if ($.browser.msie){
        // IE considers browser chrome blocking I/O, so it suspends timemouts until after the file has been selected
        this.element.bind('click.uniform.ie7', function() {
          setTimeout(setFilename, 0);
        });
      }else{
        this.element.bind('change.uniform', setFilename);
      }

      if(this.element.attr("disabled")) {
        this.divTag.addClass(this.options.disabledClass);
      }
    },
    
    destroy: function(){
      this.element.siblings("span").remove();
      this.element.unwrap();
      uniformBase.prototype.destroy.call(this);
    }
  });
})(jQuery);