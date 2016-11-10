/**
 * @file File with the configurable variables that might require tweaking.
 * @author Jedrzej Stuczynski
 * @author Ali Aliyev 
 */

/**Variable specifying the address of the ElasticSearch server*/
var elasticSearchURL = "http://localhost:9200/"; //"http://192.168.99.47:9200";

/**Variable specyfying address of the server with the thumbnails and PDFs of the documents*/
// var thumbnailSource = "http://192.168.99.42:8080/thumbs/"
var thumbnailSource = "tempdummy/";//"http://localhost:8081/";

/**Address of ES instance responsible for getting log data*/
var elasticSearchLogURL = "http://localhost:9200/"

/**Variable specifying address of the server receiving answers from the feedback form*/
var feedbackURL = "http://localhost:81";

/**Variable responsible for toggling debug mode for printing debug messages to the console*/
var debug = false;

/**Constant specifying length of the initial text snippet*/
var SHORT_SNIPPET_LENGTH = 100;

/**Constant specifying length of the expanded text snippet*/
var LONG_SNIPPET_LENGTH = 1000;

/**Constant specifying height(in px) of medium thumbnail/icon*/
var DEFAULT_THUMBNAIL_HEIGHT = 250;

/**Constant specifying maximum number of visible pagination pages*/
var MAX_VISIBLE_PAGES = 3;

/**Variable used in the thumbnail size slider. It rescales the original image by those factors. The initial value, i.e. of 1.0 is based on DEFAULT_THUMBNAIL_HEIGHT*/
var scalingTicks = [0.5, 1.25, 2.0, 3.0]; 