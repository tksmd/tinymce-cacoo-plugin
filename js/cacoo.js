/**
 * @require tiny_mce_popup.js
 * @require jquery-1.4.2
 */
tinyMCEPopup.requireLangPack();

if (typeof Cacoo === 'undefined' || !Cacoo) {
    var Cacoo = {};
}

Cacoo.Dialog = {
	init : function(){
	
		// setup
		this._doBind();
	
		// key management
		var key = Cacoo.KeyManager.get();
		if(key){
			$('#api_key').val(key);
			this.load(key);			
		}else{
			this._showSettingsTab();
		}		
	},
	load : function(apiKey){		
		var url = 'https://cacoo.com/api/v1/diagrams.json?apiKey=' + apiKey + '&callback=?';
		$.getJSON(url,function(data){
			$("#diagrams_status").html(data.count + " results");
			$.each(data.result,function(i,item){			
				var tr = '<tr>' +'<td>'+ item.title + '</td>'+ '<td>' + item.owner.name+ '</td>'+ '</tr>';			
				var j$tr = $(tr).appendTo("#diagrams tbody").hover(function(e){
					$(this).toggleClass("diagram_over");
				}).click(function(e){
					// style
					$(this).siblings(".diagram_selected").removeClass("diagram_selected");
					$(this).addClass("diagram_selected");
					
					// append
					$("#preview").children().remove();
					$("<img/>").attr("src",item.imageUrl).css({
						height:"200px"
					}).appendTo("#preview");
				});
				// associate data to element			
				$.data(j$tr.get(0),"diagram",item); 
			});
		});			
	},
	insert : function(){
		var j$sel = $("table#diagrams > tbody > tr.diagram_selected");
		if(j$sel.length > 0){
			var diagram = $.data(j$sel.get(0),"diagram");
			if(diagram){
				var ed = tinyMCEPopup.editor, args = {};				
			    tinyMCEPopup.restoreSelection();			    
				var content = "<iframe src='" + diagram.url + "/view' width='402' height='330' frameborder='0' scrolling='no'></iframe>";
			    ed.execCommand('mceInsertContent', false, content);
			    ed.undoManager.add();
			    tinyMCEPopup.close();				
			}
		}
		return false;		
	},
	_doBind: function(){
		var self = this;
		
		$('#insert').click(function(){
			self.insert();
		});
		$('#cancel').click(function(){
			tinyMCEPopup.close();
		});		
		
		$('#apply').click(function(){
			var valid = AutoValidator.validate($('#settings_panel').get(0));
			if(valid){
				var key = $('#api_key').val();
				Cacoo.KeyManager.save(key);
				self._showViewerTab();
				self.load(key);
			}			
		});		
		
		$('#viewer_tab > span > a').click(function(){
			self._showViewerTab();
		});
		
		$('#settings_tab > span > a').click(function(){
			self._showSettingsTab();
		});
		
	},
	_showViewerTab : function(){
		mcTabs.displayTab('viewer_tab','viewer_panel');
		$('#apply').attr('disabled','disabled');
	},
	_showSettingsTab : function(){
		mcTabs.displayTab('settings_tab','settings_panel');
		$('#apply').removeAttr('disabled');		
	}
}

Cacoo.KeyManager = {
	get : function(){
		// from parameter
		var ret = tinyMCEPopup.getParam('cacoo_api_key');
		if(ret){
			return ret;
		}
		// try retrieve from local storage
		var w = tinyMCEPopup.getWin();
		if(w.localStorage && $.isFunction(w.localStorage.getItem)){
			ret = w.localStorage.getItem('cacoo_api_key');
		}		
		return ret;
	},
	save : function(value){
		
		if(!value){
			return;
		}		
		var w = tinyMCEPopup.getWin();		
		if(w.localStorage && $.isFunction(w.localStorage.setItem)){
			w.localStorage.setItem('cacoo_api_key',value);
		}
		
		var f = tinyMCEPopup.getParam('cacoo_save_callback');
		if(f && $.isFunction(f)){
			f({
				api_key : value
			});
		}		
	}
}

tinyMCEPopup.onInit.add(Cacoo.Dialog.init, Cacoo.Dialog);
