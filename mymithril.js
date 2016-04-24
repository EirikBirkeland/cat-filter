"use strict"
const m = require('mithril')
const $ = require('jquery')
window.m = m // Exposing to global object just for testing purposes

const Util = {
   interleave(a, b){
      if (a.length !== b.length) throw new Error("The input arrays must be of equal length.")
      return a.reduce((acc, ele, i) => {
         let arr = []
         arr.push(a[i], b[i])
         acc = acc.concat(arr)
         return acc
      }, [])
   },
   initArray(len){ // This method creates an iterable array, while "new Array(n)" doesn't. -E
      let array = []
      for (let i = 0; i < len; i++) {
         array[i] = undefined
      }
      return array
   }
}

const app = {}

app.Item = function (str) {
   this.value = m.prop(str)
   this.notMatch = m.prop(false)
}

app.ItemList = Array

app.vm = (function () {

   // TODO: Think about how I can improve Tatoeba by using this.
   // TODO: Add highlighting option for matches
   // TODO: Add buttons to sort the lines.
   // TODO: Add parallell processing (web workers?) and 'submit' button.

   const vm = {}

   const TABLE_LINES = 1000

   vm.sourceList = Util.initArray(TABLE_LINES)
   vm.targetList = Util.initArray(TABLE_LINES)

   vm.sourceList.counter = 0
   vm.targetList.counter = 0

   // TODO: At present, the source and target segments are mutated. They should probably be preserved. (immutable data)
   vm.lists = m.prop('')
   m.request({method: "GET", url: "nob.json"}) // m.request functions are pre-promisified, so no need for bluebird!
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
         // The input array-object should have its own "counter" property
         arrayToProcess.counter = 0
         arrayToProcess.forEach(function (ele) {
            if (!ele.value().match(matchText)) {
               ele.notMatch(true)
            } else {
               ele.notMatch(false)
               arrayToProcess.counter += 1
            }
         })
      }
   }

   vm.init = function () {
      vm.sourceList = app.vm.initList(app.vm.sourceList)
      vm.targetList = app.vm.initList(app.vm.targetList)
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
      m('table', {
         border: 1
      }, [
         m('thead', [
            m('tr', [
               m('th', 'Source'),
               m('th', 'Target')
            ]),
            m('tr', [
               m('th', {textContent: app.vm.sourceList.counter, title: "Number of matches"}),
               m('th', {textContent: app.vm.targetList.counter, title: "Number of matches"})
            ])
         ]),
         m('tbody', [
            app.vm.sourceList.map((ele, i) => {
               // Hide entire line (TR element) if anything on it is matched.
               return m('tr', {style: {display: (app.vm.sourceList[i].notMatch() || app.vm.targetList[i].notMatch() ? "none" : "")}}, [
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
