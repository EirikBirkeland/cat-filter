"use strict"
const m = require('mithril')
window.m = m

const Util = {
   interleave(a, b){
      if (a.length != b.length) throw new Error("Oops!")
      return a.reduce((acc, ele, i) => {
         var arr = []
         arr.push(a[i], b[i])
         acc = acc.concat(arr)
         return acc
      }, [])
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
   // TODO: This is a dummy data source. Try other methods.
   // TODO: Grab 5 random sentences from Tatoeba.
   const vm = {}

   vm.sourceList = [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
   ]

   vm.targetList = [
      "Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien.",
      "Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.",
      "Lorem Ipsum har tålt tidens tann usedvanlig godt, og har i tillegg til å bestå gjennom fem århundrer også tålt spranget over til elektronisk typografi uten vesentlige endringer",
      "Lorem Ipsum ble gjort allment kjent i 1960-årene ved lanseringen av Letraset-ark med avsnitt fra Lorem Ipsum, og senere med sideombrekkingsprogrammet Aldus PageMaker som tok i bruk nettopp Lorem Ipsum for dummytekst."
   ]

   vm.initList = function (inputArray) {
      const list = new app.ItemList
      inputArray.forEach((ele)=> {
         list.push(new app.Item(ele))
      })
      return list
   }

   vm.processInput = function (arrayToProcess) {
      return function (matchText) {
         arrayToProcess.forEach(function (ele) {
            ele.notMatch(!ele.value().match(matchText))
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
