
function GetStringNumValue(str) {
    return str.match(/[0-9]+/)
}

/* 动态生成样式 */
var CssList = []
var css = ''
var GenerateCSSRegs = [
  {
    className: 'width',
    regExp: /(w\d+p?)/g
  },
  {
    className: 'height',
    regExp: /(h\d+p?)/g,
  },
  {
    className: 'LineHeight',
    regExp: /(lh\d+)/g
  },
  {
    className: 'margin',
    regExp: /(m[trbl]?n?\d+)/g
  },
  {
    className: 'padding',
    regExp: /(p[trbl]?n?\d+)/g
  }
    
]

Array.prototype.contains = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return true
    }
  }
  return false
}
String.prototype.contains = function(val) {
  return this.indexOf(val) >= 0
}

module.exports = function autoStyle (fileSource) {
  // let str = "<div class='h10 w10'></div><div class='h20 w20'><img class='mt100'/></div>"
  let str = fileSource
  // let matchList = str.match(/class\s*=\s*["'][a-zA-Z0-9\s]+["']/g)
  let matchList = str.match(/staticClass:\s*["'][a-zA-Z0-9\s]+["']/g)
  matchList && matchList.forEach(item => {
    let val = item.trim().substring(14)
    val = val.substring(0, val.length -1)
    let regClass = val.split(' ')
    regClass.forEach(classStr => {
      filterClass(classStr)
    })
  })
   
  function filterClass (classStr) {
    let v = classStr
    let numVal = GetStringNumValue(v)
    GenerateCSSRegs.forEach(cssRegs => {
      if (v.match(cssRegs.regExp) && v.length && !CssList.contains(v) && numVal) {
        CssList.push(v)
        switch (cssRegs.className) {
          case 'width': 
            css += `.${v} { width: ${numVal}${v.contains('p') ? '%' : 'px'}; }\n`
            break
          case 'height':
            css += `.${v} { height: ${numVal}${v.contains('p') ? '%' : 'px'}; }\n`
            break
          case 'margin':
            var direction = v.contains('t') ? '-top' : v.contains('r') ? '-right' : v.contains('b') ? '-bottom' : v.contains('l') ? '-left' : ''
            css += '.' + v + ' { margin' + direction + ': ' + (v.contains('n') ? '-' : '') + numVal + 'px; }\n'
            break
          case 'padding':
            var direction = v.contains('t') ? '-top' : v.contains('r') ? '-right' : v.contains('b') ? '-bottom' : v.contains('l') ? '-left' : '';
            css += '.' + v + ' { padding' + direction + ': ' + (v.contains('n') ? '-' : '') + numVal + 'px; }\n';　　// n开头的值，代表负值
            break
        }
      }
    })
  }
  return css
}