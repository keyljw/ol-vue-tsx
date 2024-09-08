export default {
  '/api/': getApiSidebar(),
  '/components/': getComponentsSidebar(),
  '/guide/': getGuideSidebar()
}

function getApiSidebar() {
  return [
    {
      text: '功能',
      collapsible: true,
      items: [
        {
          text: '已实现',
          link: '/api/'
        }
      ]
    }
  ]
}

function getComponentsSidebar() {
  return [
    {
      text: '基础组件',
      items: [
        {
          text: 'map 地图',
          link: '/components/map/index'
        },
        {
          text: 'draw 绘制',
          link: '/components/draw/index'
        },
        {
          text: 'layer 包裹容器',
          link: '/components/layer/index'
        },
        {
          text: 'point 标记点',
          link: '/components/point/index'
        },
        {
          text: 'html 自定义',
          link: '/components/html/index'
        },
        {
          text: 'pupop 弹出窗组件',
          link: '/components/pupop/index'
        },
        {
          text: 'line 线段',
          link: '/components/line/index'
        },
        {
          text: 'polygon 面',
          link: '/components/polygon/index'
        },
        {
          text: 'cluster 聚合点',
          link: '/components/cluster/index'
        },
        {
          text: 'control 控件',
          link: '/components/control/index'
        },
        {
          text: 'geoJson',
          link: '/components/geoJson/index'
        },
        {
          text: 'select 选中',
          link: '/components/select/index'
        },
        {
          text: 'draw 绘制',
          link: '/components/draw/index'
        }
      ]
    },
    {
      text: '进级组件',
      items: [
        {
          text: 'heatmap 热力图',
          link: '/components/heatmap/index'
        },
        {
          text: 'trajectory 轨迹',
          link: '/components/trajectory/index'
        },
        {
          text: 'drive 驾车轨迹',
          link: '/components/drive/index'
        },
        {
          text: 'search 搜索',
          link: '/components/search/index'
        }
      ]
    }
  ]
}

function getGuideSidebar() {
  return [
    {
      text: '指南',
      items: [
        {
          text: '开始使用',
          link: '/guide/'
        },
        {
          text: '地图样式',
          link: '/guide/olstyle'
        }
      ]
    }
  ]
}
