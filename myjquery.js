"use strict";
require("./style.css")

const mithril = require('mithril')
const dmp = require('diff-match-patch')
const bacon = require('baconjs')
const $ = require('jquery')

window.app = (() => {
   var sourceTd = Array.from($('tr td:nth-child(1)'))
   var targetTd = Array.from($('tr td:nth-child(2)'))

   $('#source, #target').on('input', (e) => {
      var val = e.target.value;
      var id = e.target.id;
      if (!$('#regex')[0].checked) {
         console.log("is not checked")
         val = escapeRegExp(val);
      }
      if (id === 'source') {
         sourceTd.forEach((ele) => {
            changeFormat(ele, val)
         })
      }
      if (id === 'target') {
         targetTd.forEach((ele) => {
            changeFormat(ele, val)
         })
      }
   })

   $('#regex').on('click', (e) => {
      console.log("clicked")
      updateAll()
   })

   $(sourceTd).on('input', (e) => {
      changeFormat(e.target, $('#source').val())
   })
   $(targetTd).on('input', (e) => {
      changeFormat(e.target, $('#target').val())
   })

   function changeFormat(ele, targetVal) {
      if (ele.textContent.match(targetVal)) {
         $(ele).css('color', '')
         $(ele).css('text-decoration', '')
      } else {
         $(ele).css('color', 'grey')
         $(ele).css('text-decoration', 'line-through')
      }
   }

   function updateAll() {
      sourceTd.forEach((ele) => {
         var sourceVal = $('#source').val()
         if (!$('#regex')[0].checked) sourceVal = escapeRegExp(sourceVal);
         changeFormat(ele, sourceVal)
      })
      targetTd.forEach((ele) => {
         var targetVal = $('#target').val()
         if (!$('#regex')[0].checked) targetVal = escapeRegExp(targetVal);
         changeFormat(ele, targetVal)
      })
   }

   function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
   }

   return {
      sourceTd,
      targetTd
   }
})()
