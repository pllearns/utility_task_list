document.addEventListener('DOMContentLoaded', function(){
  console.log('DOM READy')
  var source;

  var taskListItems = document.querySelectorAll('.task-list-item')
  console.log(taskListItems);

  function getDraggableTarget(event){
    var target = event.target
    while(target && !target.draggable){ target = target.parentNode }
    return target
  }

  function isbefore(a, b) {
    console.log('isBefore', a.parentNode == b.parentNode)
    if (a.parentNode == b.parentNode) {
      for (var cur = a; cur; cur = cur.previousSibling) {
        if (cur === b) {
          return true;
        }
      }
    }
    return false;
  }

  var dragenter = function(event){
    event.preventDefault()
    var target = getDraggableTarget(event)
    if (isbefore(source, target)) {
      target.parentNode.insertBefore(source, target);
    }
    else {
      target.parentNode.insertBefore(source, target.nextSibling);
    }
    // console.log('dragenter');
  }
  var dragstart = function(event){
    source = event.target;
    event.dataTransfer.effectAllowed = 'move';
    // console.log('dragstart');
  }
  var dragend = function(event){
    event.preventDefault()
    // console.log('dragend');
    saveTaskRanks()
  }

  var saveTaskRanks = function(){
    var newRanks = {}
    $('.task-list-item').map(function(index){
      var node = $(this)
      newRanks[node.data('task-id')] = index
    })
    console.log(newRanks)
    $.post('/tasks/set-ranks', newRanks)
  }

  ;[].forEach.call(taskListItems, function(taskListItem){
    console.log(taskListItem);
    taskListItem.draggable = true
    taskListItem.addEventListener('dragenter', dragenter, false)
    taskListItem.addEventListener('dragstart', dragstart, false)
    taskListItem.addEventListener('dragend', dragend, false)
  })

})
