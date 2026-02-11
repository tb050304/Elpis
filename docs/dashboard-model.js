

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
            api:'',//数据源API（遵循 RESTFUL 规范）
            schema:{//板块数据结构
                type:'object',
                properties:{
                    key:{
                        ...schema,//标准 schema 配置
                        type:'',//字段类型
                        label:''//字段的中文名,
                        //字段在 table 中的相关配置
                        tableOption:{
                            ...elTableColumnConfig, //标准el-table-column 配置
                            toFixed:0,//保留小数点后几位
                            visiable:true,// 默认为true(false表示不在表单中显示)
                        },
                         //字段在 schema-bar 中的相关配置
                         searchOption:{
                            ...eleComponentConfig,//标准 el-component-column 配置
                            comType:'',//配置组件类型 input/select/......
                            default:'',//默认值

                            //comType==='select'
                            enumList:[],//下拉框可选项

                            //comType==='dynamicSelect'
                            api:''
                         }
                    },
                    ...
                }
            }, 
            //table相关配置
             tableConfig:{
                headeruButtons:[{
                    label:'',//按钮中文名
                    eventKey:'',//按钮事件名
                    eventOption:{},//按钮事件具体配置
                    ...elButtonConfig//标准el-button配置
                }...],
                rowButtons:[{
                    label:'',//按钮中文名
                    eventKey:'',//按钮事件名
                     eventOption:{
                        //当eventKey==='remove'
                        params:{
                            //paramKey=参数的键值
                            //rowValueKey=参数值 (当格式为 schema::tableKey的时候，到table 中找相应的字段)
                            paramKey:rowValueKey
                        }
                     },//按钮事件具体配置
                    ...elButtonConfig//标准el-button配置
                }...],
             },
             searchConfig:{},//search-bar相关配置
             components:{},//模块组件
        }
      
    }, ...]
}