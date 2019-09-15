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
      if (parent.type === 'atrule' && parent.name === 'keyframes') {
        return
      }

      if(reportStartingLine && reportOriginSource) {
        selectorList.push({selector: rule.selector, startsAt: rule.source.start.line, origin: consumer.originalPositionFor({ line: rule.source.start.line, column: rule.source.start.column }).source})
      } else if(reportStartingLine && !reportOriginSource) {
        selectorList.push({selector: rule.selector, startsAt: rule.source.start.line, origin: ''})
      } else if(!reportStartingLine && reportOriginSource) {
        selectorList.push({selector: rule.selector, startsAt: 0, origin: consumer.originalPositionFor({ line: rule.source.start.line, column: rule.source.start.column }).source})
      }

      
    })
    result.warn('Gathered statistics', selectorList)
  }
})