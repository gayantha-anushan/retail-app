<template>
    <div>
        <v-tabs>
            <v-tab>
                Items
            </v-tab>
            <v-tab>
                Categories & types
            </v-tab>
            <v-tab-item>
                <v-card style="padding:1rem;margin:1rem">
                    <v-card-actions>
                        <v-card-title>All Items</v-card-title>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search_item_list" label="Search"></v-text-field>
                    </v-card-actions>
                    <v-data-table
                    :items="items"
                    :search="search_item_list"
                    class="elevation-1"
                    item-key="_id"
                    :headers="itheader">
                        <template v-slot:item.controls="{item}">
                            <div>
                                <v-btn v-if="cp && item.sttatus == 'ACTIVE' && item.rep_block == 0" icon  @click="DeleteItem(item.id)" >
                                    <v-icon>mdi-close-octagon</v-icon>
                                </v-btn>
                                <v-btn v-if="cp && item.sttatus == 'DEACTIVE' && item.rep_block == 0" icon  @click="ActivateItem(item.id)" >
                                    <v-icon>mdi-check-circle</v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <template v-slot:item.status="{item}">
                            <div>
                                <v-chip label v-if="item.sttatus == 'ACTIVE'">Active</v-chip>
                                <v-chip label v-if="item.sttatus == 'DEACTIVE' && item.rep_block == 1">Report Progress</v-chip>
                                <v-chip label v-if="item.sttatus == 'DEACTIVE' && item.rep_block == 0">Deactivated</v-chip>
                            </div>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="newItemDialog" max-width="30rem">
                        <v-card style="padding:1rem">
                            
                            <v-card-title>Add New Items</v-card-title>
                            <v-text-field label="Code" v-model="code"></v-text-field>
                            <v-text-field label="Name" v-model="itemName"></v-text-field>
                            <v-textarea
                            v-model="itemDescription"
                            label="Description"
                            auto-grow
                            outlined
                            rows="4"
                            row-height="25"
                            shaped
                            ></v-textarea>
                            <v-select
                            :items="CategoryNames"
                            label="Select Category"
                            v-model="sellcattt"
                            filled></v-select>
                            <v-select
                            :items="typeNames"
                            label="Select Type"
                            v-model="selltypee"
                            filled></v-select>
                            <v-select
                            v-model="unitSelection"
                            :items="sunits"
                            filled
                            label="Unit"></v-select>
                            <v-text-field v-model="itqty" type="number" step="0.001" filled label="Available Quantity"></v-text-field>
                            <v-text-field v-model="itup" type="number" step="0.01" filled label="Unit Price (Sale)"></v-text-field>
                            <v-text-field v-model="unit_value" step="0.01" type="Number" filled label="Unit Value"></v-text-field>
                            <v-text-field v-model="itdisc" label="Discount" filled></v-text-field>
                            <v-progress-linear v-if="progress" indeterminate color="black"></v-progress-linear>
                            <v-card-actions>
                                <v-btn @click="newItemDialog = false" text>Cancel</v-btn>
                                <v-btn @click="AddItem()" dark>Add</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn v-if="cp" fab dark color="primary" @click="newItemAdd()" fixed right small bottom>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-card> 
            </v-tab-item>
            <v-tab-item v-if="gp">
            <v-container>
                <v-row>
                    <v-col xs="12" sm="12" md="6" lg="6" xl="6">
                        <v-card>
                            <v-card-actions>
                                <v-card-title>Categories</v-card-title>
                                <v-spacer></v-spacer>
                                <v-text-field width="20rem" label="search or add Category" prepend-inner-icon="mdi-magnify" v-model="newcat" ></v-text-field>
                                <v-btn dark fab small style="margin:1rem" color="primary" @click="AddNewCat()"><v-icon>mdi-plus</v-icon></v-btn>
                            </v-card-actions>
                            <v-data-table :search="newcat" :headers="catHeads" :items="categories">
                                <template  v-slot:item.actions="{item}">
                                    <div>
                                        <v-btn color="lime darken-3" icon style="margin-right:5px" @click.stop="vtype(item.id)"><v-icon>mdi-filter-variant</v-icon></v-btn>
                                        <!-- <v-btn color="red darken-3" icon @click.stop="DeleteCategory(item.id)" ><v-icon>mdi-delete</v-icon></v-btn> -->
                                    </div>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                    <v-col xs="12" sm="12" md="6" lg="6" xl="6">
                        <div v-if="viewType">
                            <v-card>
                                <v-card-actions>
                                    <v-card-title>Sub Categories</v-card-title>
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="newType" label="Search or add new Sub Category" prepend-inner-icon="mdi-magnify"></v-text-field>
                                    <v-btn fab small margin="1rem" @click="AddNewType()" color="primary"><v-icon>mdi-plus</v-icon></v-btn>
                                </v-card-actions>
                                <v-data-table :headers="typHeads" :search="newType" :items="types">
                                    <!-- <template v-slot:item.actions={item}>
                                        <div>
                                            <v-btn icon color="red darken-1"  @click="RemType(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
                                        </div>
                                    </template> -->
                                </v-data-table>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
            
            
            </v-tab-item>
        </v-tabs>
        <v-dialog max-width="20rem" v-model="questDialog">
            <v-card style="padding:1rem">
                Are you sure deactive this Item ?
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="blockItem()">Yes</v-btn>
                    <v-btn text @click="questDialog=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :timeout="timeout">
        {{error}}
        <template v-slot:action="{attrs}">
            <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false">Close</v-btn>
        </template>
    </v-snackbar>
    </div>
