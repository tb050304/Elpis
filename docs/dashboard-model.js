

{
    mode:'dashboard',//模板类型，不同模板类型对应不一样的模板数据结构
    name:'',//名称
    desc:'',//描述
    icon:'',//icon
    homePage:'',//首页（项目配置）
    //头部菜单
    menu:[{
        key:'',//菜单唯一描述,
        name:'',//菜单名称
        menuType:'',//枚举值，group/module

        //当 menuType == group时，可填
        subMenu:[{
            //可递归menuItem
        },...],

         //当 menuType == module时，可填
        moduleType:'', //枚举值：sider/iframe/custom/schema

         //当moduleType===sider时
        siderConfig:{
            menu:[{
                //可递归menuItem(除 moduleType===sider)
            }]
        },

        //当moduleType===iframe时
        iframeConfig:{
            path:'',//iframe路径
        },

        //当moduleType===custom时
        customConfig:{
            path:'',//自定义自由路径
        },

        //当moduleType===schema时
        schemaConfig:{
            api:'/api/user',//数据源API（遵循 RESTFUL 规范）
            schema:{//板块数据结构
                type:'object',
                properties:{
                    key:{
                        ...schema,//标准 schema 配置
                        type:'',//字段类型
                        label:''//字段的中文名
                    },
                    ...
                }
            }, 
             tableConfig:{},//table相关配置
             searchConfig:{},//search-bar相关配置
             components:{},//模块组件
        }
      
    }, ...]
}