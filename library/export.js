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

function export_all_artboards(format,path){
  if (path == undefined) {
    path = getExportPath();
  }
  var pages = [doc pages];
  var curpage = [doc currentPage];

  for(var i=0; i < [pages count]; i++){
    var page = [pages objectAtIndex:i]
    [doc setCurrentPage:page]
    var pagename = [[doc currentPage] name],
        layers = [[doc currentPage] artboards],
        layernum = [layers count];

    if (pagename.charAt(0) == "-") { continue; }
    
    pagename = /*padNumber(i) + "_" + */pagename.replace(" ", "-") + "/";
    if (i == 0) { pagename = "" }

    for (var j=0; j < [layers count]; j++) {
      var artboard = [layers objectAtIndex:j];
      layernum = [layers count]-j;

      var artname = padNumber(layernum) + "_" + [artboard name].split(" ").join("-");//  replace(" ", "-");

      if ([artboard name].charAt(0) == "-") { continue; }

      save_artboard_tofile(artboard, path + "/" + pagename + artname, "png");

      /*
      if (in_sandbox()) {
        sandboxAccess.accessFilePath_withBlock_persistPermission(path, function() {
          [doc saveArtboardOrSlice:artboard toFile:path + "/" + pagename + artname + "." + format];
        }, true)
      } else {
        log("We are NOT sandboxed")
        [doc saveArtboardOrSlice:artboard toFile:path + "/" + pagename + artname + "." + format];
      }
      */
    }
    
  }

  [doc setCurrentPage:curpage];
}

//function export_artboards()

function save_artboard_tofile(artboard,path,format) {
  if (in_sandbox()) {
    sandboxAccess.accessFilePath_withBlock_persistPermission(path, function() {
      [doc saveArtboardOrSlice:artboard toFile:path + "." + format];
    }, true)
  } else {
    log("We are NOT sandboxed")
    [doc saveArtboardOrSlice:artboard toFile:path + "." + format];
  } 
}

/*
if ([doc fileURL] == null) {
	alert("You need to save your document to use this command");
} else {
	export_all_artboards("png");
}*/