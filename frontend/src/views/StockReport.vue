<template>
    <v-app>
        <v-app-bar app dark flat>
            <v-btn to="/dashboard" icon>
                <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Stock Count Report</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-main>
            <v-tabs>
                <v-tab>Create Report</v-tab>
                <v-tab-item>
                    <v-container fill-height fluid>
                        <v-row align="center" justify="center">
                            <v-col cols="12" sm="6">
                                <v-card style="padding:1rem;margin:1rem">
                                    <v-card-title>Range</v-card-title>
                                    <p>If you want to stop all categories. dont select category
                                        if you want to stop all types dont select types
                                    </p>
                                    <v-select
                                    outlined
                                    v-model="selected_cat"
                                    :items="allCategories"
                                    item-text="name"
                                    item-value="id"
                                    label="Category"
                                    persistent-hint
                                    return-object
                                    single-line
                                    ></v-select>
                                    <v-select
                                    outlined
                                    v-model="selected_type"
                                    :items="allTypes"
                                    item-text="name"
                                    item-value="id"
                                    label="Type"
                                    v-if="allTypes.length > 0"
                                    persistent-hint
                                    return-object
                                    single-line></v-select>
                                    <v-text-field outlined label="Date" type="date" v-model="date_input"></v-text-field>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn @click="generate()" dark>Generate</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
                <v-tab>View/Print Report</v-tab>
                <v-tab-item>
                    <v-card flat>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-text-field max-width="30rem" v-on:keyup.enter="getPrintableData()" v-model="print_doc_id" label="ID" hint="Enter Id and press enter" ></v-text-field>
                            <v-btn @click="getPrintableData()" text>View</v-btn>
                            <v-btn @click="print_table()" dark>Print</v-btn>
                        </v-card-actions> 
                        <div id="print_table"> 
                            <table border="1" style="border-collapse:collapse;width:100%">
                            <tr>
                                <th style="padding:10px">Item ID</th>
                                <th style="padding:10px">Category</th>
                                <th style="padding:10px">Sub Category</th>
                                <th style="padding:10px">Code</th>
                                <th style="padding:10px">Name</th>
                                <th style="padding:10px">Unit</th>
                                <th style="padding:10px">Sell Price</th>
                                <th style="padding:10px">Average Price</th>
                                <th style="padding:10px">System Quantity</th>
                                <th style="padding:10px">Physical Quantity</th>
                            </tr>
                            <tr v-for="(data) in print_data_list" :key="data.id">
                                <td style="padding:10px">{{data.id}}</td>
                                <td style="padding:10px">{{data.category_name}}</td>
                                <td style="padding:10px">{{data.sub_cat}}</td>
                                <td style="padding:10px">{{data.code}}</td>
                                <td style="padding:10px">{{data.name}}</td>
                                <td style="padding:10px">{{data.unit}}</td>
                                <td style="padding:10px">{{data.price}}</td>
                                <td style="padding:10px">{{data.avg_price}}</td>
                                <td style="padding:10px">{{data.last_system}}</td>
                                <td style="padding-top:20px;text-align:center">..................</td>
                            </tr>
                        </table>
                        </div>
                    </v-card>
                </v-tab-item>
                <v-tab>Edit Changes</v-tab>
                <v-tab-item>
                    <v-card flat>
                        <v-card-actions>
                            <v-card-title>Add Reported Data</v-card-title>
                            <v-spacer></v-spacer>
                            <v-text-field v-model="editDocument" v-on:keyup.enter="editDocumentLoad()" label="Document ID" hint="type document id and hit enter"></v-text-field>
                            <v-btn @click="editDocumentLoad()" text>Load</v-btn>
                            <v-btn @click="commit_changes()" dark>Done Changes</v-btn>
                        </v-card-actions>
                        <v-data-table
                        :items="data_lists"
                        :headers="data_list_headers"
                        >
                        <template v-slot:item.phy_data="{item}">
                            <v-text-field placeholder="Amount" @change="changed(item)" type="number" step="0.001" v-model="item.last_physical"  ></v-text-field>
                        </template>
                        <template v-slot:item.var_qty="{item}">
                            <p>{{Number(item.variance_qty).toFixed(3)}}</p>
                        </template>
                        <template v-slot:item.var_total="{item}">
                            <p>{{Number(item.variance_total).toFixed(2)}}</p>
                        </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
                <v-tab>History & posting</v-tab>
                <v-tab-item><history-report/></v-tab-item>
            </v-tabs>
            <v-dialog v-model="done_alert" width="20rem">
                <v-card >
                    <v-img :src="require('../assets/Done.png')"></v-img>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-card-title>Success!</v-card-title>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <p>ID : {{done_id}}</p>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="done_alert = false">Done!</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar" :timeout="timeout">
                {{error}}
                <template v-slot:action="{ attrs }">
                    <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
                </template>
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script>
//import ItemService from '../ItemService'
import StrService from '../StrService'
import HistoryReport from '../components/HistoryReport.vue'
import CommonGate from '../CommonGate'
export default {
    components:{
        HistoryReport,
    },
    data(){
        return {
            snackbar:false,
            done_alert:false,
            timeout:2000,
            print_data_list:[],
            print_doc_id:0,
            error:'',
            done_id:0,
            selected_cat:null,
            selected_type:null,
            editDocument:'',
            date_input:null,
            allCategories:[],
            allTypes:[],
            data_lists:[],
            data_list_headers:[
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Category",
                    value:"category_name"
                },{
                    text:"Sub Category",
                    value:"sub_cat"
                },{
                    text:"Code",
                    value:"code"
                },{
                    text:"Name",
                    value:"name"
                },{
                    text:"Unit",
                    value:"unit"
                },{
                    text:"Price",
                    value:"price"
                },{
                    text:"Average Price",
                    value:"avg_price"
                },{
                    text:"System",
                    value:"last_system"
                },{
                    text:"Physical",
                    value:"phy_data"
                },{
                    text:"Variance",
                    value:"var_qty"
                },{
                    text:"Variance Total",
                    value:"var_total"
                }
            ]
            
        }
    },
    watch:{
        "selected_cat":async function(){
            if(this.selected_cat != null){
                this.allTypes = await CommonGate.GetDataByID('items/type',this.selected_cat.id)
                //ItemService.GetTypes(this.selected_cat.id);
            }
        }
    },
    async created(){
        this.allCategories =await CommonGate.GetDataSet("items/cats")
        //await ItemService.GetAllCategories()
        if(localStorage.getItem('UserToken') == null){
            this.$router.push('/')
        }
    },
    methods:{
        changed(item){
            for(var i = 0 ; i < this.data_lists.length ; i++){
                if(this.data_lists[i].id == item.id){
                    this.data_lists[i].variance_qty =  Number(this.data_lists[i].last_physical) - Number(this.data_lists[i].last_system);
                    this.data_lists[i].variance_total = Number(this.data_lists[i].variance_qty) * Number(this.data_lists[i].avg_price);
                }
            }
        },
        async editDocumentLoad(){
            this.data_lists = await StrService.GetPrintableReport(this.editDocument)
        },
        async getPrintableData(){
            this.print_data_list = await StrService.GetPrintableReport(this.print_doc_id)
            console.log(this.print_data_list);
        },
        async print_table(){
            await this.$htmlToPaper("print_table")
        },
        async commit_changes(){
            var setup_list = [];
            var nullable = false;
            for(var i = 0 ; i < this.data_lists.length ; i++){
                var mmodel = {
                    item:this.data_lists[i].id,
                    document:this.data_lists[i].document,
                    last_physical:this.data_lists[i].last_physical,
                    variance_qty:this.data_lists[i].variance_qty,
                    variance_total:this.data_lists[i].variance_total
                }
                if(mmodel.variance_qty == null){
                    nullable = true;
                }else{
                    setup_list = setup_list.concat(mmodel);
                }
            }
            if(!nullable){
                await StrService.UpdateCountedStock(this.editDocument,setup_list);
                this.error = "Updated Successful!"
                this.snackbar = true;
            }else{
                this.error = "Threre are Not Updated Items, But All Updated Items Will Update"
                this.snackbar = true;
                await StrService.UpdateCountedStock(this.editDocument,setup_list);
            }
            this.data_lists = await StrService.GetPrintableReport(this.editDocument);
        },
        async generate(){
            if(this.date_input == null){
                this.error = "Please Insert Date"
                this.snackbar = true;
            }else{
                var cat;
                var type;
                if(this.selected_cat.id == null){
                    cat = "ALL"
                    type = "ALL"
                }else if(this.selected_type.id == null){
                    cat = this.selected_cat.id;
                    type = "ALL"
                }else{
                    cat = this.selected_cat.id;
                    type = this.selected_type.id
                }
                
                var res = await StrService.Generate(cat,type,this.date_input);
                this.done_id = res.id
                this.done_alert = true;
                this.selected_cat = null;
                this.selected_type = null;
                this.date_input = null;
                this.allTypes = []
            }
        }
    }
}
</script>

<style scoped>

</style>