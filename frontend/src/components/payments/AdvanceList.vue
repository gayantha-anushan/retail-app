<template>
    <v-card>
        <v-card-actions>
            <v-card-title>All Advances</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchText"></v-text-field>
        </v-card-actions>
        <v-data-table
        :search="searchText"
        :items="advanceList"
        :headers="advanceHeader"></v-data-table>
        </v-card>
</template>

<script>
import PaymentService from '../../PaymentService';

export default {
    name:"AdvanceList",
    props:['type'],
    data() {
        return {
            advanceList:[],
            searchText:"",
            advanceHeader:[
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Date",
                    value:"date"
                },{
                    text:"Customer",
                    value:"stake_name"
                },{
                    text:"Customer E-mail",
                    value:"email"
                },{
                    text:"Cash",
                    value:"cash"
                },{
                    text:"Bank",
                    value:"bank"
                },{
                    text:"Cheque",
                    value:"cheque"
                },{
                    text:"Total",
                    value:"total"
                },{
                    text:"Available",
                    value:"available"
                }
            ],
        }
    },
    async created() {
        this.advanceList = await PaymentService.GETAllAdvances(this.type);
    },
}
</script>

<style>

</style>