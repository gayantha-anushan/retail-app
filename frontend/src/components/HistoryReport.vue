<template>
    <v-card flat>
        <v-card>
            <v-card-title>POST</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-text-field v-model="document_id" label="Document ID" hint="Enter Document name what do you want to update"></v-text-field>
                <v-btn @click="postDocument()" text>POST</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        <v-card>
            <v-card-title>History</v-card-title>
            <v-data-table
            :items="historyReports"
            :headers="historyHeader"
            >
            <template v-slot:item.controls="{item}">
                <v-btn @click="view_in_printer(item)" icon>
                    <v-icon>mdi-printer-pos</v-icon>
                </v-btn>
            </template>
            <template v-slot:item.category="{item}">
                <p><span v-if="item.cat == 0">ALL</span><span v-else>{{item.cat}}</span></p>
            </template>
            <template v-slot:item.sub_category="{item}">
                <p><span v-if="item.sub_cat == 0">ALL</span><span v-else>{{item.sub_cat}}</span></p>
            </template>
            </v-data-table>
        </v-card>
        <v-dialog fullscreen v-model="printer_view">
            <v-card>
                <v-toolbar dark>
                    <v-toolbar-title>Stock Count Report</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="print_doc()" ><v-icon>mdi-printer-pos</v-icon></v-btn>
                    <v-btn @click="printer_view = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <div id="print_area">
                    <div style="text-align:center;border-bottom:2px solid #000000">
                            <h2>Stock Count Report</h2>
                    </div>
                    <div v-if="all_report_data != null && staged_data != null" style="display:flex;justify-content:space-between">
                        <div>
                            <p><b>ID : {{staged_data.id}} <br>
                            Category : </b><span v-if="staged_data.cat == 0">ALL</span><span v-else>{{staged_data.cat}}</span><br/>
                            <b>Sub Category : </b><span v-if="staged_data.sub_cat == 0">ALL</span><span v-else>{{staged_data.sub_cat}}</span></p>
                        </div>
                        <div>
                            <p><b>Date begin</b>{{staged_data.date_begin}}</p>
                            <p><b>Date end</b>{{staged_data.date_end}}</p>
                        </div>
                    </div>
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
                                <th style="padding:10px">Variance Quantity</th>
                                <th style="padding:10px">Variance Total</th>
                            </tr>
                            <tr v-for="(data) in all_report_data" :key="data.id">
                                <td style="padding:10px">{{data.id}}</td>
                                <td style="padding:10px">{{data.category_name}}</td>
                                <td style="padding:10px">{{data.sub_cat}}</td>
                                <td style="padding:10px">{{data.code}}</td>
                                <td style="padding:10px">{{data.name}}</td>
                                <td style="padding:10px">{{data.unit}}</td>
                                <td style="padding:10px">{{data.price}}</td>
                                <td style="padding:10px">{{data.avg_price}}</td>
                                <td style="padding:10px">{{data.last_system}}</td>
                                <td style="padding-top:20px;text-align:center">{{data.last_physical}}</td>
                                <td style="padding:10px">{{data.variance_qty}}</td>
                                <td style="padding:10px">{{data.variance_total}}</td>
                            </tr>
                        </table>
                    {{address}}
                </div>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :timeout="timeout">
                {{error}}
                <template v-slot:action="{ attrs }">
                    <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
                </template>
            </v-snackbar>
    </v-card>
</template>

<script>
import StrService from '../StrService'
import Reportservice from '../ReportService'

export default {
    name:"HistoryReport",
    data(){
        return{
            document_id:'',
            snackbar:false,
            error:'',
            address:null,
            staged_data:null,
            all_report_data:null,
            timeout:2000,
            printer_view:false,
            historyReports:[],
            historyHeader:[
            {
                text:"",
                value:"controls"
            },{
                text:'ID',
                value:"id"
            },{
                text:"Category",
                value:"category"
            },{
                text:"Sub Category",
                value:"sub_category"
            },{
                text:"Begin",
                value:"date_begin"
            },{
                text:"End",
                value:"date_end"
            }]
        }
    },
    created(){
        this.load_history();
    },
    methods:{
        print_doc(){
            this.$htmlToPaper("print_area")
        },
        async view_in_printer(item){
            this.staged_data = item;
            this.all_report_data = await StrService.GetPrintableHistoryReport(item.id)
            this.printer_view = true;
        },
        async postDocument(){
            if(Number(this.document_id) > 0){
                await StrService.CompleteReportChanges(this.document_id);
            }else{
                this.error = "Please Enter Valid ID";
                this.snackbar = true;
            }
            this.document_id = "";
            this.load_history();
        },
        async load_history(){
            try{
                this.historyReports = await Reportservice.GetHistorySTC();
            }catch(error){
                this.error = error.message;
                this.snackbar = true
            }
        }
    }
}
</script>

<style>

</style>