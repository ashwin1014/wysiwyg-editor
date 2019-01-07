$(document).on('keydown', function(e) {
  // console.log(this, e.target);
  if ($("#tagContainer").is(":visible")) {
    let key = e.charCode || e.keyCode;
    if (key == 37 || key == 38 || key == 39 || key == 40) {
      e.preventDefault();
    } else { }
  }
});

let commonFieldsArray = [
  { Name: "Unique EventId", Value: "UniqueIdPlaceholder", key: "common-uniqueeventid" },
  { Name: "Project NameLbl", Value: "ProjectNamePlaceholder", key: "common-projectnamelbl" },
  { Name: "Status", Value: "FormCurrentStatusPlaceholder", key: "common-status" },
  { Name: "Event Title", Value: "EventTitleDescription", key: "common-eventtitle" },
  { Name: "Form Name Review", Value: "FormNamePlaceholder", key: "common-formnamereview" },
  { Name: "Category", Value: "CategoriesAssignedToForm", key: "common-category" },
  { Name: "Classification", Value: "ClassificationExecutedInForm", key: "common-classification" },
  { Name: "Date Event", Value: "DateEventPlaceholder", key: "common-dateevent" },
  { Name: "Due Date of Event", Value: "DueDateEventPlaceholder", key: "common-duedateevent" },
  { Name: "Reporter", Value: "ReporterDescriptionPlaceholder", key: "common-reporter" },
  { Name: "Expiration Date", Value: "ExpirationDatePlaceholder", key: "common-expirationdate" },
  { Name: "Renewal Date", Value: "RenewalDatePlaceholder", key: "common-renewaldate" }
];

let standardVariableArray = [
  { Name: "Lorem ipsum", key: "12" },
  { Name: "dolor sit amet", key: "23" },
  { Name: "consectetur adipiscing elit", key: "34" },
  { Name: "JavaScript", key: "45" },
  { Name: "Python Django", key: "56" },
  { Name: "Python Flask", key: "67" },
];

let doc = document.getElementById('emailContent');
let tagContainer = document.getElementById('tagContainer');
var lastIndexOfAmp = 0;

var ul = document.getElementById('tags');
var liSelected;
var index = -1;

(function() {
  doc.focus();
  doc.click();
}());


let executeEditorCommand = function(ele) {
  let command = ele.getAttribute("data-command");
  // document.execCommand(command, false, (val || ""));
  document.execCommand(command);
  doc.focus();
  doc.click();
};

let debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