</template>

<script>
import ItemService from '../ItemService'
import CommonGate from '../CommonGate'

export default {
    name:"Items",
    data() {
        return {
            questDialog:false,
            newItemDialog:false,
            itqty:0,
            itup:0,
            itdisc:"",
            code:"",
            e6:1,
            snackbar:false,
            error:"",
            progress:false,
            timeout:2000,
            unit_value:0,
            newcat:"",
            search_item_list:"",
            newType:"",
            categories:[],
            CategoryNames:[],
            typeNames:[],
            itemName:"",
            itemDescription:"",
            catSelection:"",
            sellcattt:"",
            typeSelection:"",
            unitSelection:"",
            viewType:false,
            types:[],
            items:[],
            selltypee:"",
            catoftypes:"",
            newItemName:"",
            newItemDescription:"",
            newItemUnit:"",
            sunits:["grams","meters","feet","purch","Liters","Nos"],
            catHeads:[
                {
                    text:"Category",
                    value:"name"
                },{
                    text:"",
                    value:"actions"
                }
            ],
            typHeads:[
                {
                    text:"Sub Category  ",
                    value:"name"
                },{
                    text:"",
                    value:"actions"
                }
            ],
            itheader:[
                {
                    text:"",
                    value:"controls"
                },
                                {
                    text:"category",
                    value:"catrgory"
                },
                {
                    text:"Sub Category",
                    value:"typei"
                },
                {
                    text:"ID",
                    value:"id"
                },
                {
                    text:"Code",
                    value:"code"
                },
                {
                    text:"Name",
                    value:"name"
                },
                {
                    text:"Description",
                    value:"description"
                },
                {
                    text:"Unit",
                    value:"unit"
                },
                {
                    text:"Quantity",
                    value:"quantity"
                },
                {
                    text:"Ordered Quantity",
                    value:"orders"
                },
                {
                    text:"Price",
                    value:"price"
                },
                {
                    text:"Discount",
                    value:"discount"
                },
                {
                    text:"Status",
                    value:"status"
                }
            ],
            gp:false,
            cp:false,
            delItem:null,
        }
    },
    watch:{
        "sellcattt":function(){
            this.check();
        }
    },
    methods: {
        async ActivateItem(id){
            await ItemService.ActivateItem(id);
            this.items = await CommonGate.GetDataSet("items/it")

            this.error = "Activated";
            this.snackbar = true;
        },
        async AddNewCat(){
            if(this.newcat != ""){
                await ItemService.InsertCategory(this.newcat)
                this.categories = await CommonGate.GetDataSet("items/cats")
                this.newcat = ""
            }else{
                this.error = "Cannot Insert Category";
                this.snackbar = true;
            }
        },
        async DeleteCategory(id){
            await ItemService.DeleteCategory(id)
            this.categories = await CommonGate.GetDataSet("items/cats")
        },
        newItemAdd(){
            if(this.categories.length > 0){
                for(var i = 0 ; i < this.categories.length ; i++){
                    this.CategoryNames = this.CategoryNames.concat(this.categories[i].name)
                }
                this.newItemDialog = true;
            }else{
                this.error = "You need to create least ont category and type"
                this.snackbar = true;
            }
        },
        async vtype(id){
            this.viewType = true
            this.catoftypes = id
            this.types = await CommonGate.GetDataByID('items/type',this.catoftypes)
        },
        async check(){
            for(var k = 0 ; k < this.categories.length ; k++){
                if(this.categories[k].name == this.sellcattt){
                    this.catSelection = this.categories[k].id;
                }
            }
            this.types = await CommonGate.GetDataByID('items/type',this.catSelection)
            this.typeNames = []
            for(var i = 0 ; i < this.types.length ; i++){
                this.typeNames = this.typeNames.concat(this.types[i].name);
            }
        },
        async AddNewType(){
            if(this.newType != ""){
                await ItemService.InsertType(this.catoftypes,this.newType);
                this.types = await CommonGate.GetDataByID('items/type',this.catoftypes)
                this.newType = ""
            }else{
                this.error = "Cannot Insert Empty Sub Category!"
                this.snackbar = true;
            }
        },
        async RemType(name){
            await ItemService.DeleteType(this.catoftypes,name);
            this.types = await CommonGate.GetDataByID('items/type',this.catoftypes)
        },
        async AddItem(){
            this.progress = true
            var seltypeeid = 0
            for(var i = 0 ; i < this.types.length ; i++){
                if(this.types[i].name == this.selltypee){
                    seltypeeid = this.types[i].id;
                }
            }
            if(this.unit_value == ''){
                this.unit_value = 0;
            }
            if(seltypeeid > 0){
            await ItemService.InsertItem(this.code,this.itemName,this.itemDescription,this.unitSelection,this.sellcattt,seltypeeid,this.itqty,this.itup,this.itdisc,this.unit_value);
            }
            this.code = ""
            this.itemName = ""
            this.itemDescription = "",
            this.unitSelection = "",
            this.typeSelection = "",
            this.catSelection = ""
            this.e6 = 1
            this.itqty = 0
            this.itup = 0
            this.itdisc = ""
            this.items = await CommonGate.GetDataSet("items/it")
            this.progress = false;
            this.newItemDialog = false;
        },
        async blockItem(){
            await ItemService.DeleteItem(this.delItem)
            this.items = await CommonGate.GetDataSet("items/it")
            this.questDialog = false;
        },
        DeleteItem(id){
            this.delItem = id;
            this.questDialog = true
        }
    },
    async created() {
        var prm = await this.$store.state.permissions;
        if(prm.length == 0 ){
            this.$store.commit('checkpermissions',localStorage.getItem('UserToken'));
            prm = await this.$store.state.permissions;
        }
        prm = await this.$store.state.permissions;
        for(var i = 0 ; i < prm.length ; i++){
            if(prm[i].permission == "Grouping Items"){
                this.gp = true;
            } 
            if(prm[i].permission == "Change Items"){
                this.cp = true;
            }
        }
        this.categories = await CommonGate.GetDataSet("items/cats")
        this.items = await CommonGate.GetDataSet("items/it")
    },
}
</script>

<style>

</style>