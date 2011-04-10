;
(function(){
	tinymce.PluginManager.requireLangPack('cacoo');
	tinymce.create('tinymce.plugins.CacooPlugin',{
		init : function(ed,url){
			ed.addCommand('mceCacoo',function(){
				ed.windowManager.open({
					file : url + '/cacoo.htm',
					width : 500,
					height : 500,
					inline : 1
				},{
					plugin_url : url
				});
			});	    		
	    	ed.addButton('cacoo',{
	    		title : 'cacoo.desc',
	    		cmd : 'mceCacoo',
	    		image : url + '/img/cacoo.png'
	    	});
		},
		createControl:function(n,cm){
			return null;
		},
		getInfo : function(){
			return {
				longname : 'Cacoo',
				author : 'someda@isenshi.com',
				authorurl : 'http://d.hatena.ne.jp/tksmd/',
				infourl : 'http://d.hatena.ne.jp/tksmd/',
				version : '0.1'
			};
		}		
	});
	tinymce.PluginManager.add('cacoo',tinymce.plugins.CacooPlugin);
})();