let onContentKeypress = debounce(function(e) {
  let selectionContext = document.getSelection().anchorNode.textContent;
  let tempSearch = "";
  for (let i = document.getSelection().focusOffset; i >= 0; i--) {
    if (selectionContext.substr(document.getSelection().anchorOffset - 1, 1) == "@") {
      //console.log(i);
      lastIndexOfAmp = i;
      break;
    }
  }
  let checkLast = selectionContext.substr(document.getSelection().anchorOffset - 2, 2);
  console.log(checkLast);

  if (e.key === '@' && checkLast !== "@@" && checkLast.trim().length <= 1) {
    let coords = getSelectionCoords();
    tempSearch = selectionContext.substring(lastIndexOfAmp + 1, document.getSelection().anchorOffset);
    $("#tagContainer").show('fast')
      .css({
        'top': coords.y + 20,
        'left': coords.x - 10
      });
    generateSuggestionsList(lastIndexOfAmp, true);
    $('.common-variables').not('.display-none').not('.variableHeader')[0].classList.add('selected');
    //    $('#emailContent').focusout();
    //    $('#tags').focus();
  }


  // else if ($("#tagContainer").is(":visible") && e.keyCode === 38) { //on up arrow
  //
  //     let selected = $(".selected").not(".display-none").not('.variable-header');
  //     $("#tagContainer .element").removeClass("selected").not('.display-none');
  //     if (selected.prev().length == 0) {
  //         selected.siblings().last().addClass("selected").not('.display-none');
  //     } else {
  //         selected.prev().addClass("selected").not('.display-none');
  //     }
  //     e.preventDefault();
  //  //   $('.element:not(:first-child).element-hover').removeClass('element-hover').prev().addClass('element-hover');
  // }
  //
  // else if($("#tagContainer").is(":visible") && e.keyCode === 40){ // on down arrow
  //
  //     let selected = $(".selected").not( ".display-none" ).not('.variable-header');
  //     $("#tagContainer .element").removeClass("selected").not('.display-none');
  //     if (selected.next().length == 0) {
  //         selected.siblings().first().addClass("selected").not('.display-none');
  //     } else {
  //         selected.next().addClass("selected").not('.display-none');
  //     }
  //     e.preventDefault();
  //   //  $('.element:not(:last-child).element-hover').removeClass('element-hover').next().addClass('element-hover');
  // }


  // else if ($("#tagContainer").is(":visible") && e.keyCode === 13) {
  //   e.preventDefault();   //on enter key
  //   $('.selected').click();
  //   placeCaretAtEnd(document.getElementById('emailContent'));
  // }


  else if (selectionContext.substr(document.getSelection().anchorOffset - 1, 1) === "") {//if space && @@
    tagContainer.style.display = "none";
    doc.click();
    doc.focus();
  }

  else if (checkLast === "@@") {//if space && @@
    tagContainer.style.display = "none";
    doc.click();
    doc.focus();
  }


  // else if($("#tagContainer").is(":visible")) {
  //     tempSearch = selectionContext.substring(lastIndexOfAmp, document.getSelection().anchorOffset);
  //     filterItems(tempSearch);
  // }


  // if($("#tagContainer").is(":visible")) {
  //         setTimeout(function(){
  //         $("#tagContainer").scrollTop(0);//set to top
  //         let val;
  //         if($('.selected').length>0) {
  //           $('.selected').offset().top+60 - $("#tags").height();
  //           $("#tagContainer").scrollTop(val);
  //         }
  //  },160);
  // }

}, 150);

let filterWord = debounce(function(e) {
  let selectionContext = document.getSelection().anchorNode.textContent;

   if ($("#tagContainer").is(":visible") && e.keyCode === 38) { //on up arrow
    let selected = $(".selected").not(".display-none").not('.variable-header');
    $("#tagContainer .element").removeClass("selected").not('.display-none');
    if (selected.prev().length == 0) {
      selected.siblings().last().addClass("selected").not('.display-none');
    } else {
      selected.prev().addClass("selected").not('.display-none');
    }
    e.preventDefault();
  }

  else if ($("#tagContainer").is(":visible") && e.keyCode === 40) { // on down arrow
    let selected = $(".selected").not(".display-none").not('.variable-header');
    $("#tagContainer .element").removeClass("selected").not('.display-none');
    if (selected.next().length == 0) {
      selected.siblings().first().addClass("selected").not('.display-none');
    } else {
      selected.next().addClass("selected").not('.display-none');
    }
    e.preventDefault();
  }

  else if ($("#tagContainer").is(":visible")) { // send word to filter
    tempSearch = selectionContext.substring(lastIndexOfAmp, document.getSelection().anchorOffset);
    filterItems(tempSearch);
  }

  // else if ($("#tagContainer").is(":visible") && e.keyCode === 13) {
  //   e.preventDefault();   //on enter key
  //   $('.selected').click();
  //   placeCaretAtEnd(document.getElementById('emailContent'));
  // }

  if ($("#tagContainer").is(":visible")) {// scroll on arrow keys
    $("#tagContainer").scrollTop(0);//set to top
    let val;
    if ($('.selected').length > 0) {
      val = $('.selected').offset().top + 270 - $("#tags").height();
      $("#tagContainer").scrollTop(val);
    }
  }
},150);


