
//Copy from the first comment and display
function ShowComments(id, author, content, time, point, parentId){
    var allCommentNode = document.getElementById("allComment")
    var sample = allCommentNode.firstChild;
    var sampleVote = sample.firstChild;
    var sampleComment = sample.childNodes[1];
    var sampleCommentInputArea = sampleComment.firstChild;

    var cloneNode = sample.cloneNode(false);
    var cloneVote = sampleVote.cloneNode(true);
    var cloneComment = sampleComment.cloneNode(false);
    var cloneCommentInputArea = sampleCommentInputArea.cloneNode(true);

    cloneNode.id = id;
    cloneNode.appendChild(cloneVote);
    cloneNode.appendChild(cloneComment);

    cloneVote.childNodes[0].onclick = function(){
        Upvote(id, cloneVote.childNodes[0]);
    }
    cloneVote.childNodes[1].innerHTML = point;
    cloneVote.childNodes[2].onclick = function(){
        Downvote(id, cloneVote.childNodes[0]);
    }

    cloneComment.appendChild(cloneCommentInputArea);
    cloneCommentInputArea.childNodes[0].innerHTML = content;
    cloneCommentInputArea.childNodes[2].firstChild.innerHTML= author + "&nbsp&nbsp&nbsp&nbsp" + time + "&nbsp&nbsp&nbsp&nbsp";
    cloneCommentInputArea.childNodes[2].childNodes[1].onclick = function(){
        ShowCommentArea(cloneCommentInputArea.childNodes[2].childNodes[1]);
    };
    cloneCommentInputArea.childNodes[3].childNodes[2].onclick = function(){
        AddComment(id, cloneCommentInputArea.childNodes[3].childNodes[2]);
    }
    if (parentId == "0") {
        cloneNode.className = "each_comment_0";
        allCommentNode.appendChild(cloneNode);
    } else {
        var grandfatherNode = document.getElementById(parentId);
        fatherNode = grandfatherNode.lastChild;
        var className = "each_comment_" + 
        ((parseInt((grandfatherNode.className).substr(-1)) + 1)%2).toString();
        cloneNode.className = className;
        fatherNode.appendChild(cloneNode);
    }

}
/*-----------------------functions called----------------------------*/
function TextNode() {
    var fatherNode = document.getElementById("loginArea");
    var textNode = document.createElement('p');
    var userName = document.cookie;
    textNode.innerHTML = "login as: "+userName;
    fatherNode.appendChild(textNode);
}

function ChangeUser(elem) {
    elem.parentNode.childNodes[3].className = "input_author_area0";
    elem.parentNode.childNodes[4].className = "submit_author_button0";
}

function SubmitUser(elem) {
    var userName = elem.parentNode.childNodes[3].value;
    document.cookie=userName;
    elem.parentNode.childNodes[1].innerHTML = "login as: "+document.cookie;
    elem.parentNode.childNodes[3].className = "input_author_area1";
    elem.className = "submit_author_button1";
}

function Upvote(id, elem){
    var formData = {author: document.cookie,
                    id: id
                    };
        $.ajax({url:'/upvote/', type:'put', data:formData}).done(function(data) {
            if (data === "Error") return err;
            var point = parseInt(data) + parseInt(elem.parentNode.childNodes[1].innerHTML);
            elem.parentNode.childNodes[1].innerHTML = point.toString();
        })
}

function Downvote(id, elem){
    var formData = {author: document.cookie,
                    id: id
                    };
        $.ajax({url:'/downvote/', type:'put', data:formData}).done(function(data) {
            if (data === "Error") return err;
            var point = parseInt(data) + parseInt(elem.parentNode.childNodes[1].innerHTML);
            elem.parentNode.childNodes[1].innerHTML = point.toString();
        })
}

function ShowCommentArea(elem){
    elem.parentNode.parentNode.parentNode.childNodes[3].className = 'add_comment0';
}


function AddComment(parentId, elem){
    var author = document.cookie;
    var content = elem.parentNode.childNodes[0].value;
    var time = Date.now();
    if (content === "") {
        window.alert("You did not input any content");
        return;
    }
    var formData = {content : content,
                    author  : author,
                    time    : time,
                    parentId: parentId};
    $.ajax({url:'/addcomment', 
            type:'post', 
            data: formData}).success(function(data){
                ShowComments(data, author, content, Date(time), "0", parentId);
                if (parentId !== "0") {
                    elem.parentNode.className = "add_comment1";
                }
                elem.parentNode.childNodes[0].value = "";
            });
}



