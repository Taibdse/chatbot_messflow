
const MenuJson = require('../app/models/entities/configMenuJson')

class MenuJsonService {

  static async addMenu(menuInfoArray){
    let menu = await MenuJson.find({name: 'system-menu'});
    parentMenu = menuInfoArray[0];
    
    parentMenu.id = 0;
    parentMenu.parent_id = -1;
    
    if(menu){  
      let parentIDArr = menu.data.filter(m => m.parent_id == -1).map(m => m.id);
      let max = Math.max(...parentIDArr);
      parentMenu.id = max + 10;
    }

    menuInfoArray.forEach(async (menu, index) => {
      if(index != 0) {
        menu.id = menuInfoArray[index - 1].id++;
        menu.parent_id = parentMenu.id;
      }
      let newMenu = new MenuJson(menu);
      let addedMenu = await newMenu.save();
      if(!addedMenu) return false; 
    })
    return true;
  }

  static async deleteMenu(delMenuInfo){
    if(!delMenuInfo) return false;

    let { source, url, name } = delMenuInfo;

    if(!source && !url && !name) return false;

    let menu = await MenuJson.findOne({name:'system-menu'});
    if(!menu) return false;
    
    let menuInfo = menu.data.find(m => {
      return m.source === source && m.url === url && m.name === name;
    });

    if(!menuInfo) return false;

    let deletedMenu = await MenuJson.findOneAndUpdate({name:'system-menu'}, {$pull: {data: menuInfo}});

    if(!deletedMenu) return false;

    if(menuInfo.parent_id != -1){
      let delCondition = { parent_id : menuInfo.id };

      let menu = await MenuJson.findOneAndUpdate({name: 'system-menu'}, {$pull: {data: delCondition}})
      if(!menu) return false;
    }
    return true;
  }
}

module.exports = MenuJsonService;


// {
//   "source": "abc", (option)
//   "name": "Content List",
//   "url": "#",
//   "css_class": "fa fa-book",
//   "authenticate": true (option, default true)
// },

// var configMenuJsonSchema = mongoose.Schema({	
// 	name: { type: String, default: 'system-menu' },
// 	data: [{
//     id:{ type: Number },
//     level:{ type: String },
//     name:{ type: String },
//     url:{ type: String },
//     parent_id:{ type: Number },
//     css_class:{ type: String },
//     authenticate:{ type: Boolean }
//   }],
//   system: { type : String, default: 'core' },
// 	content: { type: String, default: 'system-menu' }
// });