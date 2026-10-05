migrate((app) => {
 const users=app.findCollectionByNameOrId('users');
 users.fields.add(new SelectField({name:'role',values:['registered','client','team','admin'],maxSelect:1}));
 users.fields.add(new TextField({name:'company',max:200}));
 users.createRule="@request.body.role:isset = false || @request.body.role = 'registered'";
 users.updateRule="(id = @request.auth.id && @request.body.role:changed = false) || @request.auth.role = 'admin'";
 users.listRule="id = @request.auth.id || @request.auth.role = 'admin'";users.viewRule=users.listRule;app.save(users);
 const dates=[{name:'created',type:'autodate',onCreate:true},{name:'updated',type:'autodate',onCreate:true,onUpdate:true}];
 const admin="@request.auth.role = 'admin'";
 function make(name,fields,rules){let col;try{col=app.findCollectionByNameOrId(name);}catch{col=new Collection({name,type:'base',fields:fields.concat(dates),...rules});app.save(col);}}
 make('enquiries',[{name:'name',type:'text',required:true,max:200},{name:'email',type:'email',required:true},{name:'company',type:'text',max:200},{name:'service',type:'text',max:200},{name:'message',type:'text',required:true,max:10000},{name:'status',type:'select',values:['new','qualified','proposal','won','closed'],maxSelect:1}],{createRule:"@request.body.status:isset = false",listRule:admin,viewRule:admin,updateRule:admin,deleteRule:admin});
 const owner={name:'owner',type:'relation',collectionId:users.id,maxSelect:1,required:true,cascadeDelete:true};
 const own="@request.auth.id != '' && owner = @request.auth.id";
 make('saved_results',[owner,{name:'title',type:'text',required:true,max:200},{name:'result',type:'text',max:5000}],{createRule:"@request.auth.id != '' && @request.body.owner = @request.auth.id",listRule:own,viewRule:own,updateRule:own,deleteRule:own});
 make('support_tickets',[owner,{name:'title',type:'text',required:true,max:200},{name:'message',type:'text',required:true,max:10000},{name:'status',type:'text',max:50}],{createRule:"@request.auth.id != '' && @request.body.owner = @request.auth.id && @request.body.status:isset = false",listRule:`(${own}) || ${admin}`,viewRule:`(${own}) || ${admin}`,updateRule:admin,deleteRule:admin});
 make('projects',[owner,{name:'title',type:'text',required:true,max:200},{name:'status',type:'text',max:100},{name:'progress',type:'number',min:0,max:100},{name:'notes',type:'text',max:10000}],{createRule:admin,listRule:`(${own}) || ${admin}`,viewRule:`(${own}) || ${admin}`,updateRule:admin,deleteRule:admin});
 make('theme_settings',[{name:'navy',type:'text',max:30},{name:'gold',type:'text',max:30},{name:'radius',type:'number',min:0,max:24}],{createRule:admin,listRule:'',viewRule:'',updateRule:admin,deleteRule:admin});
},(app)=>{['theme_settings','projects','support_tickets','saved_results','enquiries'].forEach(n=>app.delete(app.findCollectionByNameOrId(n)));const users=app.findCollectionByNameOrId('users');users.fields.removeByName('role');users.fields.removeByName('company');users.createRule='';users.updateRule='id = @request.auth.id';users.listRule='id = @request.auth.id';users.viewRule=users.listRule;app.save(users);});
