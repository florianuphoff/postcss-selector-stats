'use strict';

const postcss = require('postcss')

module.exports = postcss.plugin('postcss-code-duplication', opts => {
  /**
   * opts: 
   * reportStartingLine: true,
   * reportOriginSource: true,
   */

  return (root, result) => {

    let selectorList = []

    root.walkRules((rule) => {
      const parent = rule.parent
      if (parent.type === 'atrule' && parent.name === 'keyframes') {
        return
      }

      selectorList.push({selector: rule.selector, startsAt: rule.source.start.line})
      
    })
    result.warn('Gathered statistics', selectorList)
  }
})