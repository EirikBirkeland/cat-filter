"use strict"
const m = require('mithril')
const $ = require('jquery')
window.m = m

const Util = {
   interleave(a, b){ // unused, but keep for later
      if (a.length != b.length) throw new Error("Oops!")
      return a.reduce((acc, ele, i) => {
         var arr = []
         arr.push(a[i], b[i])
         acc = acc.concat(arr)
         return acc
      }, [])
   },
   initArray(len){
      let array = []
      for(let i=0;i<len;i++){
         array[i] = undefined
      }
      return array
   }
}

//model

const app = {}

app.Item = function (str) {
   this.value = m.prop(str)
   this.notMatch = m.prop(false)
}

app.ItemList = Array;

app.vm = (function () {

   // TODO: Think about how I can improve Tatoeba by using this.
   // TODO: Add highlighting option for matches
   // TODO: 

   const vm = {}

   const TABLE_LINES = 250

   vm.sourceList = Util.initArray(TABLE_LINES)
   vm.targetList = Util.initArray(TABLE_LINES)

   vm.sourceMatchCount = 0

   vm.lists = m.prop('')
   m.request({method: "GET", url: "nob.json"})
      .then((data) => {
         vm.sourceList.forEach((ele, i) => {
            vm.sourceList[i].value(data[i][0])
            vm.targetList[i].value(data[i][1])
         })
      })

   vm.initList = function (inputArray) {
      const list = new app.ItemList
      inputArray.forEach((ele)=> {
         list.push(new app.Item(ele))
      })
      return list
   }

   vm.processInput = function (arrayToProcess) {
      return function (matchText) {
         vm.sourceMatchCount = 0
         arrayToProcess.forEach(function (ele) {
            if(!ele.value().match(matchText)) {
               ele.notMatch(true)
            }
            else {
               vm.sourceMatchCount++
               ele.notMatch(false)
            }

         })
      }
   }

   vm.init = function () {
      vm.sourceList = app.vm.initList(app.vm.sourceList)
      vm.targetList = app.vm.initList(app.vm.targetList)
      window.sourceList = vm.sourceList
      vm.processSourceInput = app.vm.processInput(vm.sourceList)
      vm.processTargetInput = app.vm.processInput(vm.targetList)
   }

   return vm
})()

app.controller = function () {
   app.vm.init()
}

app.view = function (ctrl) {
   return [
      m('input', {oninput: m.withAttr('value', app.vm.processSourceInput)}),
      m('input', {oninput: m.withAttr('value', app.vm.processTargetInput)}),
      m('input', {
         type: 'checkbox',
         onclick: app.vm.combined
      }), "RegEx",
      m('br'),
      "Matching: ", app.vm.sourceMatchCount,
      m('table', {
         border: 1
      }, [
         m('thead', [
            m('tr', [
               m('th', 'Source'),
               m('th', 'Target')
            ])
         ]),
         m('tbody', [
            app.vm.sourceList.map((ele, i) => {
               return m('tr', [
                  m('td', {
                     contenteditable: '', style: {textDecoration: app.vm.sourceList[i].notMatch() ? "line-through" : ""}
                  }, app.vm.sourceList[i].value()),
                  m('td', {
                     contenteditable: '', style: {textDecoration: app.vm.targetList[i].notMatch() ? "line-through" : ""}
                  }, app.vm.targetList[i].value())
               ])
            })
         ])
      ])
   ]
}

m.mount(document.getElementById('mountPoint'), {controller: app.controller, view: app.view})
