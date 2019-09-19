'use strict';

const postcss = require('postcss')

module.exports = postcss.plugin('postcss-selector-stats', opts => {
  const reportStartingLine = opts.reportStartingLine || true
  const reportOriginSource = opts.reportOriginSource || true

  /**
   * opts: 
   * reportStartingLine: true,
   * reportOriginSource: true,
   */

  return (root, result) => {
    let selectorList = []

    const consumer = root.source.input.map.consumerCache
    
    root.walkRules((rule) => {
      const parent = rule.parent
      let selector = rule.selector
      if (parent.type === 'atrule' && parent.name === 'keyframes') {
        return
      }

      if(selector.includes(',')) {
        const sArray = selector.split(',')
        
        sArray.forEach(sel => {
          if(sel.includes('\n')) {
            const newSel = sel.replace('\n','')
            addToSelectorList(newSel.trim(), rule.source.start.line, rule.source.start.column)
          } else {
            addToSelectorList(sel.trim(), rule.source.start.line, rule.source.start.column)
          }
        })
      } else {
        addToSelectorList(rule.selector, rule.source.start.line, rule.source.start.column)
      }
    })

    function addToSelectorList(selector, line, column) {
      if(reportStartingLine && reportOriginSource) {
        selectorList.push({selector: selector, startsAt: line, origin: consumer.originalPositionFor({ line: line, column: column }).source})
      } else if(reportStartingLine && !reportOriginSource) {
        selectorList.push({selector: selector, startsAt: line, origin: ''})
      } else if(!reportStartingLine && reportOriginSource) {
        selectorList.push({selector: selector, startsAt: 0, origin: consumer.originalPositionFor({ line: line, column }).source})
      }
    }

    result.messages.push({
      type: 'selectorstats',
      plugin: 'postcss-selector-stats',
      stats: selectorList
    })
  }
})