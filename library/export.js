// Export all artboards
#import 'library/sandbox.js'
#import 'library/sandbox-sketch-utils.js'

function getFileFolder(){
	var file_url = [doc fileURL],
	file_path = [file_url path],
	file_folder = file_path.split([doc displayName])[0];
	return file_folder;
}

function getExportPath(){
	var file_folder = getFileFolder(),
 		export_folder = file_folder;// + ([doc displayName]).split('.sketch')[0];
	return export_folder;
}

function padNumber(num){
  num = num.toString();
  if (num.length < 2) {
    num = "0" + num;
  };
  return num;
}

function sanitize_filename(name) {
  return name.replace(/й/g,"и").replace(/\s/g,"_");
}

function save_file_from_string(filename,the_string) {
  var path = [@"" stringByAppendingString:filename],
      str = [@"" stringByAppendingString:the_string];

  [str writeToFile:path atomically:true encoding:NSUTF8StringEncoding error:null];
}

function export_all_artboards(format,path){
  if (path == undefined) {
    path = getExportPath() + "/";
  }

  var pages = [doc pages];
  var curpage = [doc currentPage];
  
  function export_loop() {
    var rootnum = 0;

    for(var i=0; i < [pages count]; i++){
      var page = [pages objectAtIndex:i]
      [doc setCurrentPage:page]
      var pagename = [[doc currentPage] name]+"/",
          layers = [[doc currentPage] artboards],
          layernum = [layers count];

      pagename = sanitize_filename(pagename);

      if (pagename.charAt(0) == "-") { continue; }

      if (pagename.charAt(0) == "*") {
        pagename = "";
       } else {
        //pagename = pagename.split(" ").join("_") + "/";
      }

      var foldernum = 0;

      var namesList = "";
      for (var j=0; j < [layers count]; j++) {
        var curLayerNum = [layers count] - j - 1;
        var artboard = [layers objectAtIndex:curLayerNum];
        if ([artboard name].charAt(0) == "-") { continue; }
        
        if (pagename == "") { 
          layernum = rootnum;
          rootnum ++;
        } else {
          layernum = foldernum;
          foldernum ++;
        }

        var fileName = sanitize_filename(/*padNumber(layernum) + "-" +*/ [artboard name] + ".png");
        namesList += fileName + "\n";

        [doc saveArtboardOrSlice:artboard toFile:path + pagename + fileName];

      }

      save_file_from_string(path + pagename + "_index.txt", namesList);
    }
    
  }

  if (in_sandbox()) {
    sandboxAccess.accessFilePath_withBlock_persistPermission(path, export_loop, true);
  } else {
    log("We are NOT sandboxed");
    export_loop();
  }

  [doc setCurrentPage:curpage];
}


