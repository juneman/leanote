Note.curNoteId="";Note.interval="";Note.itemIsBlog='<div class="item-blog"><i class="fa fa-bold" title="blog"></i></div>';Note.itemTplNoImg='<div href="#" class="item ?" noteId="?">';Note.itemTplNoImg+=Note.itemIsBlog+'<div class="item-desc" style="right: 0;"><p class="item-title">?</p><p class="item-text"><i class="fa fa-book"></i> <span class="note-notebook">?</span> <i class="fa fa-calendar"></i> <span class="updated-time">?</span> <br /><span class="desc">?</span></p></div></div>';Note.itemTpl='<div href="#" class="item ?" noteId="?"><div class="item-thumb" style=""><img src="?"/></div>';Note.itemTpl+=Note.itemIsBlog+'<div class="item-desc" style=""><p class="item-title">?</p><p class="item-text"><i class="fa fa-book"></i> <span class="note-notebook">?</span> <i class="fa fa-calendar"></i> <span class="updated-time">?</span> <br /><span class="desc">?</span></p></div></div>';Note.newItemTpl='<div href="#" class="item item-active ?" fromUserId="?" noteId="?">';Note.newItemTpl+=Note.itemIsBlog+'<div class="item-desc" style="right: 0px;"><p class="item-title">?</p><p class="item-text"><i class="fa fa-book"></i> <span class="note-notebook">?</span> <i class="fa fa-calendar"></i> <span class="updated-time">?</span><br /><span class="desc">?</span></p></div></div>';Note.noteItemListO=$("#noteItemList");Note.cacheByNotebookId={all:{}};Note.notebookIds={};Note.isReadOnly=false;Note.intervalTime=6e5;Note.startInterval=function(){Note.interval=setInterval(function(){log("自动保存开始...");changedNote=Note.curChangedSaveIt(false)},Note.intervalTime)};Note.stopInterval=function(){clearInterval(Note.interval);setTimeout(function(){Note.startInterval()},Note.intervalTime)};Note.addNoteCache=function(note){Note.cache[note.NoteId]=note;Note.clearCacheByNotebookId(note.NotebookId)};Note.setNoteCache=function(content,clear){if(!Note.cache[content.NoteId]){Note.cache[content.NoteId]=content}else{$.extend(Note.cache[content.NoteId],content)}if(clear==undefined){clear=true}if(clear){Note.clearCacheByNotebookId(content.NotebookId)}};Note.clearCacheByNotebookId=function(notebookId){if(notebookId){Note.cacheByNotebookId[notebookId]={};Note.cacheByNotebookId["all"]={};Note.notebookIds[notebookId]=true}};Note.notebookHasNotes=function(notebookId){var notes=Note.getNotesByNotebookId(notebookId);return!isEmpty(notes)};Note.getNotesByNotebookId=function(notebookId,sortBy,isAsc){if(!sortBy){sortBy="UpdatedTime"}if(isAsc=="undefined"){isAsc=false}if(!notebookId){notebookId="all"}if(!Note.cacheByNotebookId[notebookId]){return[]}if(Note.cacheByNotebookId[notebookId][sortBy]){return Note.cacheByNotebookId[notebookId][sortBy]}else{}var notes=[];var sortBys=[];for(var i in Note.cache){if(!i){continue}var note=Note.cache[i];if(note.IsTrash||note.IsShared){continue}if(notebookId=="all"||note.NotebookId==notebookId){notes.push(note)}}notes.sort(function(a,b){var t1=a[sortBy];var t2=b[sortBy];if(isAsc){if(t1<t2){return-1}else if(t1>t2){return 1}}else{if(t1<t2){return 1}else if(t1>t2){return-1}}return 0});Note.cacheByNotebookId[notebookId][sortBy]=notes;return notes};Note.renderNotesAndFirstOneContent=function(ret){if(!isArray(ret)){return}Note.renderNotes(ret);if(!isEmpty(ret[0])){Note.changeNote(ret[0].NoteId)}else{}};Note.curHasChanged=function(force){if(force==undefined){force=true}var cacheNote=Note.cache[Note.curNoteId]||{};var title=$("#noteTitle").val();var tags=Tag.getTags();var contents=getEditorContent(cacheNote.IsMarkdown);var content,preview;var contentText;if(isArray(contents)){content=contents[0];preview=contents[1];contentText=content;if(content&&previewIsEmpty(preview)){preview=Converter.makeHtml(content)}if(!content){preview=""}cacheNote.Preview=preview}else{content=contents;try{contentText=$(content).text()}catch(e){}}var hasChanged={hasChanged:false,IsNew:cacheNote.IsNew,IsMarkdown:cacheNote.IsMarkdown,FromUserId:cacheNote.FromUserId,NoteId:cacheNote.NoteId,NotebookId:cacheNote.NotebookId};if(hasChanged.IsNew){$.extend(hasChanged,cacheNote)}if(cacheNote.Title!=title){hasChanged.hasChanged=true;hasChanged.Title=title;if(!hasChanged.Title){}}if(!arrayEqual(cacheNote.Tags,tags)){hasChanged.hasChanged=true;hasChanged.Tags=tags}if(force&&cacheNote.Content!=content||!force&&$(cacheNote.Content).text()!=contentText){hasChanged.hasChanged=true;hasChanged.Content=content;var c=preview||content;hasChanged.Desc=Note.genDesc(c);hasChanged.ImgSrc=Note.getImgSrc(c);hasChanged.Abstract=Note.genAbstract(c)}else{log("text相同");log(cacheNote.Content==content)}hasChanged["UserId"]=cacheNote["UserId"]||"";return hasChanged};Note.genDesc=function(content){if(!content){return""}var token="ALEALE";content=content.replace(/<\/p>/g,token);content=content.replace(/<\/div>/g,token);content=content.replace(/<\/?.+?>/g," ");pattern=new RegExp(token,"g");content=content.replace(pattern,"<br />");content=content.replace(/<br \/>( *)<br \/>/g,"<br />");content=content.replace(/<br \/>( *)<br \/>/g,"<br />");content=trimLeft(content," ");content=trimLeft(content,"<br />");content=trimLeft(content,"</p>");content=trimLeft(content,"</div>");if(content.length<300){return content}return content.substring(0,300)};Note.genAbstract=function(content,len){if(len==undefined){len=1e3}if(content.length<len){return content}var isCode=false;var isHTML=false;var n=0;var result="";var maxLen=len;for(var i=0;i<content.length;++i){var temp=content[i];if(temp=="<"){isCode=true}else if(temp=="&"){isHTML=true}else if(temp==">"&&isCode){n=n-1;isCode=false}else if(temp==";"&&isHTML){isHTML=false}if(!isCode&&!isHTML){n=n+1}result+=temp;if(n>=maxLen){break}}var d=document.createElement("div");d.innerHTML=result;return d.innerHTML};Note.getImgSrc=function(content){if(!content){return""}var imgs=$(content).find("img");for(var i in imgs){var src=imgs.eq(i).attr("src");if(src){return src}}return""};Note.curChangedSaveIt=function(force){if(!Note.curNoteId||Note.isReadOnly){return}var hasChanged=Note.curHasChanged(force);Note.renderChangedNote(hasChanged);if(hasChanged.hasChanged||hasChanged.IsNew){delete hasChanged.hasChanged;Note.setNoteCache(hasChanged,false);Note.setNoteCache({NoteId:hasChanged.NoteId,UpdatedTime:(new Date).format("yyyy-MM-ddThh:mm:ss.S")},false);showMsg(getMsg("saving"));ajaxPost("/note/UpdateNoteOrContent",hasChanged,function(ret){if(hasChanged.IsNew){ret.IsNew=false;Note.setNoteCache(ret,false)}showMsg(getMsg("saveSuccess"),1e3)});return hasChanged}return false};Note.selectTarget=function(target){$(".item").removeClass("item-active");$(target).addClass("item-active")};Note.changeNote=function(selectNoteId,isShare,needSaveChanged){Note.stopInterval();var target=$(t('[noteId="?"]',selectNoteId));Note.selectTarget(target);if(needSaveChanged==undefined){needSaveChanged=true}if(needSaveChanged){var changedNote=Note.curChangedSaveIt()}Note.curNoteId="";var cacheNote=Note.cache[selectNoteId];if(!isShare){if(cacheNote.Perm!=undefined){isShare=true}}var hasPerm=!isShare||Share.hasUpdatePerm(selectNoteId);if(!LEA.isMobile&&hasPerm){Note.hideReadOnly();Note.renderNote(cacheNote);switchEditor(cacheNote.IsMarkdown)}else{Note.renderNoteReadOnly(cacheNote)}function setContent(ret){Note.setNoteCache(ret,false);ret=Note.cache[selectNoteId];if(!LEA.isMobile&&hasPerm){Note.renderNoteContent(ret)}else{Note.renderNoteContentReadOnly(ret)}hideLoading()}if(cacheNote.Content){setContent(cacheNote);return}var url="/note/GetNoteContent";var param={noteId:selectNoteId};if(isShare){url="/share/GetShareNoteContent";param.sharedUserId=cacheNote.UserId}showLoading();ajaxGet(url,param,setContent)};Note.renderChangedNote=function(changedNote){if(!changedNote){return}var $leftNoteNav=$(t('[noteId="?"]',changedNote.NoteId));if(changedNote.Title){$leftNoteNav.find(".item-title").html(changedNote.Title)}if(changedNote.Desc){$leftNoteNav.find(".desc").html(changedNote.Desc)}if(changedNote.ImgSrc&&!LEA.isMobile){$thumb=$leftNoteNav.find(".item-thumb");if($thumb.length>0){$thumb.find("img").attr("src",changedNote.ImgSrc)}else{$leftNoteNav.append(t('<div class="item-thumb" style=""><img src="?"></div>',changedNote.ImgSrc))}$leftNoteNav.find(".item-desc").removeAttr("style")}else if(changedNote.ImgSrc==""){$leftNoteNav.find(".item-thumb").remove();$leftNoteNav.find(".item-desc").css("right",0)}};Note.clearNoteInfo=function(){Note.curNoteId="";Tag.clearTags();$("#noteTitle").val("");setEditorContent("");$("#wmd-input").val("");$("#wmd-preview").html("");$("#noteRead").hide()};Note.clearNoteList=function(){Note.noteItemListO.html("")};Note.clearAll=function(){Note.curNoteId="";Note.clearNoteInfo();Note.clearNoteList()};Note.renderNote=function(note){if(!note){return}$("#noteTitle").val(note.Title);Tag.renderTags(note.Tags)};Note.renderNoteContent=function(content){setEditorContent(content.Content,content.IsMarkdown,content.Preview);Note.curNoteId=content.NoteId};Note.showEditorMask=function(){$("#editorMask").css("z-index",10);if(Notebook.curNotebookIsTrashOrAll()){$("#editorMaskBtns").hide();$("#editorMaskBtnsEmpty").show()}else{$("#editorMaskBtns").show();$("#editorMaskBtnsEmpty").hide()}};Note.hideEditorMask=function(){$("#editorMask").css("z-index",-10)};Note.renderNotesC=0;Note.renderNotes=function(notes,forNewNote,isShared){var renderNotesC=++Note.renderNotesC;$("#noteItemList").slimScroll({scrollTo:"0px",height:"100%",onlyScrollBar:true});if(!notes||typeof notes!="object"||notes.length<=0){if(!forNewNote){Note.showEditorMask()}return}Note.hideEditorMask();if(forNewNote==undefined){forNewNote=false}if(!forNewNote){Note.noteItemListO.html("")}var len=notes.length;var c=Math.ceil(len/20);Note._renderNotes(notes,forNewNote,isShared,1);for(var i=0;i<len;++i){var note=notes[i];Note.setNoteCache(note,false);if(isShared){Share.setCache(note)}}for(var i=1;i<c;++i){setTimeout(function(i){return function(){if(renderNotesC==Note.renderNotesC){Note._renderNotes(notes,forNewNote,isShared,i+1)}}}(i),i*2e3)}};Note._renderNotes=function(notes,forNewNote,isShared,tang){var baseClasses="item-my";if(isShared){baseClasses="item-shared"}var len=notes.length;for(var i=(tang-1)*20;i<len&&i<tang*20;++i){var classes=baseClasses;if(!forNewNote&&i==0){classes+=" item-active"}var note=notes[i];var tmp;if(note.ImgSrc&&!LEA.isMobile){tmp=t(Note.itemTpl,classes,note.NoteId,note.ImgSrc,note.Title,Notebook.getNotebookTitle(note.NotebookId),goNowToDatetime(note.UpdatedTime),note.Desc)}else{tmp=t(Note.itemTplNoImg,classes,note.NoteId,note.Title,Notebook.getNotebookTitle(note.NotebookId),goNowToDatetime(note.UpdatedTime),note.Desc)}if(!note.IsBlog){tmp=$(tmp);tmp.find(".item-blog").hide()}Note.noteItemListO.append(tmp)}};Note.newNote=function(notebookId,isShare,fromUserId,isMarkdown){switchEditor(isMarkdown);Note.hideEditorMask();Note.hideReadOnly();Note.stopInterval();Note.curChangedSaveIt();var note={NoteId:getObjectId(),Title:"",Tags:[],Content:"",NotebookId:notebookId,IsNew:true,FromUserId:fromUserId,IsMarkdown:isMarkdown};Note.addNoteCache(note);var newItem="";var baseClasses="item-my";if(isShare){baseClasses="item-shared"}var notebook=Notebook.getNotebook(notebookId);var notebookTitle=notebook?notebook.Title:"";var curDate=getCurDate();if(isShare){newItem=t(Note.newItemTpl,baseClasses,fromUserId,note.NoteId,note.Title,notebookTitle,curDate,"")}else{newItem=t(Note.newItemTpl,baseClasses,"",note.NoteId,note.Title,notebookTitle,curDate,"")}if(!notebook.IsBlog){newItem=$(newItem);newItem.find(".item-blog").hide()}if(!Notebook.isCurNotebook(notebookId)){Note.clearAll();Note.noteItemListO.prepend(newItem);if(!isShare){Notebook.changeNotebookForNewNote(notebookId)}else{Share.changeNotebookForNewNote(notebookId)}}else{Note.noteItemListO.prepend(newItem)}Note.selectTarget($(t('[noteId="?"]',note.NoteId)));$("#noteTitle").focus();Note.renderNote(note);Note.renderNoteContent(note);Note.curNoteId=note.NoteId};Note.saveNote=function(e){var num=e.which?e.which:e.keyCode;if((e.ctrlKey||e.metaKey)&&num==83){Note.curChangedSaveIt();e.preventDefault();return false}else{}};Note.changeToNext=function(target){var $target=$(target);var next=$target.next();if(!next.length){var prev=$target.prev();if(prev.length){next=prev}else{Note.showEditorMask();return}}Note.changeNote(next.attr("noteId"))};Note.deleteNote=function(target,contextmenuItem,isShared){if($(target).hasClass("item-active")){Note.stopInterval();Note.curNoteId=null;Note.clearNoteInfo()}noteId=$(target).attr("noteId");if(!noteId){return}$(target).hide();var note=Note.cache[noteId];var url="/note/deleteNote";if(note.IsTrash){url="/note/deleteTrash"}ajaxGet(url,{noteId:noteId,userId:note.UserId,isShared:isShared},function(ret){if(ret){Note.changeToNext(target);$(target).remove();if(note){Note.clearCacheByNotebookId(note.NotebookId);delete Note.cache[noteId]}showMsg("删除成功!",500)}else{$(target).show();showMsg("删除失败!",2e3)}})};Note.listNoteShareUserInfo=function(target){var noteId=$(target).attr("noteId");showDialogRemote("share/listNoteShareUserInfo",{noteId:noteId})};Note.shareNote=function(target){var title=$(target).find(".item-title").text();showDialog("dialogShareNote",{title:"分享笔记给好友-"+title});setTimeout(function(){$("#friendsEmail").focus()},500);var noteId=$(target).attr("noteId");shareNoteOrNotebook(noteId,true)};Note.listNoteContentHistories=function(){$("#leanoteDialog #modalTitle").html(getMsg("history"));$content=$("#leanoteDialog .modal-body");$content.html("");$("#leanoteDialog .modal-footer").html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>');options={};options.show=true;$("#leanoteDialog").modal(options);ajaxGet("noteContentHistory/listHistories",{noteId:Note.curNoteId},function(re){if(!isArray(re)){$content.html("无历史记录");return}var str='leanote会保存笔记的最近10份历史记录. <div id="historyList"><table class="table table-hover">';note=Note.cache[Note.curNoteId];var s="div";if(note.IsMarkdown){s="pre"}for(i in re){var content=re[i];content.Ab=Note.genAbstract(content.Content,200);str+=t('<tr><td seq="?"><? class="each-content">?</?> <div class="btns">时间: <span class="label label-default">?</span> <button class="btn btn-default all">展开</button> <button class="btn btn-primary back">还原</button></div></td></tr>',i,s,content.Ab,s,goNowToDatetime(content.UpdatedTime))}str+="</table></div>";$content.html(str);$("#historyList .all").click(function(){$p=$(this).parent().parent();var seq=$p.attr("seq");var $c=$p.find(".each-content");if($(this).text()=="展开"){$(this).text("折叠");$c.html(re[seq].Content)}else{$(this).text("展开");$c.html(re[seq].Ab)}});$("#historyList .back").click(function(){$p=$(this).parent().parent();var seq=$p.attr("seq");if(confirm("确定要从该版还原? 还原前leanote会备份当前版本到历史记录中.")){Note.curChangedSaveIt();note=Note.cache[Note.curNoteId];setEditorContent(re[seq].Content,note.IsMarkdown);hideDialog()}})})};Note.html2Image=function(target){var noteId=$(target).attr("noteId");showDialog("html2ImageDialog",{title:"发送长微博",postShow:function(){ajaxGet("/note/html2Image",{noteId:noteId},function(ret){if(typeof ret=="object"&&ret.Ok){$("#leanoteDialog .weibo span").html("生成成功, 右键图片保存到本地.");$("#leanoteDialog .weibo img").attr("src",ret.Id);$("#leanoteDialog .sendWeiboBtn").removeClass("disabled");$("#leanoteDialog .sendWeiboBtn").click(function(){var title=Note.cache[noteId].Title;var url="http://service.weibo.com/share/share.php?title="+title+" ("+UserInfo.Username+"分享. 来自leanote.com)";url+="&pic="+UrlPrefix+ret.Id;window.open(url,"_blank")})}else{$("#leanoteDialog .weibo span").html("对不起, 我们出错了!")}})}})};Note.showReadOnly=function(){Note.isReadOnly=true;$("#noteRead").show()};Note.hideReadOnly=function(){Note.isReadOnly=false;$("#noteRead").hide()};Note.renderNoteReadOnly=function(note){Note.showReadOnly();$("#noteReadTitle").html(note.Title);Tag.renderReadOnlyTags(note.Tags);$("#noteReadCreatedTime").html(goNowToDatetime(note.CreatedTime));$("#noteReadUpdatedTime").html(goNowToDatetime(note.UpdatedTime))};Note.renderNoteContentReadOnly=function(note){$("#noteReadContent").html(note.Content)};Note.lastSearch=null;Note.lastKey=null;Note.lastSearchTime=new Date;Note.isOver2Seconds=false;Note.isSameSearch=function(key){var now=new Date;var duration=now.getTime()-Note.lastSearchTime.getTime();Note.isOver2Seconds=duration>2e3?true:false;if(!Note.lastKey||Note.lastKey!=key||duration>1e3){Note.lastKey=key;Note.lastSearchTime=now;return false}if(key==Note.lastKey){return true}Note.lastSearchTime=now;Note.lastKey=key;return false};Note.searchNote=function(){var val=$("#searchNoteInput").val();if(!val){Notebook.changeNotebook("0");return}if(Note.isSameSearch(val)){return}if(Note.lastSearch){Note.lastSearch.abort()}Note.curChangedSaveIt();Note.clearAll();showLoading();Note.lastSearch=$.post("/note/searchNote",{key:val},function(notes){hideLoading();if(notes){Note.lastSearch=null;Note.renderNotes(notes);if(!isEmpty(notes)){Note.changeNote(notes[0].NoteId,false)}}else{}})};Note.setNote2Blog=function(target){var noteId=$(target).attr("noteId");var note=Note.cache[noteId];var isBlog=true;if(note.IsBlog!=undefined){isBlog=!note.IsBlog}if(isBlog){$(target).find(".item-blog").show()}else{$(target).find(".item-blog").hide()}ajaxPost("/blog/setNote2Blog",{noteId:noteId,isBlog:isBlog},function(ret){if(ret){Note.setNoteCache({NoteId:noteId,IsBlog:isBlog},false)}})};Note.setAllNoteBlogStatus=function(notebookId,isBlog){if(!notebookId){return}var notes=Note.getNotesByNotebookId(notebookId);if(!isArray(notes)){return}var len=notes.length;if(len==0){for(var i in Note.cache){if(Note.cache[i].NotebookId==notebookId){Note.cache[i].IsBlog=isBlog}}}else{for(var i=0;i<len;++i){notes[i].IsBlog=isBlog}}};Note.moveNote=function(target,data){var noteId=$(target).attr("noteId");var note=Note.cache[noteId];var notebookId=data.notebookId;if(!note.IsTrash&&note.NotebookId==notebookId){return}ajaxGet("/note/moveNote",{noteId:noteId,notebookId:notebookId},function(ret){if(ret&&ret.NoteId){if(note.IsTrash){Note.changeToNext(target);$(target).remove();Note.clearCacheByNotebookId(notebookId)}else{if(!Notebook.curActiveNotebookIsAll()){Note.changeToNext(target);if($(target).hasClass("item-active")){Note.clearNoteInfo()}$(target).remove()}else{$(target).find(".note-notebook").html(Notebook.getNotebookTitle(notebookId))}Note.clearCacheByNotebookId(note.NotebookId);Note.clearCacheByNotebookId(notebookId)}Note.setNoteCache(ret)}})};Note.copyNote=function(target,data,isShared){var noteId=$(target).attr("noteId");var note=Note.cache[noteId];var notebookId=data.notebookId;if(note.IsTrash||note.NotebookId==notebookId){return}var url="/note/copyNote";var data={noteId:noteId,notebookId:notebookId};if(isShared){url="/note/copySharedNote";data.fromUserId=note.UserId}ajaxGet(url,data,function(ret){if(ret&&ret.NoteId){Note.clearCacheByNotebookId(notebookId);Note.setNoteCache(ret)}})};Note.contextmenu=null;Note.initContextmenu=function(){if(Note.contextmenu){Note.contextmenu.unbind("contextmenu")}var notebooksMove=[];var notebooksCopy=[];$("#notebookNavForNewNote li div.new-note-left").each(function(){var notebookId=$(this).attr("notebookId");var title=$(this).text();var move={text:title,notebookId:notebookId,action:Note.moveNote};var copy={text:title,notebookId:notebookId,action:Note.copyNote};notebooksMove.push(move);notebooksCopy.push(copy)});var noteListMenu={width:150,items:[{text:"分享给好友",alias:"shareToFriends",icon:"",faIcon:"fa-share-square-o",action:Note.listNoteShareUserInfo},{type:"splitLine"},{text:"公开为博客",alias:"set2Blog",icon:"",action:Note.setNote2Blog},{text:"取消公开为博客",alias:"unset2Blog",icon:"",action:Note.setNote2Blog},{type:"splitLine"},{text:"删除",icon:"",faIcon:"fa-trash-o",action:Note.deleteNote},{text:"移动",alias:"move",icon:"",type:"group",width:150,items:notebooksMove},{text:"复制",alias:"copy",icon:"",type:"group",width:150,items:notebooksCopy}],onShow:applyrule,onContextMenu:beforeContextMenu,parent:"#noteItemList",children:".item-my"};function menuAction(target){showDialog("dialogUpdateNotebook",{title:"修改笔记本",postShow:function(){}})}function applyrule(menu){var noteId=$(this).attr("noteId");var note=Note.cache[noteId];if(!note){return}var items=[];if(note.IsTrash){items.push("shareToFriends");items.push("shareStatus");items.push("unset2Blog");items.push("set2Blog");items.push("copy")}else{if(!note.IsBlog){items.push("unset2Blog")}else{items.push("set2Blog")}var notebookTitle=Notebook.getNotebookTitle(note.NotebookId);items.push("move."+notebookTitle);items.push("copy."+notebookTitle)}menu.applyrule({name:"target..",disable:true,items:items})}function beforeContextMenu(){return this.id!="target3"}Note.contextmenu=$("#noteItemList .item").contextmenu(noteListMenu)};$(function(){$("#noteItemList").on("click",".item",function(event){event.stopPropagation();var parent=findParents(this,".item");if(!parent){return}var noteId=parent.attr("noteId");if(!noteId){return}if(Note.curNoteId==noteId){return}Note.changeNote(noteId)});$("#newNoteBtn, #editorMask .note").click(function(){var notebookId=$("#curNotebookForNewNote").attr("notebookId");Note.newNote(notebookId)});$("#newNoteMarkdownBtn, #editorMask .markdown").click(function(){var notebookId=$("#curNotebookForNewNote").attr("notebookId");Note.newNote(notebookId,false,"",true)});$("#notebookNavForNewNote").on("click","li div",function(){var notebookId=$(this).attr("notebookId");if($(this).text()=="Markdown"){Note.newNote(notebookId,false,"",true)}else{Note.newNote(notebookId)}});$("#searchNoteInput").on("keydown",function(e){var theEvent=e;if(theEvent.keyCode==13||theEvent.keyCode==108){theEvent.preventDefault();Note.searchNote();return false}});Note.initContextmenu();$("#contentHistory").click(function(){Note.listNoteContentHistories()});$("#saveBtn").click(function(){Note.curChangedSaveIt(true)});$("#noteItemList").on("click",".item-blog",function(e){e.preventDefault();e.stopPropagation();var noteId=$(this).parent().attr("noteId");window.open("/blog/view/"+noteId)})});Note.startInterval();