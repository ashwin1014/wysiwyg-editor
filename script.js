 let commonFieldsArray = [
    { Name: "UniqueEventId", Value: "UniqueIdPlaceholder", key:"common-uniqueeventid" },
    { Name: "ProjectNameLbl", Value: "ProjectNamePlaceholder", key: "common-projectnamelbl" },
    { Name: "Status", Value: "FormCurrentStatusPlaceholder", key: "common-status"},
    { Name: "EventTitle", Value: "EventTitleDescription", key: "common-eventtitle" },
    { Name: "FormNameReview", Value: "FormNamePlaceholder", key: "common-formnamereview" },
    { Name: "Category", Value: "CategoriesAssignedToForm", key: "common-category" },
    { Name: "Classification", Value: "ClassificationExecutedInForm", key: "common-classification" },
    { Name: "DateEvent", Value: "DateEventPlaceholder", key: "common-dateevent" },
    { Name: "DueDateEvent", Value: "DueDateEventPlaceholder", key: "common-duedateevent" },
    { Name: "Reporter", Value: "ReporterDescriptionPlaceholder", key: "common-reporter" },
    { Name: "ExpirationDate", Value: "ExpirationDatePlaceholder", key: "common-expirationdate" },
    { Name: "RenewalDate", Value: "RenewalDatePlaceholder",key: "common-renewaldate" }
  ];

let doc = document.getElementById('emailContent');
let tagContainer = document.getElementById('tagContainer');
var lastIndexOfAmp = 0;

var ul = document.getElementById('tags');
var liSelected;
var index = -1;

(function(){
  doc.focus();
  doc.click();
}());


let executeEditorCommand = function(ele) {
    let command = ele.getAttribute("data-command");
   // document.execCommand(command, false, (val || ""));
    document.execCommand(command);
    doc.focus();
    doc.click();
}

let debounce = function (func, wait, immediate) {
    var timeout;
    return function() {        
        var context = this, args = arguments;
        var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

let onContentKeypress = debounce(function(e){
 //  console.log(words)
 let selectionContext = document.getSelection().anchorNode.textContent;    
 var len = ul.getElementsByClassName('common-variables').length-1;
 

    let tempSearch = "";
    for(let i=document.getSelection().focusOffset; i>=0; i--) {
        if(selectionContext.substr(document.getSelection().anchorOffset-1, 1) == "@") {
            //console.log(i);
            lastIndexOfAmp = i;           
            break;
        }
    }

    let checkLast = selectionContext.substr(document.getSelection().anchorOffset-2, 2);
    console.log(checkLast)

    if(e.key === '@' && checkLast !== "@@" && checkLast.trim().length<=1){
        let coords = getSelectionCoords();
        tempSearch = selectionContext.substring(lastIndexOfAmp+1, document.getSelection().anchorOffset);
        $("#tagContainer").show()
        .css({
            'top': coords.y + 20, 
            'left': coords.x - 10
        });
       generateSuggestionsList(lastIndexOfAmp, true); 
       $('.common-variables:not(.display-none, .variableHeader)')[0].classList.add('selected');
             
    }


    else if ($("#tagContainer").is(":visible") && e.keyCode === 38) {       //on up arrow   
        var selected = $(".selected");
        $("#tagContainer .common-variables").removeClass("selected");
        if (selected.prev().length == 0) {
            selected.siblings().last().addClass("selected");
        } else {
            selected.prev().addClass("selected");
        }

    }

    else if($("#tagContainer").is(":visible") && e.keyCode === 40){ // on down arrow
        var selected = $(".selected");
        $("#tagContainer .common-variables").removeClass("selected");
        if (selected.next().length == 0) {
            selected.siblings().first().addClass("selected");
        } else {
            selected.next().addClass("selected");
        }
    }


        else if ($("#tagContainer").is(":visible") && e.keyCode === 13 ){ 
            e.preventDefault();   //on enter key        
            $('.selected').click();
        //    placeCaretAtEnd(document.getElementById('emailContent'));       
        }


    else if (/\s/g.test(selectionContext.substr(document.getSelection().anchorOffset-1, 1)) || selectionContext.substr(document.getSelection().anchorOffset-1, 1) === "") {//if space && @@
        tagContainer.style.display = "none";
        doc.click();
        doc.focus();
    }

    else if (e.keyCode === 32 || checkLast === "@@") {//if space && @@
        tagContainer.style.display = "none";
        doc.click();
        doc.focus();
    }


    else if($("#tagContainer").is(":visible")) {
        tempSearch = selectionContext.substring(lastIndexOfAmp, document.getSelection().anchorOffset);
        filterItems(tempSearch);      
    }
},150);


let subjectKeypress = function (event) {
    if (event.keyCode === 13 && $("#tagContainer").is(":visible")) {
        event.preventDefault();
    }
};

let generateSuggestionsList = function (ampPosition, isContent){
    $("div#tags").empty();
    let li = '';
    li +='<button type="button" class="list-group-item variableHeader">Common</button>';
        commonFieldsArray.map(function(value, index){
            li +='<button type="button" id="'+value.key+'" class="list-group-item white-border common-variables" onmouseenter="hoverIn(this)" onmouseleave="hoverOut(this)"  onclick="selectedTag(this,\'' + ampPosition + '\',\'' + isContent + '\')">'+value.Name+'</button>';
            $("#tags").append(li);
            li='';
            return li;
        });
    };

    let hoverIn = function(ele) {
        $("#tagContainer .common-variables").removeClass("selected");
        ele.classList.add('selected')
    }

    let hoverOut = function(ele) {
        ele.classList.remove('selected')
    }
  
  
    let selectedTag = function(element, ampPosition, isContent){
        
        let textContent;
        if(element.textContent != undefined){
            textContent = element.textContent
        } else{
            textContent =element.text()
        }
        let valueToInsert = "[" + textContent + "]";

        window.getSelection().anchorNode.textContent = window.getSelection().anchorNode.textContent.substr(0, (ampPosition - 0)-1)
        + valueToInsert + window.getSelection().anchorNode.textContent.substr(window.getSelection().focusOffset, window.getSelection().anchorNode.textContent.length);

        tagContainer.style.display = "none";    

    }

    let filterItems = function (searchedWord) {
        let listItems = $('button.list-group-item.common-variables');
        let isContainerShowHide = false;
        for (let i = 0; i < listItems.length; i++) {
            let listText = $('button.list-group-item.common-variables')[i].innerHTML;
            if (listText.toLowerCase().match(searchedWord.toLowerCase())) {          
                // $('button.list-group-item.common-variables')[i].style.display = '';
                $('button.list-group-item.common-variables')[i].classList.remove('display-none');
                isContainerShowHide = true;
            } else {
                $('button.list-group-item.common-variables')[i].classList.add('display-none');
            }
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
                if (range.getClientRects().length>0){
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
                    span.appendChild( document.createTextNode("\u200b") );
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


let placeCaretAtEnd = function (el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
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



