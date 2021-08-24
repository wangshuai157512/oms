const directiveList = {
  'drag' : {
    inserted : (el) => {
      el.onmousedown = ({pageX,pageY}) => {
        //获取鼠标落点和元素之间的距离
        var diffX = pageX - el.offsetLeft;
        var diffY = pageY - el.offsetTop;
        document.onmousemove = function ({pageX,pageY}) {
          //修改元素位置
          el.style.left = pageX - diffX + 'px';
          el.style.top = pageY - diffY + 'px';
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        }
      }
    }
  }
}

const install = Vue => {
  Object.keys(directiveList).forEach(item => {
    Vue.directive(item,directiveList[item])
  })
}

export default install
