var express = require('express')
var router = express.Router()
var users = require('./users')
var database = require('../database')
var moment = require('moment')

document.addEventListener('DOMContentLoaded', function(){
  console.log('DOM ready')
  const source

  const taskList = document.querySelector('.task-list')
  const taskListItems = taskList.querySelectorAll('.task-list-item')

  [].forEach.call(taskListItems) => {
    taskListItem.draggable = true
    taskListItem.addEventListener('dragenter', dragenter, false)
    taskListItem.addEventListener('dragstart', dragstart, false)
    taskListItem.addEventListener('dragend', dragend, false)
  }
}

isbefore(a, b) => {
  console.log('isBefore', a.parentNode == b.parentNode)
  if (a.parentNode == b.parentNode) {
    for (var cur = a; cur; cur = cur.previousSibling) {
      if (cur === b) {
        return true
      }
    }
  }
  return false
}

dragstart(e) => {
  source = e.target
  e.dataTransfer.effectAllowed = 'move'
}

dragenter(e) => {
  e.preventDefault()
  const target = getDraggableTarget(e)
  if (isbefore(source, target)) {
    target.parentNode.insertBefore(source, target)
  }
  else {
    target.parentNode.insertBefore(source, target.nextSibling)
  }
}

dragend(e) => {
  console.log('DRAG END')
  e.preventDefault()
  const target = getDraggableTarget(e)
  logRankChanges(target.parentNode)
}

logRankChanges(node) => {
  console.log('RANK CHANGE', node);
  const taskListItems = [].slice.call(node.children).map(function(taskListItem, index) {
    taskListItem.querySelector('.task-list-item-rank').innerText = index
    return {
      node: taskListItem,
      description: taskListItem.querySelector('.task-list-item-description').innerText,
      prevRank: parseInt(taskListItem.querySelector('.task-list-item-rank').innerText,10),
      newRank: index,
    }
  })

    taskListItems.forEach(taskListItem) => {
      console.log( `${taskListItem.description} moved from ${taskListItem.prevRank} to ${taskListItem.newRank}`)
  }

  getDraggableTarget(event) => {
    const target = event.target
    while(target && !target.draggable){ target = target.parentNode}
    return target
  }
}, false);

module.exports = router
