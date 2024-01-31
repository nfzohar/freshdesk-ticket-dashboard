<template>
  <button
    class="primary-button w-20 h-10 text-center bg-primary-500 hover:bg-primary-600 border-none py-2 shadow-md shadow-primary-600 hover:font-semibold"
    v-text="'Export'"
    :title="'Export tickets to excel'"
    @click="exportTickets()"
  />
</template>

<script lang="ts">
import { clone } from 'lodash'
import format from 'date-fns/format'
import { defineComponent } from 'vue'
import writeXlsxFile from 'write-excel-file'

export default defineComponent({
  name: 'TIcketExcelExporter',

  emits: ['startExport', 'finishExport'],

  props: {
    allTickets: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      defaultHeaders: [
        'ID',
        'Subject',
        'Created at',
        'Updated at',
        'Due by',
        'Requester',
        'Type',
        'Tags',
        'Status'
      ]
    }
  },

  computed: {
    statuses(): any {
      return Object.values(this.$dashboard?.statuses) ?? []
    },
    customFields() {
      return Object.keys(this.allTickets[0].custom_fields)
    }
  },

  methods: {
    async exportTickets() {
      this.$emit('startExport')

      const columnOptions = {
        fileName: 'ticket_export_' + format(new Date(), 'dd_MM_yyyy')
      }

      let headers = this.buildHeadersRow()
      const exportData = [headers]

      this.allTickets.forEach((ticket) => {
        let row = this.buildExportRow(ticket)

        exportData.push(row)
      })

      await writeXlsxFile(exportData, columnOptions).finally(() => {
        this.$emit('finishExport')
      })
    },

    buildExportRow(ticket: Object) {
      let basicRow = [
        // ID
        {
          type: Number,
          fontWeight: 'bold',
          align: 'center',
          value: ticket?.id
        },
        // Subject
        {
          type: String,
          value: ticket?.subject
        },
        // Created at
        {
          type: Date,
          align: 'center',
          value: new Date(ticket?.created_at),
          format: 'dd-mm-yyyy'
        },
        // Updated at
        {
          type: Date,
          align: 'center',
          value: new Date(ticket?.updated_at),
          format: 'dd-mm-yyyy'
        },
        // Due by
        {
          type: Date,
          align: 'center',
          value: new Date(ticket?.due_by),
          format: 'dd-mm-yyyy'
        },
        // Requester
        {
          type: String,
          value: ticket?.requester?.name
        },
        // Type
        {
          type: String,
          value: ticket?.type
        },
        // Tags
        {
          type: String,
          value: ticket?.tags?.length ? ticket?.tags?.toString() : 'N/A'
        },
        // Status
        {
          type: String,
          value: this.getStatusLabel(ticket?.status)
        }
      ]

      if (this.customFields?.length) {
        this.customFields.forEach((field) => {
          basicRow.push({
            type: String,
            value: ticket?.custom_fields[field] || 'N/A'
          })
        })
      }

      return basicRow
    },

    buildHeadersRow() {
      let headers = []
      let template = {
        value: '',
        fontWeight: 'bold',
        backgroundColor: '#C6C6C6'
      }

      this.defaultHeaders.forEach((header) => {
        let aHeader = clone(template)
        aHeader.value = header
        headers.push(aHeader)
      })

      if (this.customFields?.length) {
        this.customFields.forEach((field) => {
          let customFieldHeader = clone(template)
          customFieldHeader.value = this.titleCase(field)
          headers.push(customFieldHeader)
        })
      }

      return headers
    },

    getStatusLabel(statusId: string) {
      return this.statuses.filter((status) => status?.id == statusId)[0].label
    },

    titleCase(word: String) {
      return String(word)
        .replace('_', ' ')
        .replace('_', ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  }
})
</script>
