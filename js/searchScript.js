/*
TODO:
- display thumbnails/icon for text
- generation of PDFs for the text
- collapsable items on the timeline
- if 2 or more elements on the timeline have same month: make them use same header
- download PDF
- choose patient at the beginning, then search for same bcoid in the docs
*/
var debug = true;

var url = "http://timeline-silverash.rhcloud.com";

var client = new $.es.Client({
	host: url,
	log: "info"
});


$(document).ready(function() {
	doSetup();
});

function doSetup() {

	$('#datePickerFrom').datetimepicker({
		viewMode: 'years',
		format: 'YYYY-MM-DD',
		useCurrent: false,
		defaultDate : new Date(0),
		// minDate : new Date("1-1-1970"),
		maxDate : new Date(),
		allowInputToggle : true
	});

	$('#datePickerTo').datetimepicker({
		viewMode: 'years',
		format: 'YYYY-MM-DD',
	    defaultDate : new Date(),
		// minDate : new Date("1-1-1970"),
	    maxDate: new Date() ,
		allowInputToggle : true
	});


	$("#containingKeywords").on("keydown", function(e){
		if (e.keyCode == 13) {
			e.preventDefault();
			$("#searchButton").click();
		}
	});


	$("#datePickerFrom").on("dp.change", function (e) {
	    $('#datePickerTo').data("DateTimePicker").minDate(e.date);
	});

	$("#datePickerTo").on("dp.change", function (e) {
	    $('#datePickerFrom').data("DateTimePicker").maxDate(e.date);
	});

}

function startSearch() {
	// testCollapse();
	clearTimeline()
	prepareSearchData();
}

function clearTimeline() {
	$("#timelineList").empty();
}



function prepareSearchData()
{
	var startDate = $('#datePickerFrom').data('date');
	var endDate = $('#datePickerTo').data('date');
	var resultsPerPage = $('#numberResults').val();

	var containingKeywords = "";
	if(debug)
		console.log(containingKeywords);

    // below was converting DD/MM/YYYY into YYYY-MM-DD
    //
	// if(startDate) {
	// 	var splitStartDate = startDate.split("/");
	// 	startDate = splitStartDate[2]+"-"+splitStartDate[1]+"-"+splitStartDate[0];
	// }
	// else
	// 	return;

	// if(endDate) {
	// 	var splitEndDate = endDate.split("/");
	// 	endDate = splitEndDate[2]+"-"+splitEndDate[1]+"-"+splitEndDate[0];
	// }
	// else
	// 	return;

	if($('#containingKeywords').val())
		containingKeywords = $('#containingKeywords').val();

	if(debug)
		console.log(startDate);
	if(debug)
		console.log(endDate);

	prepareSearchJSON(resultsPerPage, startDate, endDate, containingKeywords)
}


function prepareSearchJSON(resultsPerPage, startDate, endDate, containingKeywords) {
	startDate = new Date(startDate).getTime();
	endDate = new Date(endDate).getTime();
	if(debug) {
		console.log(startDate);
		console.log(endDate);
	}
	var searchParams = {
		size : resultsPerPage, // temp
		//from : startingIndex, // TODO
		index : "mock", // temp
		type : "doc", //temp
		body : {
			query : {
				bool : {
					must : [{
						//{term : {gender : "male"} },
						range:	{
							created : {
								"gte" : startDate,
								"lte" : endDate
							}
						 }	
					}],
					should : [
						{ match: {"_all" : containingKeywords}}
					]
				}
			}
		}
	}

	searchData(searchParams);
}

function resultsCompararison(a,b) {
	if(a._source.created > b._source.created)
		return -1;
	if(a._source.created == b._source.created)
		return 0;
	else
		return 1;
}

function getShortMonth(num) {
	switch(num) {
		case 0: return 'Jan';
		case 1: return 'Feb';
		case 2: return 'Mar';
		case 3: return 'Apr';
		case 4: return 'May';
		case 5: return 'Jun';
		case 6: return 'Jul';
		case 7: return 'Aug';
		case 8: return 'Sep';
		case 9: return 'Oct';
		case 10: return 'Nov';
		case 11: return 'Dec';																				
	}
}

/*
function createPDF(sourceText) {
	var doc = new jsPDF();

	var splitText = doc.splitTextToSize(sourceText,180);
 	doc.text(10,10,splitText);
	// var x = 10;
	// pageHeight= doc.internal.pageSize.height;
	// var y = 500 
	// for(i = 0; i < splitText.length; i++) {
	// 	if (y >= pageHeight) {
	// 	  doc.addPage();
	// 	  y = 0 
	// 	}
	// 	doc.text(x, y, splitText);
	// }
	
	doc.output('save', 'Download.pdf');
}
*/