let contentKeypress = function(e) {
  e = e || event;
  // if (e.keyCode === 13 && $("#tagContainer").is(":visible")) {
  //   e.preventDefault();
  //   e.stopPropagation();
  // }
   if ($("#tagContainer").is(":visible") && e.keyCode === 13) {
    e.preventDefault();   //on enter key
    $('.selected').click();
    placeCaretAtEnd(document.getElementById('emailContent'));
  }
};


let generateSuggestionsList = function(ampPosition, isContent) {
  $("div#tags").empty();
  let li = '';
  li += '<button type="button" class="list-group-item variableHeader element element-hover variable-content">Common</button>';
  commonFieldsArray.map(function(value) {
    li += '<button type="button" id="' + value.key + '" class="list-group-item white-border common-variables element variable-content" onclick="selectedTag(this,\'' + ampPosition + '\',\'' + isContent + '\')">' + value.Name + '</button>';
    $("#tags").append(li);
    li = '';
    return li;
  });
  li += '<button type="button" class="list-group-item standard-variables variableHeader text-capitalize element variable-content">Standard Variables</button>';
  standardVariableArray.map(function(sdtVars) {
    li += '<button type="button" data-key="' + sdtVars.key + '" id="ques-' + sdtVars.key + '" class="list-group-item standard-variables white-border element variable-content" onclick="selectedTag(this,\'' + ampPosition + '\',\'' + isContent + '\')">' + sdtVars.Name + '</button>';
    $("#tags").append(li);
    li = '';
    return li;
  });
};

let selectedTag = function(element, ampPosition, isContent) {

  let textContent;
  if (element.textContent != undefined) {
    textContent = element.textContent;
  } else {
    textContent = element.text();
  }
  let valueToInsert = "[" + textContent + "]";

  window.getSelection().anchorNode.textContent = window.getSelection().anchorNode.textContent.substr(0, (ampPosition - 0) - 1) + valueToInsert + window.getSelection().anchorNode.textContent.substr(window.getSelection().focusOffset, window.getSelection().anchorNode.textContent.length);

  tagContainer.style.display = "none";
  // $('#emailContent').blur();
  placeCaretAtEnd(document.getElementById('emailContent'));
};

let filterItems = function(searchedWord) {
  generateSuggestionsList(lastIndexOfAmp, null, true);
  let listItems = $('button.list-group-item.variable-content');
  let isContainerShowHide = false;
  for (let i = 0; i < listItems.length; i++) {
    let listText = listItems[i].innerHTML;
    if (listText.toLowerCase().match(searchedWord.toLowerCase().trim())) {
      listItems[i].classList.remove('display-none');
      // listItems.not('.display-none')[0].classList.add('selected');
      isContainerShowHide = true;
    } else {
      listItems[i].classList.add('display-none');
      $('#tags button.display-none').remove();
      //  listItems.not('.display-none')[0].classList.remove('selected');
    }
    if (listItems.not('.display-none')[0] && listItems.not('.display-none')[0].classList) listItems.not('.display-none')[0].classList.add('selected');
  }

  if (isContainerShowHide) $("#tagContainer").show();

};


// get x & y position in pixels
let getSelectionCoords = function() {
  var sel = document.selection, range, rect;
  var x = 0, y = 0;
  if (sel) {
    if (sel.type != "Control") {
      range = sel.createRange();
      range.collapse(true);
      x = range.boundingLeft;
      y = range.boundingTop;
    }
  } else if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        range.collapse(true);
        if (range.getClientRects().length > 0) {
          rect = range.getClientRects()[0];
          x = rect.left;
          y = rect.top;
        }
      }
      // Fall back to inserting a temporary element
      if (x == 0 && y == 0) {
        var span = document.createElement("span");
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild(document.createTextNode("\u200b"));
          range.insertNode(span);
          rect = span.getClientRects()[0];
          x = rect.left;
          y = rect.top;
          var spanParent = span.parentNode;
          spanParent.removeChild(span);
          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }
    }
  }
  return { x: x, y: y };
};


let placeCaretAtEnd = function(el) {
  el.focus();
  if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
};