function pdfToHTML(source){
var pdf = new jsPDF('p', 'pt', 'letter');
//source = $('#pdf2htmldiv')[0];
specialElementHandlers = {
	'#bypassme': function(element, renderer){
		return true
	}
}
margins = {
    top: 50,
    left: 60,
	right: 60,
    width: 500
  };
pdf.fromHTML(
  	source // HTML string or DOM elem ref.
  	, margins.left // x coord
  	, margins.top // y coord
  	, {
  		'width': margins.width // max width of content on PDF
  		, 'elementHandlers': specialElementHandlers
  	},
  	function (dispose) {
  	  // dispose: object with X, Y of the last line add to the PDF
  	  //          this allow the insertion of new lines after html
        pdf.save('html2pdf.pdf');
      }
  )		
}


function processResults(searchResult) {
	if(debug) 
		console.log(searchResult);
	searchResult = searchResult.sort(resultsCompararison)

	var presentMonths;
	$.each(searchResult, function(index, value){
		var exactDate = new Date(value._source.created);
		var monthYear = getShortMonth(exactDate.getMonth())+" "+exactDate.getFullYear();
		var timelineEntry = "";
		var person = "Lorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vimLorem ipsum dolor sit amet, ornatus facilis ea nam. Etiam ornatus te usu, id his alii soluta. Eu mel iudico latine contentiones. Pri an idque partem interpretaris, ut eum error luptatum. Cum eripuit mediocrem in, ut explicari quaerendum duo, eum et quaestio euripidis.Ei cum lorem nulla appellantur, virtute accusata vix no. Purto nominavi constituto ex qui. Cu eos vivendo splendide, indoctum assueverit accommodare has te. Nibh accusata at cum, lorem dicit essent cum ei, vel simul tibique ut. Usu eu tempor deserunt eleifend, mel verear tibique ut, sed quas maiorum ea.Usu ne duis fugit sonet, mel ut tota idque efficiendi. No enim commodo docendi ius, magna integre persequeris ius ex. In consul sadipscing voluptatibus est. Usu ne ubique semper eirmod. Vocibus patrioque omittantur nec ut. Altera tamquam nostrud ne mea, vel ne tacimates electram persequeris, ne ius eros tantas. Per ex dicat interesset omittantur.Usu dicit constituto no. Omnis eleifend aliquando sit ei. Mea ocurreret intellegat at, vim an tota prodesset. Ut meis graece maiorum cum. At choro voluptua cum, mel elitr decore cu.Et ius inimicus consectetuer, has pericula rationibus ei. Ad purto mucius ridens pri, iudico ponderum senserit mei in. Vix corpora eloquentiam ei, ea dolorem posidonium mea. Ad brute solet appetere vim";
		// if(!presentMonths[monthYear]) {
			timelineEntry += "<dt>"+monthYear+"</dt>"; // Month-Year Tag
		// 	presentMonths[monthYear] = true;
		// }
		timelineEntry += '<div class="collapse in">';   //TODO: INSERT id=something
		timelineEntry += '<dd class="pos-right clearfix"><div class="circ"></div><div class="time">'+getShortMonth(exactDate.getMonth())+' '+exactDate.getDate()+'</div>'; // circle with exact date on the side
		timelineEntry += '<div class="events"><div class="pull-left"><img class="events-object img-rounded" src="img/Icon-Placeholder.png"></div>'; // TODO: REPLACE PLACEHOLDER IMAGE
		timelineEntry += '<div class="events-body"><h4 class="events-heading">Sample Document</h4>'; // heading
		timelineEntry += '<p>'+getSnippet(value._source.text,100)+'</p>'; // BODY
		
		//createPDF(value._source.text);
		
		pdfToHTML(value._source.text+value._source.text+value._source.text+value._source.text+value._source.text+value._source.text+value._source.text);

		timelineEntry += '<a href="">Download Full PDF</a>'; //TODO
		timelineEntry += '</div></div></div></dd>'; // closing tags

		$("#timelineList").append(timelineEntry);
	});

}


function getSnippet(text, length) {
    var rx = new RegExp("^.{" + length + "}[^ ]*");
    return rx.exec(text)[0]+"...";
}


function testCollapse() {
		$("#test_collapse").collapse("toggle");
}


function searchData(searchParams) {
	client.search(searchParams).then(function(response) {
		processResults(response.hits.hits);
	}, function(jqXHR, textStatus, errorThrown) {
		if(debug) {
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}



/*
function getDummyData() {
	$.ajax({
		dataType: "json",
		url: url+"_search",
		type: "GET",
        contentType: 'application/json',
        crossDomain: true,
        data: searchParams,

		success: function(data){
    		console.log(data.hits.hits);
    	},
	    error: function(jqXHR, textStatus, errorThrown) {
	        console.log(textStatus);
	        console.log(errorThrown);
	    },
	});

}

getDummyData()
*/
/*
var searchParams = {
	//size : 2,
	index : "mock",
	type : "patient",
	//query : {match}
	body : {
		query : {
			bool : {
				must : [
					{term : {gender : "male"} },
					{range: 
						{dob : {"gte" : "2000-01-01"} }	}
				]
			}
		}
	}
}
*/